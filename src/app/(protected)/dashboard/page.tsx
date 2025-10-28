'use client'

import useProject from '@/hooks/use-project'
import { Github, Sparkles, Calendar, Activity, FolderTree, Users, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import AskQuestionCard from './ask-question-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ArchiveButton from './archive-button'
import TeamMembers from './team-members'
import FileTree from './file-tree'
import { Badge } from '@/components/ui/badge'

const CommitLog = dynamic(() => import('./commit-log'), { ssr: false })
const MeetingCard = dynamic(() => import('./meeting-card'), { ssr: false })
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false })

const DashboardPage = () => {
  const { project } = useProject()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!project?.githubUrl) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/recommend-beginner-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubUrl: project.githubUrl }),
        })
        const data = await res.json()
        if (data.recommendations) setRecommendations(data.recommendations)
        else setError(data.error || 'No recommendations found')
      } catch (e: any) {
        setError(e.message || 'Failed to fetch recommendations')
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [project?.githubUrl])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome to your project overview and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TeamMembers />
            <InviteButton />
            <ArchiveButton />
          </div>
        </div>

        {/* Project Repository Card */}
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <Github className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {project?.name || 'Project Repository'}
                  </h3>
                  <Link
                    href={project?.githubUrl ?? '#'}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    {project?.githubUrl || 'github.com/your-repo'}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ask Question Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ask CommitSense</CardTitle>
                  <CardDescription>
                    Get instant help and insights from your codebase
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AskQuestionCard />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>
                    Latest commits, changes, and team updates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CommitLog />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {/* Beginner-Friendly Files Recommendation */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Beginner-Friendly Files</CardTitle>
                  <CardDescription>
                    Good places to make your first contribution
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && <div className="text-sm text-slate-500">Loading recommendations...</div>}
              {error && <div className="text-sm text-red-500">{error}</div>}
              {!loading && !error && recommendations.length === 0 && (
                <div className="text-sm text-slate-500">No recommendations found.</div>
              )}
              <ul className="space-y-3">
                {recommendations.slice(0, 10).map((rec, i) => (
                  <li key={rec.path + i} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={rec.difficulty === 'easy' ? 'default' : rec.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)}
                      </Badge>
                      <span className="font-mono text-xs break-all">{rec.path}</span>
                    </div>
                    <div className="text-xs text-slate-500">{rec.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Schedule Meeting</CardTitle>
                  <CardDescription>
                    Plan your next team sync session
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MeetingCard />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Plus className="w-4 h-4" />
                Create New Project
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Users className="w-4 h-4" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
