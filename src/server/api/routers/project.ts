import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken : z.string().optional()
        })
    ).mutation(async({ctx,input})=>{
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId || ""
            }, select: {
                credits: true
            }
        })
        if(!user){
            throw new Error("user not found")
        }
        const currentCredits = user.credits || 0;
        const fileCount = await checkCredits(input.githubUrl,input.githubToken)
        if(currentCredits < fileCount){
            throw new Error("not enough credits")
        }
        const project = await ctx.db.project.create({
            data:{
                githubUrl: input.githubUrl,
                name: input.name,
                userToProjects:{
                    create:{
                        userId: ctx.user.userId || "",
                    }
                }
            }
        })
        await indexGithubRepo(project.id,input.githubUrl,input.githubToken)
        await pollCommits(project.id)
        await ctx.db.user.update({
            where: {
                id: ctx.user.userId || ""
            },
            data: {
                credits: {
                    decrement: fileCount
                }
            }
        })
        return project
    }),

    getProjects: protectedProcedure.query(async ({ctx}) => {
        return await ctx.db.project.findMany({
            where: {
                userToProjects:{
                    some:{
                        userId: ctx.user.userId || ""
                    }
                },
                deletedAt: null
            }
        })
    }),

    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ctx,input})=>{
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({
            where:{projectId: input.projectId}
        })
    }),

    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        fileReferences: z.any()
    })).mutation(async ({ctx,input})=>{
        return await ctx.db.question.create({
            data: {
                answer: input.answer,
                fileReferences: input.fileReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ctx,input})=>{
        return await ctx.db.question.findMany({
            where:{projectId: input.projectId},
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }),
    uploadMeeting: protectedProcedure.input(z.object({projectId: z.string(), meetingUrl: z.string(), name: z.string()})).mutation(async ({ctx,input})=>{
        const meeting = await ctx.db.meeting.create({
            data:{
                meetingUrl: input.meetingUrl,
                name: input.name,
                projectId: input.projectId,
                status: "PROCESSING"
            }
        })
        return meeting;
    }),
    getMeetings: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ctx,input})=>{
        return await ctx.db.meeting.findMany({
            where:{projectId: input.projectId}
        })
    }),
    deleteMeeting: protectedProcedure.input(z.object({meetingId: z.string()})).mutation(async ({ctx,input})=>{
        return await ctx.db.meeting.delete({
            where:{id: input.meetingId}
        })
    }),
    getMeetingById: protectedProcedure.input(z.object({meetingId: z.string()})).query(async ({ctx,input})=>{
        return await ctx.db.meeting.findUnique({
            where:{id: input.meetingId},
            include: {
                issues: true
            }
        })
    }),
    archiveProject: protectedProcedure.input(z.object({projectId: z.string()})).mutation(async ({ctx,input})=>{
        return await ctx.db.project.update({
            where:{id: input.projectId},
            data:{
                deletedAt: new Date()
            }
        })
    }),
    getTeamMembers: protectedProcedure.input(z.object({projectId: z.string()})).query(async ({ctx,input})=>{
        return await ctx.db.userToProject.findMany({ where:{projectId: input.projectId},include:{user:true}})
    }),
    getMyCredits: protectedProcedure.query(async ({ctx}) => {
        return await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId || ""
            },
            select: {
                credits: true
            }
        })
    }),
    checkCredits: protectedProcedure.input(z.object({
        githubUrl: z.string(),githubToken: z.string().optional()
    })).mutation(async ({ctx,input})=>{
        const fileCount =  await checkCredits(input.githubUrl,input.githubToken)
        const userCredits = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId || ""
            },
            select: {
                credits: true
            }
        })
        return {
            fileCount, userCredits: userCredits?.credits || 0
        }
    }),
    getFileStructure: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ctx, input}) => {
        const files = await ctx.db.sourceCodeEmbedding.findMany({
            where: {
                projectId: input.projectId
            },
            select: {
                fileName: true
            }
        })

        // Build tree structure from file paths
        const tree: Record<string, any> = {}
        
        files.forEach(file => {
            const pathParts = file.fileName.split('/')
            let currentLevel = tree
            
            pathParts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = {
                        name: part,
                        type: index === pathParts.length - 1 ? 'file' : 'folder',
                        children: index === pathParts.length - 1 ? null : {}
                    }
                }
                if (index < pathParts.length - 1) {
                    currentLevel = currentLevel[part].children
                }
            })
        })

        // Convert to array format for easier rendering
        const convertToArray = (obj: Record<string, any>): any[] => {
            return Object.values(obj).map(item => ({
                ...item,
                children: item.children ? convertToArray(item.children) : null
            }))
        }

        return convertToArray(tree)
    })
})