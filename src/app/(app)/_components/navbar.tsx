'use client'

import { useParams } from 'next/navigation'
import { MenuIcon } from 'lucide-react'

import { QueryKeyFactory, useServerActionQuery } from '@/hooks/use-server-action-hooks'

import { getDocumentByIdAction } from '../actions'

import ArchiveBanner from './archive-banner'
import Title from './title'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams()

  const { isLoading, data: document } = useServerActionQuery(getDocumentByIdAction, {
    input: {
      documentId: params.documentId as string,
    },
    queryKey: QueryKeyFactory.getDocumentByIdAction(params.documentId as string),
    enabled: !!params.documentId,
  })

  if (isLoading) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center'>
        <Title.Skeleton />
      </nav>
    )
  }

  if (document?.error) {
    return <div>{document.message}</div>
  }

  return (
    <>
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='w-6 h-6 text-muted-foreground cursor-pointer'
          />
        )}
        <div className='flex items-center justify-between w-full'>
          <Title
            initialData={{
              id: document?.data?.id,
              title: document?.data?.title,
              icon: document?.data?.icon,
              parentDocumentId: document?.data?.parentDocumentId,
            }}
          />
        </div>
      </nav>
      {document?.data?.isArchived && <ArchiveBanner documentId={document.data.id} />}
    </>
  )
}

export default Navbar
