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
        const queryVector = await generateEmbedding(question)
        
        // First, try to find highly relevant files with a higher threshold
        let result = await db.$queryRaw`
            SELECT 
                "fileName", 
                "sourceCode", 
                "summary",
                1 - ("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
            FROM "sourceCodeEmbedding"
            WHERE 
                "summaryEmbedding" IS NOT NULL
                AND 1 - ("summaryEmbedding" <=> ${queryVector}::vector) > 0.3
                AND "projectId" = ${projectId}
            ORDER BY similarity DESC 
            LIMIT 5
        ` as { fileName: string; sourceCode: string; summary: string; similarity: number }[]

        console.log(`Found ${result.length} highly relevant files for question: "${question}"`)

        // If we don't have enough highly relevant files, lower the threshold and get more
        if (result.length < 3) {
            const additionalResult = await db.$queryRaw`
                SELECT 
                    "fileName", 
                    "sourceCode", 
                    "summary",
                    1 - ("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
                FROM "sourceCodeEmbedding"
                WHERE 
                    "summaryEmbedding" IS NOT NULL
                    AND 1 - ("summaryEmbedding" <=> ${queryVector}::vector) > 0.15
                    AND "projectId" = ${projectId}
                    AND "fileName" NOT IN (${result.length > 0 ? result.map(r => r.fileName) : ['']})
                ORDER BY similarity DESC 
                LIMIT ${5 - result.length}
            ` as { fileName: string; sourceCode: string; summary: string; similarity: number }[]
            
            result = [...result, ...additionalResult]
            console.log(`Added ${additionalResult.length} additional files, total: ${result.length}`)
        }

        // If still no results, try with even lower threshold
        if (result.length === 0) {
            result = await db.$queryRaw`
                SELECT 
                    "fileName", 
                    "sourceCode", 
                    "summary",
                    1 - ("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
                FROM "sourceCodeEmbedding"
                WHERE 
                    "summaryEmbedding" IS NOT NULL
                    AND "projectId" = ${projectId}
                ORDER BY similarity DESC 
                LIMIT 3
            ` as { fileName: string; sourceCode: string; summary: string; similarity: number }[]
            
            console.log(`Found ${result.length} files with lowest threshold`)
        }

        if (result.length === 0) {
            stream.update("I couldn't find any relevant code context to answer your question. This might be because:\n\n- The question is about a feature that hasn't been implemented yet\n- The codebase doesn't contain the specific functionality you're asking about\n- The question is too general or specific\n- The codebase hasn't been fully indexed yet\n\nPlease try rephrasing your question or ask about a specific part of the codebase.")
            stream.done()
            return { output: stream.value, fileReferences: [] }
        }

        // Build context string with better formatting
        const context = result.map(doc => `
**File: ${doc.fileName}**
**Similarity Score: ${(doc.similarity * 100).toFixed(1)}%**

\`\`\`
${doc.sourceCode}
\`\`\`

**Summary:** ${doc.summary}

---
`).join('\n')

        const model = google('gemini-1.5-flash')
        
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
        })

        try {
            const { textStream } = await Promise.race([
                streamText({
                    model,
                    prompt: `You are an expert AI code assistant helping a developer understand and work with their codebase. You have access to relevant code files and their summaries.

## Context
The following code files are relevant to the user's question:

${context}

## User Question
${question}

## Instructions
1. **Provide a comprehensive answer** that directly addresses the user's question
2. **Use the provided code context** to give specific, actionable information
3. **Include relevant code snippets** when they help explain your answer
4. **Structure your response clearly** with headings, bullet points, and code blocks
5. **If the context is limited**, acknowledge this and provide the best answer possible based on what's available
6. **Use markdown formatting** for better readability
7. **Be specific about file locations** and code structure when relevant
8. **If the question is about implementation**, provide step-by-step guidance
9. **If the question is about understanding code**, explain the logic and purpose clearly

## Response Format
- Start with a direct answer to the question
- Use headings (##) for different sections
- Use code blocks (\`\`\`) for code snippets
- Use bullet points for lists
- Be thorough but concise

Remember: The user is asking about their specific codebase, so focus on the actual code provided in the context.`,
                    temperature: 0.3,
                    maxTokens: 4096,
                }),
                timeoutPromise
            ]) as { textStream: AsyncIterable<string> }

            // Stream the response with proper error handling
            let hasContent = false
            for await (const delta of textStream) {
                if (delta && delta.trim()) {
                    stream.update(delta)
                    hasContent = true
                }
            }

            // If no content was streamed, provide a fallback response
            if (!hasContent) {
                stream.update("\n\nI found relevant code files but couldn't generate a response. Here are the files that might be relevant to your question:\n\n" + 
                    result.map(doc => `- **${doc.fileName}** (${(doc.similarity * 100).toFixed(1)}% relevant)\n  ${doc.summary}`).join('\n\n'))
            }

        } catch (error) {
            console.error('Error streaming response:', error)
            
            if (error instanceof Error && error.message === 'Request timeout') {
                stream.update("\n\n**Error:** The request took too long to process. Please try asking a more specific question or try again later.")
            } else {
                stream.update("\n\n**Error:** An error occurred while generating the response. Please try asking your question again.")
            }
        } finally {
            // Always ensure the stream is done
            stream.done()
        }

        return {
            output: stream.value,
            fileReferences: result
        }
    } catch (error) {
        console.error('Error in askQuestion:', error)
        
        try {
            stream.update("**Error:** An error occurred while processing your question. Please check your connection and try again.")
        } catch (streamError) {
            console.error('Error updating stream:', streamError)
        } finally {
            // Always ensure the stream is done, even if there's an error
            try {
                stream.done()
            } catch (doneError) {
                console.error('Error calling stream.done():', doneError)
            }
        }
        
        return {
            output: stream.value,
            fileReferences: []
        }
    }
}
