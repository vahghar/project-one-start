'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DashboardPage = () => {
  const { user } = useUser()
  const { project } = useProject()
  return (
    <div>
      <div className='flex items-center justify-between flex-wrap gap-y-4'>

        {/*github link*/}
        <div className='w-fit rounded-md bg-primary px-4 py-4'>
          <div className="flex items-center">
            <Github className='size-5 text-white' />
            <div className='ml-2'>
              <p className='text-sm font-mediu text-white'>This project is linked to:  {' '}<Link href={project?.githubUrl ?? ""} className='inline-flex items-center text-white/80 hover:undelined'>{project?.githubUrl}</Link></p>
            </div>
          </div>
        </div>

        <div className='h-4'></div>

        <div className='flex items-center gap-4'>
          
        </div>



      </div>

      <div className='mt-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
          askQuestion
          MeetingCard
        </div>
      </div>

      <div className="mt-8">
        commits log
      </div>

    </div>
  )
}

export default DashboardPage
