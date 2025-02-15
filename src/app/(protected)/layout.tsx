import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AppSidebar from './app-sidebar'
import { ThemeProvider } from '@/components/ui/theme-provider'

type Props = {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <ThemeProvider attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange>
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full m-2'>
          <div className='flex otems-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2'>
            {/*searchbar*/}
            <div className='ml-auto'>
            </div>
            <UserButton />
          </div>
          <div className='h-4'>

          </div>
          <div className='border-sidebar-border bg-sidebar border shadow rounded-mg overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default SidebarLayout
