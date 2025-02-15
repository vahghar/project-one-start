'use client'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Loader2, FileAudio, ChevronRight, Trash, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MeetingsPage = () => {
    const { projectId } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 4000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation()

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative px-6 py-8 mx-auto max-w-[2000px] space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                        Your Meetings
                    </h1>
                    <Badge variant="secondary" className="text-sm bg-purple-600 text-white">
                        {meetings?.length || 0} Total
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                ) : meetings?.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-900/50 border-purple-500/10 shadow-lg hover:shadow-purple-500/10">
                        <div className="flex flex-col items-center gap-2">
                            <FileAudio className="h-8 w-8 text-gray-400" />
                            <h3 className="font-semibold text-gray-100">No meetings yet</h3>
                            <p className="text-sm text-gray-400">Upload your first meeting to get started</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {meetings?.map(meeting => (
                            <Card key={meeting.id} className="p-4 hover:shadow-xl transition-all duration-300 bg-gray-900/50 border-purple-500/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <h3 className="font-medium text-gray-100 hover:text-purple-400 transition-colors">
                                                {meeting.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
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
                                        <Button size="sm" variant="destructive" onClick={() => deleteMeeting.mutate({ meetingId: meeting.id })}>
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                        <Link href={`/meetings/${meeting.id}`}>
                                            <ChevronRight className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MeetingsPage