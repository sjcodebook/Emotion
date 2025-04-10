'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PlusCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'

import { documentSchema } from '@/zod-schemas/documents'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/loading-spinner'

import { QueryKeyFactory, useServerActionQuery } from '@/hooks/use-server-action-hooks'

import { createDocumentAction, getCurrentUserAllDocumentsAction } from '../actions'

const RenderCard = ({ doc }: { doc: z.infer<typeof documentSchema> }) => {
  const router = useRouter()

  const handleCardClick = (documentId: string) => {
    router.push(`/dashboard/${documentId}`)
  }

  return (
    <Card
      key={doc.id}
      className='cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 p-0 w-45 h-50 overflow-hidden flex-shrink-0'
      onClick={() => handleCardClick(doc.id as string)}>
      <CardHeader className='p-0 w-full h-43 relative'>
        {doc.coverImage ? (
          <Image src={doc.coverImage} alt={doc.title ?? ''} className='object-cover' fill />
        ) : (
          <div className='w-full h-full bg-gray-600 dark:bg-muted flex items-center justify-center'>
            <Image
              src='/assets/image/empty.webp'
              height='80'
              width='80'
              alt='No cover'
              className='opacity-50'
            />
          </div>
        )}
        <div className='absolute bottom-[-18px] left-3'>
          <div className='text-3xl'>{doc?.icon ?? '📄'}</div>
        </div>
      </CardHeader>
      <CardContent className='text-left pl-4 flex flex-col justify-between h-full'>
        <h3 className='font-semibold truncate line-clamp-2 text-wrap'>{doc.title}</h3>
        <p className='mt-2 mb-4 text-xs text-muted-foreground self-start'>
          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'No date available'}
        </p>
      </CardContent>
    </Card>
  )
}

const Dashboard = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { isLoading, data: document } = useServerActionQuery(getCurrentUserAllDocumentsAction, {
    input: undefined,
    queryKey: QueryKeyFactory.getCurrentUserAllDocumentsAction(),
  })

  const allUnArchivedDocuments = useMemo(
    () => document?.data?.filter((doc) => !doc.isArchived),
    [document?.data]
  )

  const allArchivedDocuments = useMemo(
    () => document?.data?.filter((doc) => doc.isArchived),
    [document?.data]
  )

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
      await queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(),
      })
      await queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserAllDocumentsAction(),
      })
    } catch (error) {
      toast.dismiss()
      console.error('Error creating document:', error)
      toast.error('Failed to create document. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner classes='w-6 h-6' />
      </div>
    )
  }

  if (!document?.data || document?.error) {
    return <div className='h-full flex justify-center items-center'>{document?.message}</div>
  }

  if (document?.data?.length <= 0) {
    return (
      <div className='h-full flex flex-col items-center justify-center space-y-4'>
        <Image src='/assets/image/empty.webp' height='300' width='300' alt='Empty' />
        <h2 className='text-lg font-medium'>Welcome to {session?.user?.name}&apos;s dashboard</h2>
        <Button onClick={handleDocumentCreation}>
          <PlusCircle className='h-4 w-4 mr-1' />
          Create your first document
        </Button>
      </div>
    )
  }

  return (
    <div className='h-full p-6 mt-5 mx-10'>
      <h1 className='text-3xl font-medium text-center'>Welcome back, {session?.user?.name}!</h1>
      <div className='flex flex-col items-start justify-between mt-10 gap-4'>
        <h2 className='text-lg font-medium text-muted-foreground'>Your Documents:</h2>
        <div className='flex gap-6 overflow-x-auto pb-4 w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent'>
          {allUnArchivedDocuments?.map((doc) => (
            <RenderCard key={doc.id} doc={doc as unknown as z.infer<typeof documentSchema>} />
          ))}
        </div>
      </div>
      <div className='flex flex-col items-start justify-between mt-10 gap-4'>
        <h2 className='text-lg font-medium text-muted-foreground'>Your Trash:</h2>
        {allArchivedDocuments?.length === 0 ? (
          <div className='mt-5 h-full w-full text-center border-2 border-dashed border-muted rounded-md p-4'>
            <p className='text-sm text-muted-foreground'>
              No documents in the trash. Deleted documents will appear here.
            </p>
          </div>
        ) : (
          <div className='flex gap-6 overflow-x-auto pb-4 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
            {allArchivedDocuments?.map((doc) => (
              <RenderCard key={doc.id} doc={doc as unknown as z.infer<typeof documentSchema>} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
