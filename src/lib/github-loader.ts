import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"
import { generateEmbedding, summarizeCode } from "./gemini"
import { Document } from "@langchain/core/documents"
import { db } from "@/server/db"
import { Octokit } from "octokit"

const getFileCount = async (path: string)

export const checkCredits = async (githubUrl: string,githubToken?: string) =>{
    const octokit= new Octokit({auth: githubToken})
    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]
    if(!githubOwner || !githubRepo) return 0
}

export const loadGithubRepos = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })
    const docs = await loader.load()
    return docs
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepos(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async (embedding,index)=>{
        if(!embedding) return
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
    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summarizeCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}