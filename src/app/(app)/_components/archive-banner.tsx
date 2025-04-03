'use client'

import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { restoreArchivedDocumentsAction, deleteDocumentAction } from '../actions'

import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'

interface ArchiveBannerProps {
  documentId: string
}

const ArchiveBanner = ({ documentId }: ArchiveBannerProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const onRestore = async () => {
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
      await queryClient.refetchQueries()
    } catch (error) {
      toast.dismiss()
      console.error('Error restoring document:', error)
      toast.error('Failed to restore document. Please try again.')
    }
  }

  const onDelete = async () => {
    try {
      toast.loading('Deleting document...')
      const [data, err] = await deleteDocumentAction({
        documentId,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to delete document. Please try again.')
        return
      }

      toast.success('Document deleted successfully!')
      await queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserArchivedDocumentsAction(),
      })
      router.push('/dashboard')
    } catch (error) {
      toast.dismiss()
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document. Please try again.')
    }
  }

  return (
    <div className='w-full bg-red-400 text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
      <p className='text-md font-bold'>This page is in the Trash</p>
      <Button
        size='sm'
        onClick={onRestore}
        variant='outline'
        className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white/80 p-1 px-2 h-auto font-normal'>
        Restore page
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size='sm'
          variant='outline'
          className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white/80 p-1 px-2 h-auto font-normal'>
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default ArchiveBanner
