'use client'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Loader2, FileAudio, ChevronRight, Trash } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'

const MeetingsPage = () => {
    const { projectId } = useProject()
    const { data: meetings, isLoading, refetch } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 4000
    })

    const deleteMeeting = api.project.deleteMeeting.useMutation()

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="space-y-8">
                <MeetingCard />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Your Meetings</h1>
                        <Badge variant="secondary" className="text-sm">
                            {meetings?.length || 0} Total
                        </Badge>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                    ) : meetings?.length === 0 ? (
                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <FileAudio className="h-8 w-8 text-gray-400" />
                                <h3 className="font-semibold text-gray-900">No meetings yet</h3>
                                <p className="text-sm text-gray-500">
                                    Upload your first meeting to get started
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {meetings?.map(meeting => (
                                <Card key={meeting.id} className="p-4 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileAudio className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {meeting.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {meeting.status === "PROCESSING" ? (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                    Processing
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    Ready
                                                </Badge>
                                            )}

                                            {/* Delete Button */}
                                            <Button size={"sm"}
                                                variant={"destructive"}
                                                onClick={()=>{
                                                    deleteMeeting.mutate({meetingId: meeting.id})
                                                }}
                                            >
                                                <Trash className="h-5 w-5" />
                                            </Button>

                                            <Link href={`/meetings/${meeting.id}`}>
                                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MeetingsPage
