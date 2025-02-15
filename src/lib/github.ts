import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
//import { aisummarizeCommit } from "./gemini";
import { aisummarizeCommit } from "./groq";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const githubUrl = "https://github.com/docker/genai-stack"

type Response = {
    commitHash: string,
    commitMessage: string,
    commitAuthorName: string,
    commitAuthorAvatar: string,
    commitDate: string
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split("/").slice(-2)
    if (!owner || !repo) {
        throw new Error("Invalid github url")
    }
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())

    return sortedCommits.slice(0, 15).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author.name ?? "",
        commitAuthorAvatar: commit?.author.avatar_url ?? "",
        commitDate: commit.commit?.author.date ?? "",
    }))
}

export const pollCommits = async (projectId: string) => {
    const { githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map((commit: any) => {
        return summarizeCommit(githubUrl, commit.commitHash)
    }))
    const summaries = summaryResponses.map((response: any) => {
        if (response.status === "fulfilled") {
            return response.value as string
        }
        return "No changes in this commit"
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary: string, index: number) => ({
            projectId: projectId,
            commitHash: unprocessedCommits[index]!.commitHash,
            commitMessage: unprocessedCommits[index]!.commitMessage,
            commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
            commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
            commitDate: unprocessedCommits[index]!.commitDate,
            summary
        }))
    })

    return commits
}

async function summarizeCommit(githubUrl: string, commitHash: string) {
    try {
        const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
            headers: {
                Accepts: 'application/vnd.github.v3.diff'
            },
            timeout: 10000,
            maxContentLength: 5 * 1024 * 1024,
            maxBodyLength: 5 * 1024 * 1024
        });

        const processedDiff = processLargeDiff(data);

        return await aisummarizeCommit(processedDiff) || "No changes in this commit"
    } catch (error) {
        if (axios.isAxiosError(error) && error.message.includes('maxContentLength')) {
            try {
                const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
                    headers: {
                        Accepts: 'application/vnd.github.v3.diff',
                        'Accept-Encoding': 'gzip, deflate, br'
                    },
                    timeout: 10000,
                    maxContentLength: 5 * 1024 * 1024,
                    maxBodyLength: 5 * 1024 * 1024,
                    decompress: true
                });
                
                const processedDiff = processLargeDiff(data);
                return await aisummarizeCommit(processedDiff) || "No changes in this commit"
            } catch (retryError) {
                console.error('Error even with compression:', retryError);
                return `Error: Commit diff is too large to process. Please try a smaller commit.`;
            }
        }
        
        console.error('Error fetching or summarizing commit:', error);
        return `Error summarizing commit: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}

function processLargeDiff(diff: string, maxSize: number = 1000): string {
    if (diff.length <= maxSize) {
        return diff;
    }
    const truncatedDiff = diff.slice(0, maxSize);
    return `[TRUNCATED DIFF - SHOWING FIRST ${maxSize} CHARACTERS]
${truncatedDiff}

[END OF TRUNCATED DIFF]`;
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }

    })
    if (!project?.githubUrl) {
        throw new Error("Project not found")
    }
    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany(
        {
            where: {
                projectId
            }
        }
    )
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}