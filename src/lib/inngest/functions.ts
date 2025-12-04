import { inngest } from "@/inngest/client";
import { db } from "@/server/db"; // You can access your DB here!
import { indexGithubRepo } from "@/lib/github-loader"; 
import { pollCommits } from "@/lib/github"; 

// 1. The Wrapper for Indexing
export const indexGithubRepoJob = inngest.createFunction(
    { id: "index-github-repo" }, 
    { event: "project/index-repo" }, 
    async ({ event, step }) => {
        const { projectId, githubUrl, githubToken } = event.data;

        // Execute the heavy logic from your existing file
        await step.run("index-repository", async () => {
            await indexGithubRepo(projectId, githubUrl, githubToken);
        });

        return { status: "indexed", projectId };
    }
);

// 2. The Wrapper for Polling
export const pollCommitsJob = inngest.createFunction(
    { id: "poll-commits" },
    { event: "project/poll-commits" },
    async ({ event, step }) => {
        const { projectId } = event.data;

        await step.run("poll-commits", async () => {
             await pollCommits(projectId);
        });

        return { status: "polled", projectId };
    }
);