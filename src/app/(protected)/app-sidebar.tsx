'use client'

import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import Image from 'next/image'
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
        <Sidebar collapsible='icon' variant='floating' className="border-r border-border/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarHeader className="px-6 py-4">
                <div className='flex items-center gap-3'>
                    <Image src='/github.png' alt='logo' width={32} height={32} className="rounded-lg" />
                    {open && (
                        <h1 className='text-xl font-semibold tracking-tight text-primary'>
                            gutter
                        </h1>
                    )}  
                </div>
            </SidebarHeader>
            <SidebarContent className="px-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
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
                                                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-accent hover:text-accent-foreground', 
                                                { 
                                                    'bg-primary text-primary-foreground hover:bg-primary/90': pathname === item.url,
                                                    'text-muted-foreground': pathname !== item.url
                                                }, 
                                                'list-none'
                                            )}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton asChild>
                                        <div 
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-accent hover:text-accent-foreground',
                                                {
                                                    'text-muted-foreground': project.id !== projectId
                                                }
                                            )}
                                            onClick={() => setProjectId(project.id)}
                                        >
                                            <div className={cn(
                                                'flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-medium transition-colors duration-200',
                                                {
                                                    'bg-primary text-primary-foreground border-primary': project.id === projectId,
                                                    'bg-muted text-muted-foreground border-border/50': project.id !== projectId
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
                                <SidebarMenuItem className="mt-2 px-2">
                                    <Link href='/create'>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
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