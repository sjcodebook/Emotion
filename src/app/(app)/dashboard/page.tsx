'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { createDocumentAction } from '../actions'

const Dashboard = () => {
  const { data: session } = useSession()

  const handleDocumentCreation = async () => {
    toast.loading('Creating document...')
    const [data, err] = await createDocumentAction({
      title: 'testtttt',
    })
    toast.dismiss()

    if (err || data?.error) {
      toast.error('Failed to create document. Please try again.')
      return
    }

    toast.success('Document created successfully!')
  }

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src='/assets/image/empty.webp' height='300' width='300' alt='Empty' />
      <h2 className='text-lg font-medium'>Welcome to {session?.user?.name}&apos;s dashboard</h2>
      <Button onClick={handleDocumentCreation}>
        <PlusCircle className='h-4 w-4 mr-1' />
        Create a new document
      </Button>
    </div>
  )
}

export default Dashboard
