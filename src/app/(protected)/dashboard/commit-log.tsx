'use client'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CommitLog = () => {
    const { projectId, project } = useProject()
    const { data: commits } = api.project.getCommits.useQuery({ projectId })
    return (
        <>
            <ul className='space-y-6'>
                {commits?.map((commit, commitIdx) => {
                    return (
                        <li key={commit.id} className='relative flex gap-x-4'>
                            <div className={cn(commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center')}>
                                <div className='w-px translate-x-1 bg-gray-200'></div>
                            </div>

                            <>
                                <img src={commit.commitAuthorAvatar} alt='avatar' className='relative size-8 mt-4 flex-none rounded-full bg-gray-500'
                                />
                                <div className='flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200'>
                                    <div className='flex justify-between gap-x-4'>
                                        <Link
                                            target='_blank'
                                            href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                                            className='py-0.5 text-xs leading-5 text-gray-500 inline-flex items-center gap-1'
                                        >
                                            <span className='font-medium text-gray-900'>
                                                {commit.commitMessage}
                                            </span>
                                            <span>committed</span>
                                            <ExternalLink className='size-3' />
                                        </Link>
                                    </div>
                                    <span className='font-semibold'>
                                        {commit.commitMessage}
                                    </span>
                                    <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                                        {commit.summary}
                                    </pre>
                                </div>

                            </>

                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default CommitLog
