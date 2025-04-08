'use client'

import { use } from 'react'

import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import { getDocumentByIdAction } from '../../actions'
import Toolbar from '@/components/toolbar'

interface DocumentIdPageParams {
  documentId: string
}

const DocumentIdPage = ({ params }: { params: Promise<DocumentIdPageParams> }) => {
  const { documentId } = use(params)
  const { isLoading, data: document } = useServerActionQuery(getDocumentByIdAction, {
    input: {
      documentId,
    },
    queryKey: QueryKeyFactory.getDocumentByIdAction(documentId),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (document?.error) {
    return <div>Something went wrong</div>
  }

  if (!document?.data) {
    return <div>Document not found</div>
  }

  return (
    <div className='pb-40'>
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <div className='h-[35vh]' />
        <Toolbar
          initialData={{
            id: document.data.id,
            title: document.data.title,
            content: document.data.content,
            coverImage: document.data.coverImage,
            icon: document.data.icon,
          }}
          preview={false}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
