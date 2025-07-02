import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = gen_ai.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Track last request time for rate limiting
let lastRequestTime = 0;

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    // Enforce minimum 4-second interval between requests (15 requests/min = 1 every 4s)
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    const requiredDelay = Math.max(4000 - timeSinceLast, 0);
    
    if (requiredDelay > 0) {
        console.log(`Enforcing rate limit delay: ${requiredDelay}ms`);
        await sleep(requiredDelay);
    }

    for (let i = 0; i < retries; i++) {
        try {
            lastRequestTime = Date.now();
            return await fn();
        } catch (e: any) {
            const status = e.response?.status || e.status;
            if (status === 429 && i < retries - 1) {
                const backoffTime = Math.pow(2, i) * 4000; // Exponential backoff starting at 4s
                console.warn(`Rate limit hit. Retrying in ${backoffTime}ms...`);
                await sleep(backoffTime);
                continue;
            }
            throw e;
        }
    }
    throw new Error('Max retries exceeded');
}

export const aisummarizeCommit = async (diff: string) => {
    try {
        if (!diff.trim()) {
            return "No changes in this commit";
        }

        const prompt = `Please provide a concise summary of the following git diff:${diff}
Focus on:
1. What changed
2. Key files modified
3. Most important updates
Please keep it brief and technical.`;

        const response = await withRetry(() => model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 200,
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
        
        // Skip files that are too small or likely not code
        if (code.length < 50) {
            console.log(`Skipping ${doc.metadata.source} - too small (${code.length} chars)`)
            return ""
        }
        
        // Skip binary files or files with mostly non-text content
        const textRatio = code.replace(/[^\x20-\x7E]/g, '').length / code.length;
        if (textRatio < 0.7) {
            console.log(`Skipping ${doc.metadata.source} - low text ratio (${(textRatio * 100).toFixed(1)}%)`)
            return ""
        }
        
        const response = await withRetry(() => model.generateContent({
            contents: [{ 
                role: 'user', 
                parts: [{ 
                    text: `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects.

You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

Here is the code:
---
${code}
---

Give a comprehensive summary (100-150 words) of what this code does, its purpose, and key functionality. Focus on:
1. What this file/component does
2. Key functions or classes
3. How it fits into the overall project
4. Important patterns or concepts used

Make it informative and helpful for understanding the codebase.` 
                }] 
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 200,
                topP: 0.8,
                topK: 40,
            }
        }));
        
        const result = response.response.text();
        
        // Validate the result
        if (!result || result.trim().length < 20) {
            console.log(`Skipping ${doc.metadata.source} - summary too short`)
            return ""
        }
        
        return result.trim();
    }
    catch (error) {
        console.error(`Error summarizing ${doc.metadata.source}:`, error);
        return ""
    }
}

export async function generateEmbedding(summary: string) {
    try {
        if (!summary || summary.trim() === "") {
            console.log("Cannot generate embedding for empty summary");
            return null;
        }
        
        const model = gen_ai.getGenerativeModel({
            model: "text-embedding-004"
        })
        const result = await model.embedContent(summary)
        const embedding = result.embedding
        
        if (!embedding || embedding.values.length === 0) {
            console.log("Generated empty embedding");
            return null;
        }
        
        return embedding.values
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}