// test-loader.ts
import { Document } from "@langchain/core/documents";
import { generateEmbedding } from "./lib/embedding";
import { summarizeCode } from "./lib/groq"; // Adjust path if needed


const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(docs.map(async (doc) => {
    try {
      console.log(`1. Summarizing: ${doc.metadata.source}`);
      const summary = await summarizeCode(doc);
      
      if (!summary || summary.trim() === "") {
        console.log(`Skipping ${doc.metadata.source} - empty summary`);
        return null;
      }
      console.log(`2. Summary received: "${summary}"`);
      
      console.log(`3. Generating embedding for summary...`);
      const embedding = await generateEmbedding(summary);
      
      if (!embedding || (embedding as number[]).length === 0) {
        console.log(`Skipping ${doc.metadata.source} - null embedding`);
        return null;
      }
      console.log(`4. Embedding received.`);

      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source,
      };
    } catch (error) {
      console.error(`Error processing ${doc.metadata.source}:`, error);
      return null;
    }
  }));
};


// --- The Test Runner ---

async function runTest() {
  console.log("--- Running Standalone Test ---");

  // Create a FAKE document array, just like GithubRepoLoader would.
  const mockDocs: Document[] = [
    new Document({
      pageContent: "function helloWorld() { console.log('Hello, World!'); }",
      metadata: {
        source: "test/hello.js",
      },
    }),
  ];

  try {
    const results = await generateEmbeddings(mockDocs);
    const validResult = results.find(r => r !== null);

    if (validResult) {
      console.log("\n✅ TEST PASSED! ✅");
      console.log("--------------------");
      console.log("File:", validResult.fileName);
      console.log("Summary:", validResult.summary);
      console.log("Embedding Vector (first 5 values):", (validResult.embedding as number[]).slice(0, 5));
      console.log("--------------------");
    } else {
      console.log("\n❌ TEST FAILED. ❌");
      console.log("The function returned null. Check the errors above.");
    }
  } catch (e) {
    console.error("\n❌ TEST FAILED WITH UNCAUGHT EXCEPTION. ❌", e);
  }
}

runTest();