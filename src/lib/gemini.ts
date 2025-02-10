import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = gen_ai.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            await sleep(1000)
            return await fn()
        } catch (e:any) {
            if (e.status === 429 && i < retries - 1) {
                await sleep(Math.pow(2, i) * 2000)
                continue
            }
            throw e
        }
    }
    throw new Error('Max retries exceeded')
}

export const aisummarizeCommit = async (diff: string) => {
    try {
        // Skip if diff is empty
        if (!diff.trim()) {
            return "No changes in this commit";
        }

        // Create a prompt that asks for a concise summary
        const prompt = `Please provide a concise summary of the following git diff:${diff}
Focus on:
1. What changed
2. Key files modified
3. Most important updates
Please keep it brief and technical.`;

        // Generate the summary
        const response = await withRetry(() => model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,  // Lower temperature for more focused output
                maxOutputTokens: 200,  // Limit response length
                topP: 0.8,
                topK: 40,
            }
        }));

        const result = response.response.text();
        return result;

    } catch (error) {
        console.error('Error generating commit summary:', error);
        return `Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}

export async function summarizeCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects`,
            `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file`,
            `Here is the code:
        --- 
        ${code} 
        ---
        Give a summary no more than 100 words of the code above.`
        ])
        return response.response.text()
    }
    catch (error) {
        return ""
    }
}

export async function generateEmbedding(summary: string) {
    const model = gen_ai.getGenerativeModel({
        model: "text-embedding-004"
    })
    const result = await model.embedContent(summary)
    const embedding = result.embedding
    return embedding.values
}