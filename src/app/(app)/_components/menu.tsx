'use client'

import { toast } from 'sonner'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { archiveDocumentsAction } from '../actions'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface MenuProps {
  documentId: string
}

const Menu = ({ documentId }: MenuProps) => {
  const queryClient = useQueryClient()

  const onArchive = async () => {
    try {
      toast.loading('Archiving document...')
      const [data, err] = await archiveDocumentsAction({
        parentDocumentId: documentId,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to archive document. Please try again.')
        return
      }

      toast.success('Document archived successfully!')
      await queryClient.refetchQueries()
    } catch (error) {
      toast.dismiss()
      console.error('Error archiving document:', error)
      toast.error('Failed to archive document. Please try again.')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-60' align='end' sideOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className='h-4 w-4 mr-2' />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className='text-xs text-muted-foreground p-2'>Last edited by: user</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-8 w-10 rounded-md' />
}

export default Menu
