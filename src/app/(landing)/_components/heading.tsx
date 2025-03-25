'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const Heading = () => {
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Idead, Documents, and Projects, All in One Place. Welcome to{' '}
        <span className='underline'>Notion</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Notion is the all-in-one workspace for you and your team. <br /> It&apos;s the connected
        workspace for your ideas, docs, and projects.
      </h3>
      <Button>
        Enter Notion
        <ArrowRight className='h-4 w-4 ml-2' />
      </Button>
    </div>
  )
}

export default Heading
