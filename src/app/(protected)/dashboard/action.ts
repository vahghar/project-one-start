'use server'

import { createStreamableValue } from 'ai/rsc'
import { generateEmbedding } from '@/lib/embedding'
import { db } from '@/server/db'
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()

    try {
        const queryVector = await generateEmbedding(question)
        const vectorQuery = `[${queryVector?.join(',')}]`

        // 1. High Relevance Search
        let result = await db.$queryRaw`
            SELECT "fileName", "sourceCode", "summary",
            1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
            FROM "sourceCodeEmbedding"
            WHERE "summaryEmbedding" IS NOT NULL
            AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
            AND "projectId" = ${projectId}
            ORDER BY similarity DESC LIMIT 5
        ` as any[]

        // 2. Medium Relevance Fallback
        if (result.length < 3) {
            let additionalResult = await db.$queryRaw`
                SELECT "fileName", "sourceCode", "summary",
                1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
                FROM "sourceCodeEmbedding"
                WHERE "summaryEmbedding" IS NOT NULL
                AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.3
                AND "projectId" = ${projectId}
                ORDER BY similarity DESC LIMIT 5
            ` as any[]
            
            // Deduplicate
            const newFiles = additionalResult.filter(newDoc => 
                !result.some(existing => existing.fileName === newDoc.fileName)
            );
            result = [...result, ...newFiles];
        }

        // 3. Low Relevance Fallback
        if (result.length < 3) {
             let finalResult = await db.$queryRaw`
                SELECT "fileName", "sourceCode", "summary",
                1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
                FROM "sourceCodeEmbedding"
                WHERE "summaryEmbedding" IS NOT NULL
                AND "projectId" = ${projectId}
                ORDER BY similarity DESC LIMIT 5
            ` as any[]

            const newFiles = finalResult.filter(newDoc => 
                !result.some(existing => existing.fileName === newDoc.fileName)
            );
            result = [...result, ...newFiles];
        }

        if (result.length === 0) {
            stream.update("I couldn't find any relevant code context.")
            stream.done()
            return { output: stream.value, fileReferences: [] }
        }

        // --- THE FIX ---
        // 1. Ensure 'result' is definitely an array
        // 2. Break the .map().join() chain to prevent runtime errors
        const docs = result || [];
        
        let context = "";
        for (const doc of docs) {
            context += `
**File:** ${doc.fileName}
\`\`\`
${doc.sourceCode}
\`\`\`
`;
        }

        // --- GROQ STREAMING ---
        (async () => {
            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert AI code assistant. Answer the user's question based strictly on the provided context."
                        },
                        {
                            role: "user",
                            content: `
                            Context:
                            ${context}

                            Question:
                            ${question}
                            `
                        }
                    ],
                    model: "llama-3.1-8b-instant",
                    stream: true,
                });

                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        stream.update(content);
                    }
                }
            } catch (err) {
                console.error("Error in Groq streaming:", err);
                stream.update("\n\n**Error:** Could not generate an answer. Please check your Groq API key.");
            } finally {
                stream.done();
            }
        })();

        return {
            output: stream.value,
            fileReferences: result
        }

    } catch (error) {
        console.error('Error in askQuestion:', error)
        stream.done()
        return { output: "Error processing request", fileReferences: [] }
    }
}