'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogDescription, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { api, RouterOutputs } from '@/trpc/react'
import { VideoIcon, Clock, Calendar, ArrowLeft, AlertTriangle, CheckCircle, MessageSquare, Play } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

type Props = {
    meetingId: string
}

const IssuesList = ({ meetingId }: Props) => {
    const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
        refetchInterval: 4000
    })
    
    if (isLoading || !meeting) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400">Loading meeting details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/meetings">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Meetings
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <VideoIcon className='h-6 w-6 text-purple-400' />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {meeting.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {meeting.createdAt.toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {meeting.createdAt.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                    {meeting.issues.length} Issues Found
                </Badge>
            </div>

            {/* Meeting Status */}
            <Card className="bg-gray-900/50 border-purple-500/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Analysis Complete</h3>
                            <p className="text-sm text-gray-400">AI has identified key issues and action items</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Processing Time</p>
                        <p className="text-lg font-semibold text-white">~2 minutes</p>
                    </div>
                </div>
            </Card>

            {/* Issues Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Key Issues & Action Items</h2>
                    <p className="text-sm text-gray-400">Click on any issue to view detailed analysis</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {meeting.issues.map((issue, index) => (
                        <IssueCard key={issue.id} issue={issue} index={index + 1} />
                    ))}
                </div>
                
                {meeting.issues.length === 0 && (
                    <Card className="p-12 text-center bg-gray-900/50 border-purple-500/10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-green-500/20 rounded-full">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">No Issues Found</h3>
                                <p className="text-gray-400 max-w-md">
                                    Great! This meeting appears to have gone smoothly with no major issues identified.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

function IssueCard({ issue, index }: { 
    issue: NonNullable<RouterOutputs['project']['getMeetingById']>['issues'][number],
    index: number 
}) {
    const [open, setOpen] = React.useState(false)
    
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl bg-gray-900 border-purple-500/20">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold text-white">
                                    Issue #{index}: {issue.gist}
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {issue.createdAt.toLocaleDateString()} • {issue.start} - {issue.end}
                                </DialogDescription>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-white mb-2">Summary</h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {issue.headline}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-white mb-2">Detailed Analysis</h4>
                                <div className="bg-gray-800/50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                    <p className="text-gray-300 leading-relaxed italic">
                                        {issue.summary}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Play className="h-4 w-4" />
                                    Timestamp: {issue.start} - {issue.end}
                                </div>
                                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                                    Action Required
                                </Badge>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
            <Card className='group hover:shadow-xl transition-all duration-300 bg-gray-900/50 border-purple-500/10 hover:border-purple-500/30 hover:bg-gray-900/70 cursor-pointer' onClick={() => setOpen(true)}>
                <CardContent className='p-6'>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                            <AlertTriangle className='h-5 w-5 text-red-400' />
                        </div>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                            #{index}
                        </Badge>
                    </div>
                    
                    <CardTitle className='text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors'>
                        {issue.gist}
                    </CardTitle>
                    
                    <CardDescription className='text-gray-400 mb-4 line-clamp-2'>
                        {issue.headline}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {issue.start} - {issue.end}
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default IssuesList