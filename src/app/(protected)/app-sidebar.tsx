'use client'

import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, GitCommit, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        color: 'from-blue-500 to-blue-600'
    },
    {
        title: 'Q&A',
        url: '/qa',
        icon: Bot,
        color: 'from-purple-500 to-purple-600'
    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Presentation,
        color: 'from-orange-500 to-orange-600'
    },
    {
        title: 'Billing',
        url: '/billing',
        icon: CreditCard,
        color: 'from-green-500 to-green-600'
    },
]

const AppSidebar = () => {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId, setProjectId } = useProject()

    return (
        <Sidebar
            collapsible='icon'
            variant='floating'
            className="backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80"
        >
            <SidebarHeader className="px-6 py-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className='flex items-center gap-3'>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 p-3 rounded-xl shadow-lg">
                        <GitCommit className="w-5 h-5 text-white dark:text-slate-900" />
                    </div>
                    {open && (
                        <div>
                            <h1 className='text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-transparent bg-clip-text'>
                                CommitSense
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                AI-Powered Code Insights
                            </p>
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent className="px-4 py-6">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider mb-3">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-5 rounded-xl transition-all duration-200 group relative overflow-hidden',
                                                {
                                                    'bg-gradient-to-r text-white shadow-lg': pathname === item.url,
                                                    'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100': pathname !== item.url
                                                }
                                            )}
                                            style={pathname === item.url ? {
                                                background: `linear-gradient(135deg, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`
                                            } : {}}
                                        >
                                            <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                                                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                                            </div>
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wider mb-3">
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton asChild>
                                        <div
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-5 rounded-xl cursor-pointer transition-all duration-200 group',
                                                {
                                                    'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 shadow-lg': project.id === projectId,
                                                    'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50': project.id !== projectId
                                                }
                                            )}
                                            onClick={() => setProjectId(project.id)}
                                        >
                                            <div className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm 
  bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm">
                                                {project.name[0]?.toUpperCase()}
                                            </div>

                                            <span className="font-medium">{project.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {open && (
                                <SidebarMenuItem className="mt-4 px-2">
                                    <Link href='/create' className="w-full">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start gap-3 h-12 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                                        >
                                            <div className="p-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                                <Plus className="w-4 h-4 text-white" />
                                            </div>
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* AI Assistant Promo 
                {open && (
                    <div className="mt-8 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                    AI Assistant
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Powered by GPT-4
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                            Get instant help with your codebase and team collaboration.
                        </p>
                        <Button size="sm" className="w-full text-xs h-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                            Try Now
                        </Button>
                    </div>
                )}*/}
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar