'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { Github, Sparkles, Users, Calendar, Activity } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import { Card } from '@/components/ui/card'
import ArchiveButton from './archive-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false })
import TeamMembers from './team-members'
import dynamic from 'next/dynamic'

const DashboardPage = () => {
  const { user } = useUser()
  const { project } = useProject()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative px-6 py-8 mx-auto max-w-[2000px] space-y-8">
        {/* Top Bar */}
        <div className='flex items-center justify-between flex-wrap gap-4'>
          {/* Github link with enhanced styling */}
          <Card className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl shadow-purple-500/20 p-4 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Github className="size-6" />
              </div>
              <div>
                <p className="font-medium mb-1">
                  Project Repository
                </p>
                <Link
                  href={project?.githubUrl ?? ""}
                  className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  {project?.githubUrl}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </Link>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <TeamMembers />
            <InviteButton />
            <ArchiveButton />
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Side Cards */}
          <div className="md:col-span-2 space-y-8">
            {/* Ask Question Card */}
            <Card className="overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-colors bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/5">
              <div className="p-6 border-b border-purple-500/10 flex items-center gap-4">
                <div className="p-2 bg-purple-600/20 rounded-xl">
                  <Sparkles className="size-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Ask a Question</h2>
                  <p className="text-sm text-gray-400">Get instant help from Gutter AI</p>
                </div>
              </div>
              <div className="p-6">
                <AskQuestionCard />
              </div>
            </Card>

            {/* Meeting Card */}
            <Card className="overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-colors bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/5">
              <div className="p-6 border-b border-purple-500/10 flex items-center gap-4">
                <div className="p-2 bg-purple-600/20 rounded-xl">
                  <Calendar className="size-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Schedule Meeting</h2>
                  <p className="text-sm text-gray-400">Plan your next team sync</p>
                </div>
              </div>
              <div className="p-6">
                <MeetingCard />
              </div>
            </Card>
          </div>

          {/* Commit Log */}
          <Card className="md:col-span-3 border-purple-500/10 hover:border-purple-500/20 transition-colors bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/5">
            <div className="p-6 border-b border-purple-500/10 flex items-center gap-4">
              <div className="p-2 bg-purple-600/20 rounded-xl">
                <Activity className="size-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">Recent Activity</h2>
                <p className="text-sm text-gray-400">Latest commits and changes</p>
              </div>
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