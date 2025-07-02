import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { generateEmbedding, summarizeCode } from "./gemini"
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
    const loader = new GithubRepoLoader(githubUrl, {
        branch: "main",
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
    const docs = await loadGithubRepos(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    
    // Filter out embeddings with empty summaries or null embeddings
    const validEmbeddings = allEmbeddings.filter(embedding => 
        embedding && 
        embedding.summary && 
        embedding.summary.trim() !== "" && 
        embedding.embedding && 
        embedding.embedding.length > 0
    )
    
    console.log(`Generated ${validEmbeddings.length} valid embeddings out of ${allEmbeddings.length} total files`)
    
    await Promise.allSettled(validEmbeddings.map(async (embedding, index) => {
        if (!embedding) return
        
        try {
            const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                data: {
                    summary: embedding.summary,
                    sourceCode: embedding.sourceCode,
                    fileName: embedding.fileName,
                    projectId
                }
            })
            
            await db.$executeRaw`
            UPDATE "sourceCodeEmbedding"
            SET "summaryEmbedding" = ${embedding.embedding}::vector
            WHERE "id" = ${sourceCodeEmbedding.id}
            `
            
            console.log(`Successfully indexed: ${embedding.fileName}`)
        } catch (error) {
            console.error(`Failed to index ${embedding.fileName}:`, error)
        }
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        try {
            const summary = await summarizeCode(doc)
            
            // Skip files with empty summaries
            if (!summary || summary.trim() === "") {
                console.log(`Skipping ${doc.metadata.source} - empty summary`)
                return null
            }
            
            const embedding = await generateEmbedding(summary)
            
            // Skip files with null embeddings
            if (!embedding || embedding.length === 0) {
                console.log(`Skipping ${doc.metadata.source} - null embedding`)
                return null
            }
            
            return {
                summary,
                embedding,
                sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                fileName: doc.metadata.source
            }
        } catch (error) {
            console.error(`Error processing ${doc.metadata.source}:`, error)
            return null
        }
    }))
}