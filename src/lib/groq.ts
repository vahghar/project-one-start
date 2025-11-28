import Groq from "groq-sdk";
import { Document } from "@langchain/core/documents";
import pLimit from "p-limit";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// Track last request time for rate limiting (Groq has strict rate limits)
let lastRequestTime = 0;
const limit = pLimit(3);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Regex to find Groq's "try again in X.Xs" message
const groqRetryRegex = /Please try again in (\d+(\.\d+)?)s/;

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${retries} for Groq API call`);
      lastRequestTime = Date.now();
      return await fn();
    } catch (e: any) {
      const status = e.status || e.response?.status;
      const errorMessage = e.message || "";
      
      console.error(`Groq API Error (Attempt ${i + 1}):`, { status, message: errorMessage });

      if (i >= retries - 1) {
        throw new Error(`Groq API failed after ${retries} attempts: ${e.message}`);
      }

      if (status === 429 || status === 503) {
        let waitTime = Math.pow(2, i) * 1000; // Default: 1s, 2s, 4s

        // --- THIS IS THE FIX ---
        // Try to parse the specific wait time from Groq's error
        const match = errorMessage.match(groqRetryRegex);
        if (match && match[1]) {
          const apiWaitTimeInSeconds = parseFloat(match[1]);
          // Use the API's suggested time + a 500ms buffer
          waitTime = (apiWaitTimeInSeconds * 1000) + 1000; 
          console.log(`Groq API says to wait ${apiWaitTimeInSeconds}s.`);
        }
        // ------------------------
        const jitter = Math.random() * 1000;
        waitTime += jitter;
        
        console.warn(`Rate limited, retrying in ${waitTime}ms...`);
        await sleep(waitTime); // Wait the correct amount of time
        continue;
      }

      // It's not a 429/503 error, throw it
      throw new Error(`Groq API failed: ${e.message}`);
    }
  }
  throw new Error('Max retries exceeded');
}


/*

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
            model: "llama-3.1-8b-instant",
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
            model: "llama-3.1-8b-instant",
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

*/

export const aisummarizeCommit = async (diff: string) => {
    // Wrap logic in the limiter
    return limit(async () => {
        try {
            if (!diff.trim()) return "No changes in this commit";

            const prompt = `Please provide a concise summary of the following git diff:${diff}
            Focus on:
            1. What changed
            2. Key files modified
            3. Most important updates
            Please keep it brief and technical.`;

            const response = await withRetry(() => groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                temperature: 0.3,
                max_tokens: 200,
                top_p: 0.8,
            }));

            return response.choices[0]?.message?.content || "No summary generated";
        } catch (error) {
            console.error('Error generating commit summary:', error);
            return `Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    });
}

export async function summarizeCode(doc:Document) {
    // Wrap logic in the limiter
    return limit(async () => {
        console.log("Processing:", doc.metadata.source); // Log start
        try {
            // OPTIMIZATION: 10,000 chars is risky. 
            // If you can reduce this to 5,000, your rate limits will disappear.
            const code = doc.pageContent.slice(0, 5000); 

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
                model: "llama-3.1-8b-instant",
                temperature: 0.2,
                max_tokens: 150,
                top_p: 0.7,
            }));
            
            return response.choices[0]?.message?.content || "";
        } catch (error) {
            console.error(`❌ FAILED to summarize ${doc.metadata.source}:`, error);
            
            // Return null instead of "" so we can distinguish "empty file" vs "error"
            return null;
        }
    });
}