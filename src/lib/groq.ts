import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = gen_ai.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Track last request time for rate limiting (Groq has strict rate limits)
let lastRequestTime = 0;

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    // Groq typically allows 2-3 requests per second depending on model
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    const requiredDelay = Math.max(500 - timeSinceLast, 0);
    
    if (requiredDelay > 0) {
        console.log(`Enforcing rate limit delay: ${requiredDelay}ms`);
        await sleep(requiredDelay);
    }

    for (let i = 0; i < retries; i++) {
        try {
            lastRequestTime = Date.now();
            return await fn();
        } catch (e: any) {
            const status = e.status || e.response?.status;
            if ((status === 429 || status === 503) && i < retries - 1) {
                const backoffTime = Math.pow(2, i) * 1000;
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

        const response = await withRetry(() => groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "mixtral-8x7b-32768", // or "llama3-70b-8192"
            temperature: 0.3,
            max_tokens: 200,
            top_p: 0.8,
        }));

        return response.choices[0]?.message?.content || "No summary generated";

    } catch (error) {
        console.error('Error generating commit summary:', error);
        return `Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}

export async function summarizeCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await withRetry(() => groq.chat.completions.create({
            messages: [{
                role: "system",
                content: "You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects"
            }, {
                role: "user",
                content: `Onboarding a junior engineer for ${doc.metadata.source}:
                --- 
                ${code} 
                ---
                Provide a 100-word summary of this code's purpose.`
            }],
            model: "mixtral-8x7b-32768",
            temperature: 0.2,
            max_tokens: 150,
            top_p: 0.7,
        }));
        
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Error generating code summary:', error);
        return "";
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