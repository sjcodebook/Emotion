'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { createDocumentAction } from '../actions'

const Dashboard = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const handleDocumentCreation = async () => {
    try {
      toast.loading('Creating document...')
      const [data, err] = await createDocumentAction({
        title: 'Untitled Document',
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to create document. Please try again.')
        return
      }

      toast.success('Document created successfully!')
      queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(),
      })
    } catch (error) {
      toast.dismiss()
      console.error('Error creating document:', error)
      toast.error('Failed to create document. Please try again.')
    }
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
