import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AppSidebar from './app-sidebar'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="relative flex">
            <AppSidebar />
            
            <main className="flex-1 p-4 w-full">
              {/* Top Bar */}
              <div className="mb-4">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/10 rounded-xl shadow-lg p-3 flex items-center gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
                      <Search className="h-4 w-4" />
                    </div>
                    <Input 
                      type="search" 
                      placeholder="Search..." 
                      className="w-full bg-gray-800/50 border-purple-500/10 focus:border-purple-500/30 pl-10 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  {/* User Button */}
                  <div className="flex items-center">
                    <div className="pt-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/10 rounded-xl shadow-lg p-6 min-h-[calc(100vh-7rem)] overflow-y-auto w-full">
                <div className="relative">
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