'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogDescription, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { api, RouterOutputs } from '@/trpc/react'
import { VideoIcon } from 'lucide-react'
import React from 'react'

type Props = {
    meetingId: string
}

const IssuesList = ({ meetingId }: Props) => {
    const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
        refetchInterval: 4000
    })
    if (isLoading || !meeting) return <div className="flex justify-center items-center h-40">Loading...</div>
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className='flex items-center justify-between gap-x-6 border-b pb-6'>
                <div className='flex items-center gap-x-4'>
                    <div className='rounded-full border bg-white p-3 shadow'>
                        <VideoIcon className='h-6 w-6 text-blue-500' />
                    </div>
                    <h1>
                        <div className='text-sm text-gray-600'>
                            Meeting on {meeting.createdAt.toLocaleDateString()}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-gray-900">
                            {meeting.name}
                        </div>
                    </h1>
                </div>
            </div>
            <div className="h-6"></div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {meeting.issues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>
        </div>
    )
}

function IssueCard({ issue }: { issue: NonNullable<RouterOutputs['project']['getMeetingById']>['issues'][number] }) {
    const [open, setOpen] = React.useState(false)
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {issue.gist}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            {issue.createdAt.toLocaleDateString()} 
                        </DialogDescription>
                        <p className='text-gray-600'>
                            {issue.headline}
                        </p>
                        <blockquote className='mt-2 border-1-4 border-gray-300 bg-gray-50 p-4'>
                            <span className='text-sm text-gray-600'>
                                {issue.start} - {issue.end}
                            </span>
                            <p className="font-medium italic leading-relaxed text-gray-900">
                                {issue.summary}
                            </p>
                        </blockquote>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Card className='p-4 shadow-sm hover:shadow-md transition-all rounded-lg'>
                <CardTitle className='text-lg font-medium text-gray-900'>
                    {issue.gist}
                </CardTitle>
                <CardDescription className='text-sm text-gray-600 mt-2'>
                    {issue.headline}
                </CardDescription>
                <CardContent className='mt-4 flex justify-end'>
                    <Button variant="outline" onClick={() => setOpen(true)} className="text-sm">
                        View Details
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

export default IssuesList