'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import { Card } from '@/components/ui/card'
import ArchiveButton from './archive-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
const InviteButton = dynamic(()=> import('./invite-button'),{ssr:false})
import TeamMembers from './team-members'
import dynamic from 'next/dynamic'

const DashboardPage = () => {
  const { user } = useUser()
  const { project } = useProject()
  
  return (
    <div className="min-h-screen bg-background/50 p-6 space-y-6">
      <div className="max-w-[2000px] mx-auto">
        <div className='flex items-center justify-between flex-wrap gap-4 mb-8'>
          {/* Github link */}
          <Card className="flex-1 bg-[#7C3AED] text-white shadow-lg shadow-purple-500/10 p-4 hover:bg-[#6D28D9] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Github className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Project Repository
                  <Link 
                    href={project?.githubUrl ?? ""} 
                    className="block text-white/80 hover:text-white transition-colors text-xs mt-0.5"
                  >
                    {project?.githubUrl}
                  </Link>
                </p>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <TeamMembers/>
            <InviteButton/>
            <Card className="p-1 bg-background/50 backdrop-blur-sm border-border/50">
              <ArchiveButton/>
            </Card>
            <Card className="p-1 bg-background/50 backdrop-blur-sm border-border/50">
              <ThemeToggle />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Side Cards */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold">Ask a Question</h2>
                <p className="text-sm text-muted-foreground">Get instant help from Gutter AI</p>
              </div>
              <div className="p-6">
                <AskQuestionCard />
              </div>
            </Card>
            
            <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold">Schedule Meeting</h2>
                <p className="text-sm text-muted-foreground">Plan your next team sync</p>
              </div>
              <div className="p-6">
                <MeetingCard />
              </div>
            </Card>
          </div>

          {/* Commit Log */}
          <Card className="md:col-span-3 border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Latest commits and changes</p>
            </div>
            <div className="p-6">
              <CommitLog />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage