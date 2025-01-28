import { GoogleGenerativeAI } from "@google/generative-ai";

const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = gen_ai.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

export const aisummarizeCommit = async (diff: string) => {
    try {
        // Skip if diff is empty
        if (!diff.trim()) {
            return "No changes in this commit";
        }

        // Create a prompt that asks for a concise summary
        const prompt = `Please provide a concise summary of the following git diff:
        
 ${diff}

Focus on:
1. What changed
2. Key files modified
3. Most important updates
Please keep it brief and technical.`;

        // Generate the summary
        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,  // Lower temperature for more focused output
                maxOutputTokens: 200,  // Limit response length
                topP: 0.8,
                topK: 40,
            }
        });

        const result = await response.response.text();
        return result;

    } catch (error) {
        console.error('Error generating commit summary:', error);
        return `Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}