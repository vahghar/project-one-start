'use client'

import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, GitCommit } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'Q&A',
        url: '/qa',
        icon: Bot
    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Presentation
    },
    {
        title: 'Billing',
        url: '/billing',
        icon: CreditCard
    },
]

const AppSidebar = () => {
    const pathname = usePathname()
    const {open} = useSidebar()
    const {projects, projectId, setProjectId} = useProject()
    
    return (
        <Sidebar 
            collapsible='icon' 
            variant='floating'
            className="backdrop-blur-sm"
        >
            <SidebarHeader className="px-6 py-4 ">
                <div className='flex items-center gap-3'>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
                        <GitCommit className="w-5 h-5 text-white" />
                    </div>
                    {open && (
                        <h1 className='text-xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text'>
                            CommitSense
                        </h1>
                    )}  
                </div>
            </SidebarHeader>
            <SidebarContent className="px-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-purple-300/70 px-2 uppercase tracking-wider">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link 
                                            href={item.url} 
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group', 
                                                { 
                                                    'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20': pathname === item.url,
                                                    'text-gray-400 hover:text-white hover:bg-purple-500/10': pathname !== item.url
                                                }
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-4 h-4 transition-transform group-hover:scale-110",
                                                {
                                                    "text-white": pathname === item.url,
                                                    "text-purple-400 group-hover:text-purple-300": pathname !== item.url
                                                }
                                            )} />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                    <SidebarGroupLabel className="text-xs font-medium text-purple-300/70 px-2 uppercase tracking-wider">
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton asChild>
                                        <div 
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group',
                                                {
                                                    'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20': project.id === projectId,
                                                    'text-gray-400 hover:text-white hover:bg-purple-500/10': project.id !== projectId
                                                }
                                            )}
                                            onClick={() => setProjectId(project.id)}
                                        >
                                            <div className={cn(
                                                'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group-hover:scale-105',
                                                {
                                                    'bg-white/10 backdrop-blur-sm text-white': project.id === projectId,
                                                    'bg-purple-500/10 text-purple-400': project.id !== projectId
                                                }
                                            )}>
                                                {project.name[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-medium">{project.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {open && (
                                <SidebarMenuItem className="mt-3 px-2">
                                    <Link href='/create' className="w-full">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start gap-2 text-purple-400 border-purple-500/20 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar