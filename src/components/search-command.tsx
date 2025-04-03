'use client'

import { useState, useEffect } from 'react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useSearch } from '@/hooks/use-search'
import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { getCurrentUserUnArchivedDocumentsAction } from '../app/(app)/actions'
import LoadingSpinner from './loading-spinner'

const SearchCommand = () => {
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const {
    isLoading,
    isRefetching,
    data: allDocuments,
  } = useServerActionQuery(getCurrentUserUnArchivedDocumentsAction, {
    input: undefined,
    queryKey: QueryKeyFactory.getCurrentUserUnArchivedDocumentsAction(),
  })

  const toggle = useSearch((state) => state.toggle)
  const isOpen = useSearch((state) => state.isOpen)
  const onClose = useSearch((state) => state.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/dashboard/${id}`)
    onClose()
  }

  if (!isMounted) {
    return null
  }

  if (isLoading || isRefetching) {
    return (
      <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput placeholder={`Search ${session?.user?.name}'s Emotion`} />
        <CommandList>
          <div className='my-10 flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        </CommandList>
      </CommandDialog>
    )
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${session?.user?.name}'s Emotion`} />
      <CommandList>
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {allDocuments?.data?.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}>
              {document.icon ? (
                <p className='mr-2 text-[18px]'>{document.icon}</p>
              ) : (
                <File className='mr-2 h-4 w-4' />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchCommand
