'use client'

import { use, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useServerAction } from 'zsa-react'
import { useQueryClient } from '@tanstack/react-query'

import { getDocumentByIdAction } from '../../actions'
import { updateDocumentAction } from '../../actions'

import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Toolbar from '@/components/toolbar'
import Cover from '@/components/cover'
import Kanban from '@/components/kanban/board'

interface DocumentIdPageParams {
  documentId: string
}

const DocumentIdPage = ({ params }: { params: Promise<DocumentIdPageParams> }) => {
  const Editor = useMemo(
    () =>
      dynamic(() => import('@/components/editor'), {
        ssr: false,
      }),
    []
  )
  const queryClient = useQueryClient()
  const { documentId } = use(params)
  const { isLoading, data: document } = useServerActionQuery(getDocumentByIdAction, {
    input: {
      documentId,
    },
    queryKey: QueryKeyFactory.getDocumentByIdAction(documentId),
  })

  const { execute: updateDoc } = useServerAction(updateDocumentAction)

  const updateContent = useCallback(
    async (content: string) => {
      await updateDoc({
        id: documentId,
        content: content,
      })
    },
    [documentId, updateDoc]
  )

  const updateDocType = useCallback(
    async (type: 'KANBAN' | 'DOCUMENT') => {
      await updateDoc({
        id: documentId,
        type,
      })
      await queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getDocumentByIdAction(documentId),
      })
    },
    [documentId, queryClient, updateDoc]
  )

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>
        </div>
      </div>
    )
  }

  if (document?.error) {
    return <div className='h-full flex justify-center items-center'>{document?.message}</div>
  }

  if (!document?.data) {
    return <div className='flex justify-center items-center'>Document not found</div>
  }

  return (
    <div className=''>
      <div className='mb-10'>
        <Cover url={document.data.coverImage ?? ''} />
        <div className='mx-2 md:mx-8'>
          <Toolbar
            initialData={{
              id: document.data.id,
              title: document.data.title,
              content: document.data.content,
              coverImage: document.data.coverImage,
              icon: document.data.icon,
              parentDocumentId: document.data.parentDocumentId,
            }}
            preview={false}
          />
          <br />
          {!document.data.type ? (
            <div className='flex flex-row items-center justify-start h-full gap-4 ml-14'>
              <Card
                className='cursor-pointer transition-all hover:border-[2px] hover:border-gray-400 dark:hover:border-gray-600 p-0 w-50 overflow-hidden'
                onClick={() => updateDocType('DOCUMENT')}>
                <CardContent className='py-4'>
                  <h3 className='font-semibold'>Create an Editable Document</h3>
                </CardContent>
              </Card>
              <Card
                className='cursor-pointer transition-all hover:border-[2px] hover:border-gray-400 dark:hover:border-gray-600 p-0 w-50 overflow-hidden'
                onClick={() => updateDocType('KANBAN')}>
                <CardContent className='py-4'>
                  <h3 className='font-semibold'>Create a Kanban Board</h3>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {document.data.type === 'KANBAN' ? (
                <div className='mx-8 md:mx-12'>
                  <Kanban />
                </div>
              ) : (
                <Editor onChange={updateContent} initialContent={document.data.content} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentIdPage
