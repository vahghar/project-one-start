'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import AppSidebar from './app-sidebar'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  const { user } = useUser()

  const [showNotice, setShowNotice] = useState(false)

  const handleBellClick = () => {
    setShowNotice(true)
    setTimeout(() => setShowNotice(false), 3000)
  }


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 text-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />

          <div className="relative flex">
            <AppSidebar />

            <main className="flex-1 w-full">
              {/* Modern Top Bar */}
              <div className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="px-6 py-4 flex items-center justify-between">
                  {/* Left side - Search and Welcome */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="relative max-w-md w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search projects, commits, or questions..."
                        className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Right side - Notifications and User */}
                  <div className="flex items-center gap-4">
                    {/* User Welcome */}
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user?.firstName || user?.username || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Welcome back! 👋
                        </p>
                      </div>
                    </div>

                    {/* User Button */}
                    <div className="flex items-center">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            // Minimalist changes:
                            // 1. rounded-full: Cleaner, standard user avatar shape.
                            // 2. border: reduced to 1px (was border-2).
                            // 3. border-purple-500/30: Matches your "Invite" button outline.
                            // 4. shadow-none: Removes visual noise.
                            avatarBox: "w-10 h-10 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-none"
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 min-h-[calc(100vh-5rem)]">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default SidebarLayout