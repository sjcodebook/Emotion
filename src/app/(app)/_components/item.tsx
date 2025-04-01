'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, LucideIcon, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { createDocumentAction } from '../actions'

interface ItemProps {
  id?: string
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick: () => void
  icon: LucideIcon
}

const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level,
  onExpand,
  label,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onExpand?.()
  }

  const onCreate = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (!id) return

    try {
      toast.loading('Creating document...')
      const [data, err] = await createDocumentAction({
        title: 'Untitled Document',
        parentDocumentId: id,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to create document. Please try again.')
        return
      }

      toast.success('Document created successfully!')
      queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(id),
      })

      if (!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${data?.data?.id}}`)
    } catch (error) {
      toast.dismiss()
      console.error('Error creating document:', error)
      toast.error('Failed to create document. Please try again.')
    }
  }

  return (
    <div
      onClick={onClick}
      role='button'
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : '12px',
      }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer',
        active && 'bg-primary/5 text-primary'
      )}>
      {!!id && (
        <div
          role='button'
          className='p-1 h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1'
          onClick={handleExpand}>
          <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
        </div>
      )}
      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>
      ) : (
        <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className='ml-auto flex items-center gap-x-2' onClick={onCreate}>
          <div className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 p-1'>
            <Plus className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className='flex gap-x-2 py-[3px]'>
      <Skeleton className='h-4 w-4 bg-gray-300' />
      <Skeleton className='h-4 w-[50%] bg-gray-300' />
    </div>
  )
}

export default Item
