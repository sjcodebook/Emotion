'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileIcon } from 'lucide-react'

import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'
import { cn } from '@/lib/utils'

import Item from './item'
import { getCurrentUserDocumentByParentDocumentIdAction } from '../actions'

interface DocumentListProps {
  parentDocumentId?: string
  level?: number
  data?: unknown[]
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const {
    isLoading,
    isRefetching,
    data: allDocuments,
  } = useServerActionQuery(getCurrentUserDocumentByParentDocumentIdAction, {
    input: {
      parentDocumentId: parentDocumentId || null,
    },
    queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(),
  })

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }))
  }

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (isLoading || isRefetching) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}>
        No pages inside
      </p>
      {allDocuments?.data?.map((document) => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon ?? ''}
            active={params.documentId === document.id}
            expanded={expanded[document.id]}
            level={level}
            onExpand={() => onExpand(document.id)}
          />
          {expanded[document.id] && (
            <DocumentList parentDocumentId={document.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList
