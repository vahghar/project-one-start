import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { generateEmbedding } from "./embedding"
import { summarizeCode } from "./groq"
import { Document } from "@langchain/core/documents"
import { db } from "@/server/db"
import { Octokit } from "octokit"

const getFileCount = async (path: string, octokit: Octokit, githubOwner:string, githubRepo: string, acc: number = 0) => {
    const {data} = await octokit.rest.repos.getContent({
        owner: githubOwner,
        repo: githubRepo,
        path
    })
    if(!Array.isArray(data) && data.type === 'file'){
        return acc
    }
    if(Array.isArray(data)){
        return acc + 1
    }
    if(Array.isArray(data)){
        let fileCount = 0;
        const directoris: string [] = [];
        for(const item of data){
            if(item.type==='dir'){
                directoris.push(item.path)
            }else{
                fileCount++;
            }
        }
        if(directoris.length > 0){
            const directoryCounts = await Promise.all(directoris.map(dir=>
                 getFileCount(dir, octokit, githubOwner, githubRepo, 0)
            ))
            fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
        }
        return acc+fileCount;
    }
    return acc
}

export const checkCredits = async (githubUrl: string,githubToken?: string) =>{
    const octokit = new Octokit({auth: githubToken})
    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]
    if(!githubOwner || !githubRepo) return 0
    const fileCount = await getFileCount('', octokit, githubOwner, githubRepo,0)
    return fileCount
}

export const loadGithubRepos = async (githubUrl: string, githubToken?: string) => {
    const octokit = new Octokit({ auth: githubToken })

    // Extract owner and repo from URL
    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]

    if (!githubOwner || !githubRepo) {
        throw new Error("Invalid GitHub URL")
    }

    // Get repository info to find default branch
    const { data: repoData } = await octokit.rest.repos.get({
        owner: githubOwner,
        repo: githubRepo
    })

    const defaultBranch = repoData.default_branch || "main"

    const loader = new GithubRepoLoader(githubUrl, {
        branch: defaultBranch,  // ← Use actual default branch
        accessToken: githubToken,
        recursive: true,
        unknown: "warn",
        ignoreFiles: [
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            ".gitignore",
            ".env",
            ".env.local",
            ".env.production",
            ".env.development",
            "node_modules/**",
            "dist/**",
            "build/**",
            ".next/**",
            "coverage/**",
            "*.log",
            "*.lock",
            "*.min.js",
            "*.min.css"
        ]
    })
    return await loader.load()
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    console.log(`🚀 Starting indexGithubRepo for project ${projectId}`);

    try {
        const docs = await loadGithubRepos(githubUrl, githubToken);
        console.log(`📁 Loaded ${docs.length} files from repository`);

        const allEmbeddings = await generateEmbeddings(docs);
        console.log(`🔄 Generated ${allEmbeddings.length} total embeddings`);

        const validEmbeddings = allEmbeddings.filter(embedding =>
            embedding &&
            embedding.summary &&
            embedding.summary.trim() !== "" &&
            embedding.embedding &&
            embedding.embedding.length > 0
        );

        console.log(`✅ ${validEmbeddings.length} valid embeddings out of ${allEmbeddings.length} total files`);

        if (validEmbeddings.length === 0) {
            throw new Error('CRITICAL: No valid embeddings could be generated - check Groq API connectivity');
        }

        console.log(`💾 Saving ${validEmbeddings.length} embeddings to database...`);
        await Promise.allSettled(validEmbeddings.map(async (embedding, index) => {
            if (!embedding) return;

            try {
                const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                    data: {
                        summary: embedding.summary,
                        sourceCode: embedding.sourceCode,
                        fileName: embedding.fileName,
                        projectId
                    }
                });

                await db.$executeRaw`
                UPDATE "sourceCodeEmbedding"
                SET "summaryEmbedding" = ${embedding.embedding}::vector
                WHERE "id" = ${sourceCodeEmbedding.id}
                `;

                console.log(`✅ Successfully indexed: ${embedding.fileName}`);
            } catch (error) {
                console.error(`❌ Failed to index ${embedding.fileName}:`, error);
            }
        }));

        console.log(`✅ indexGithubRepo completed successfully`);
    } catch (error) {
        console.error(`❌ indexGithubRepo failed for project ${projectId}:`, error);
        throw error; // ← CRITICAL: Re-throw the error!
    }
}

const generateEmbeddings = async (docs: Document[]) => {
    console.log(`🔄 Starting embedding generation for ${docs.length} files`);

    return await Promise.all(docs.map(async doc => {
        const startTime = Date.now();
        try {
            console.log(`📝 Processing ${doc.metadata.source}`);

            const summary = await summarizeCode(doc);

            if (!summary || summary.trim() === "") {
                console.log(`⚠️ Skipping ${doc.metadata.source} - empty summary`);
                return null;
            }

            const embedding = await generateEmbedding(summary);

            if (!embedding || embedding.length === 0) {
                console.log(`⚠️ Skipping ${doc.metadata.source} - null embedding`);
                return null;
            }

            const endTime = Date.now();
            console.log(`✅ Processed ${doc.metadata.source} in ${endTime - startTime}ms`);

            return {
                summary,
                embedding,
                sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                fileName: doc.metadata.source
            };
        } catch (error) {
            const endTime = Date.now();
            console.error(`❌ Failed to process ${doc.metadata.source} after ${endTime - startTime}ms:`, error);
            return null;
        }
    }));
};