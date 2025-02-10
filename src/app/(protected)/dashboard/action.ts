'use server'

import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import { db } from '@/server/db'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()

    try {
        // Get embeddings and similar documents
        const queryVector = await generateEmbedding(question)
        
        const result = await db.$queryRaw`
            SELECT 
                "fileName", 
                "sourceCode", 
                "summary",
                1 - ("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
            FROM "sourceCodeEmbedding"
            WHERE 
                1 - ("summaryEmbedding" <=> ${queryVector}::vector) > 0.1
                AND "projectId" = ${projectId}
            ORDER BY similarity DESC 
            LIMIT 10
        ` as { fileName: string; sourceCode: string; summary: string }[]

        if (result.length === 0) {
            stream.update("I couldn't find any relevant code context to answer your question.")
            stream.done()
            return { output: stream.value, fileReferences: [] }
        }

        // Build context string
        const context = result.map(doc => `
            Source: ${doc.fileName}
            ${doc.sourceCode}
            Summary: ${doc.summary}
            ---
        `).join('\n')

        const model = google('gemini-1.5-flash')
        
        const { textStream } = await streamText({
            model,
            prompt: `You are an AI code assistant answering questions about the codebase. Your target audience is a technical intern.
            
Context:
${context}

Question:
${question}

Important:
- Only use information from the provided context
- If the context doesn't contain the answer, say "I don't have enough context to answer that question"
- Provide detailed, step-by-step explanations when discussing code
- Use markdown syntax for formatting
- Include relevant code snippets when appropriate`,
            temperature: 0.7,
            maxTokens: 2048,
        })

        try {
            for await (const delta of textStream) {
                if (delta) {
                    stream.update(delta)
                }
            }
        } catch (error) {
            console.error('Error streaming response:', error)
            stream.update("\nAn error occurred while generating the response.")
        } finally {
            stream.done()
        }

        return {
            output: stream.value,
            fileReferences: result
        }
    } catch (error) {
        console.error('Error in askQuestion:', error)
        stream.update("An error occurred while processing your question.")
        stream.done()
        return {
            output: stream.value,
            fileReferences: []
        }
    }
}