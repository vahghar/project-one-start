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
const InviteButton = dynamic(()=> import('./invite-button'),{ssr:false})
import TeamMembers from './team-members'
import dynamic from 'next/dynamic'

const DashboardPage = () => {
  const { user } = useUser()
  const { project } = useProject()
  
  return (
    <div className="p-6 space-y-6">
      <div className='flex items-center justify-between flex-wrap gap-4'>
        {/* Github link */}
        <Card className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center gap-3">
            <Github className="size-5" />
            <div>
              <p className="text-sm">
                This project is linked to:{' '}
                <Link 
                  href={project?.githubUrl ?? ""} 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {project?.githubUrl}
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          <TeamMembers/>
          <InviteButton/>
          <ArchiveButton/>
        </div>



      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Side Cards */}
        <div className="md:col-span-2 space-y-6">
          <AskQuestionCard />
          <MeetingCard />
        </div>

        {/* Commit Log */}
        <Card className="md:col-span-3 p-6">
          <CommitLog />
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage