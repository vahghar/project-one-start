'use client'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, FileAudio, ChevronRight, Trash, Calendar, Clock, Users, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MeetingsPage = () => {
    const { projectId } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 4000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation()

    return (
        <div className="min-h-screen rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative px-6 py-8 mx-auto max-w-[2000px] space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                            Meeting Analysis
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Upload and analyze your team meetings with AI-powered insights
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-sm bg-purple-600/20 text-purple-300 border-purple-500/30">
                            {meetings?.length || 0} Meetings
                        </Badge>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <MeetingCard />
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-900/50 border-purple-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Play className="h-4 w-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Meetings</p>
                                    <p className="text-xl font-semibold text-white">{meetings?.length || 0}</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="bg-gray-900/50 border-purple-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Users className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Completed</p>
                                    <p className="text-xl font-semibold text-white">
                                        {meetings?.filter(m => m.status === 'COMPLETED').length || 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="bg-gray-900/50 border-purple-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Clock className="h-4 w-4 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Processing</p>
                                    <p className="text-xl font-semibold text-white">
                                        {meetings?.filter(m => m.status === 'PROCESSING').length || 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Meetings List */}
                {isLoading ? (
                    <Card className="p-12 text-center bg-gray-900/50 border-purple-500/10">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                            <p className="text-gray-400">Loading your meetings...</p>
                        </div>
                    </Card>
                ) : meetings?.length === 0 ? (
                    <Card className="p-12 text-center bg-gray-900/50 border-purple-500/10 shadow-lg">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-purple-500/20 rounded-full">
                                <FileAudio className="h-8 w-8 text-purple-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">No meetings yet</h3>
                                <p className="text-gray-400 max-w-md">
                                    Upload your first meeting recording to get AI-powered insights and action items
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Recent Meetings</h2>
                            <p className="text-sm text-gray-400">Click on a meeting to view details</p>
                        </div>
                        
                        <div className="grid gap-4">
                            {meetings?.map(meeting => (
                                <Card key={meeting.id} className="group hover:shadow-xl transition-all duration-300 bg-gray-900/50 border-purple-500/10 hover:border-purple-500/30 hover:bg-gray-900/70">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                                    <Calendar className="h-5 w-5 text-purple-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                                        {meeting.name}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span>{new Date(meeting.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{new Date(meeting.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                {meeting.status === "PROCESSING" ? (
                                                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                        Processing
                                                    </Badge>
                                                ) : meeting.status === "COMPLETED" ? (
                                                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                                                        Ready
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                                                        Pending
                                                    </Badge>
                                                )}
                                                
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                                    onClick={() => deleteMeeting.mutate({ meetingId: meeting.id })}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                                
                                                <Link href={`/meetings/${meeting.id}`}>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MeetingsPage