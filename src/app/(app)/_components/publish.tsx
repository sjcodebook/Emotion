'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Check, Copy, Globe } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { documentSchema } from '@/zod-schemas/documents'

import useOrigin from '@/hooks/use-origin'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { updateDocumentAction } from '../actions'

interface PublishProps {
  initialData?: z.infer<typeof documentSchema>
}

const Publish = ({ initialData }: PublishProps) => {
  const [copied, setCopied] = useState(false)
  const [isSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const origin = useOrigin()
  // const update = () => {}

  const url = `${origin}/preview/${initialData?.id}`

  const onPublish = async () => {
    try {
      toast.loading('Publishing document...')
      const [data, err] = await updateDocumentAction({
        id: initialData?.id,
        isPublished: true,
        parentDocumentId: initialData?.id,
      })
      toast.dismiss()
      await queryClient.refetchQueries()

      if (err || data?.error) {
        console.error('Error publishing document:', data?.error)
        toast.error('Failed to publish document. Please try again.')
        return
      }

      toast.success('Document published successfully!')
    } catch (error) {
      console.error('Error publishing document:', error)
      toast.dismiss()
      console.error('Error publishing document:', error)
      toast.error('Failed to publish document. Please try again.')
    }
  }

  const onUnPublish = async () => {
    try {
      toast.loading('Unpublish document...')
      const [data, err] = await updateDocumentAction({
        isPublished: false,
        parentDocumentId: initialData?.id,
      })
      toast.dismiss()

      if (err || data?.error) {
        toast.error('Failed to publish document. Please try again.')
        return
      }

      toast.success('Document published successfully!')
    } catch (error) {
      toast.dismiss()
      console.error('Error publishing document:', error)
      toast.error('Failed to publish document. Please try again.')
    }
  }

  const onCopy = async () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='sm'>
          {initialData?.isPublished ? (
            'Unpublish'
          ) : (
            <>
              Publish
              <Globe className='text-sky-500 w-4 h-4 ml-2' />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72' align='end' alignOffset={8} forceMount>
        {initialData?.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='text-sky-500 animate-pulse h-4 w-4' />
              <p className='text-xs font-medium text-sky-500'>This note is live on web</p>
            </div>
            <div className='flex items-center'>
              <input
                className='flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate'
                value={url}
                disabled
              />
              <Button onClick={onCopy} disabled={copied} className='h-8 rounded-l-none'>
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </Button>
            </div>
            <Button
              size='sm'
              className='w-full text-xs'
              disabled={isSubmitting}
              onClick={onUnPublish}>
              Unpublish
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <Globe className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm font-medium mb-2'>Public this note</p>
            <span className='text-xs text-muted-foreground mb-4'>Share your work with others</span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className='w-full text-xs'
              size='sm'>
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Publish
