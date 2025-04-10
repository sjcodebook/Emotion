'use client'

import { ComponentRef, useEffect, useRef, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import {
  ChevronsLeft,
  Home,
  MenuIcon,
  PlusCircle,
  PlusSquare,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'
import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

import UserItem from './user-item'
import Item from './item'
import DocumentList from './documet-list'
import TrashBox from './trash-box'
import Navbar from './navbar'
import { createDocumentAction } from '../actions'

export const Navigation = () => {
  const router = useRouter()
  const params = useParams()
  const onOpenSearch = useSearch((state) => state.onOpen)
  const onOpenSettings = useSettings((state) => state.onOpen)
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ComponentRef<'aside'>>(null)
  const navbarRef = useRef<ComponentRef<'div'>>(null)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.setProperty('width', `${newWidth}px`)
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% - 240px)')
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')

      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

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

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999] pb-8',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}>
        <div
          onClick={collapse}
          role='button'
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer',
            isMobile && 'opacity-100'
          )}>
          <ChevronsLeft className='h-6 w-6' />
        </div>
        <div>
          <UserItem />
          <Item
            label='Home'
            icon={Home}
            onClick={() => {
              router.push('/dashboard')
            }}
          />
          <Item label='Search' icon={Search} isSearch onClick={onOpenSearch} />
          <Item label='Settings' icon={Settings} onClick={onOpenSettings} />
          <Item onClick={handleDocumentCreation} label='New Page' icon={PlusCircle} />
        </div>
        <div className='mt-4'>
          <DocumentList />
          <Item
            onClick={handleDocumentCreation}
            label='Add a Page'
            icon={PlusSquare}
            itemClasses='mt-2 ml-[2px]'
          />
          <Popover onOpenChange={setIsTrashOpen}>
            <PopoverTrigger className='w-full ml-[2px]'>
              <Item active={isTrashOpen} label='Trash' icon={Trash} />
            </PopoverTrigger>
            <PopoverContent side={isMobile ? 'bottom' : 'right'} className='p-0 w-72'>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}>
        {!!params.documentId ? (
          <Navbar
            key={params.documentId as string}
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ) : (
          <nav className='bg-transparent px-3 py-2 w-full'>
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role='button'
                className='h-6 w-6 text-muted-foreground cursor-pointer'
              />
            )}
          </nav>
        )}
      </div>
    </>
  )
}

export default Navigation
