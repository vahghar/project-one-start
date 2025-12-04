import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
//import { indexGithubRepoJob, pollCommitsJob } from "../../../lib/inngest/functions";
import { indexGithubRepoJob,pollCommitsJob } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    indexGithubRepoJob, // 👈 Register your functions here
    pollCommitsJob,
  ],
});