'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { getCurrentUserArchivedDocumentsAction, restoreArchivedDocumentsAction } from '../actions'
import { Search, Trash, Undo } from 'lucide-react'
import { Input } from '@/components/ui/input'

const TrashBox = () => {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const {
    isLoading,
    isRefetching,
    data: allDocuments,
  } = useServerActionQuery(getCurrentUserArchivedDocumentsAction, {
    input: undefined,
    queryKey: QueryKeyFactory.getCurrentUserArchivedDocumentsAction(),
  })

  const filteredDocuments = useMemo(() => {
    return allDocuments?.data?.filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase())
    })
  }, [allDocuments, search])

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: string) => {
    e.stopPropagation()
    if (!documentId) return

    try {
      toast.loading('Restoring document...')
      const [data, err] = await restoreArchivedDocumentsAction({
        documentId,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to restore document. Please try again.')
        return
      }

      toast.success('Document restored successfully!')
      queryClient.refetchQueries({
        queryKey: [
          QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(),
          QueryKeyFactory.getCurrentUserDocumentsAction(),
        ],
      })

      // router.push(`/documents/${data?.data?.id}}`)
    } catch (error) {
      toast.dismiss()
      console.error('Error creating document:', error)
      toast.error('Failed to create document. Please try again.')
    }
  }

  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1 p-2'>
        <Search className='h-4 w-4' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Filter by page title...'
          className='h-7 px-2 focus-visible:ring-transparent bg-secondary'
        />
      </div>
      <div className='mt-2 px-1 pb-1 overflow-scroll max-h-40'>
        <p className='hidden last:block text-xs text-center text-muted-foreground pb-2'>
          No documents in the trash.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role='button'
            onClick={() => onClick(document.id)}
            className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between'>
            <span className='truncate pl-2 py-1 cursor-pointer'>{document.title}</span>
            <div className='flex items-center'>
              <div
                onClick={(e) => onRestore(e, document.id)}
                role='button'
                className='rounded-sm p-2 hover:bg-neutral-200 cursor-pointer'>
                <Undo className='h-4 w-4 text-muted-foreground' />
              </div>
              <div
                onClick={() => {}}
                role='button'
                className='rounded-sm p-2 hover:bg-neutral-200 cursor-pointer'>
                <Trash className='h-4 w-4 text-muted-foreground' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox
