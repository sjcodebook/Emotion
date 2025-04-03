'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { createDocumentAction, archiveDocumentsAction } from '../actions'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface ItemProps {
  id?: string
  itemClasses?: string
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick?: () => void
  icon: LucideIcon
}

const Item = ({
  id,
  documentIcon,
  itemClasses = '',
  active,
  expanded,
  isSearch,
  level,
  onExpand = () => {},
  label,
  onClick = () => {},
  icon: Icon,
}: ItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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

  const onArchive = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (!id) return

    try {
      toast.loading('Archiving document...')
      const [data, err] = await archiveDocumentsAction({
        parentDocumentId: id,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to archive document. Please try again.')
        return
      }

      toast.success('Document archived successfully!')
      queryClient.refetchQueries()
    } catch (error) {
      toast.dismiss()
      console.error('Error archiving document:', error)
      toast.error('Failed to archive document. Please try again.')
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
        active && 'bg-primary/5 text-primary',
        itemClasses
      )}>
      {!!id && (
        <div
          role='button'
          className='p-[2px] h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
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
        <div className='ml-auto flex items-center gap-x-2'>
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role='button'
                className={cn(
                  'h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-[2px]',
                  isDropdownOpen
                    ? 'opacity-100 bg-neutral-300'
                    : 'opacity-0 group-hover:opacity-100'
                )}>
                <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60' align='start' side='right' forceMount>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive(e)
                }}>
                <Trash className='h-4 w-4 mr-2' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className='text-xs text-muted-foreground px-2 py-1'>
                Last edited by <span className='font-semibold'>User</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 p-[2px]'
            onClick={(e) => {
              e.stopPropagation()
              onCreate(e)
            }}>
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
