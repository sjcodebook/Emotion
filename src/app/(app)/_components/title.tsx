'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useServerAction } from 'zsa-react'
import { useDebounceCallback } from 'usehooks-ts'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { documentSchema } from '@/zod-schemas/documents'

import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'
import { useLimitQuery } from '@/hooks/use-limit-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { updateDocumentAction } from '../actions'
interface TitleProps {
  initialData?: z.infer<typeof documentSchema>
}

const Title = ({ initialData }: TitleProps) => {
  const [title, setTitle] = useState(initialData?.title || 'Untitled Document')
  const [isEditing, setIsEditing] = useState(false)

  const addQuery = useLimitQuery({
    limitDuration: 300,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { execute: updateDoc } = useServerAction(updateDocumentAction)

  const updateData = useCallback(async () => {
    if (isEditing && initialData?.title !== title && title.trim().length !== 0) {
      await updateDoc({
        id: initialData?.id,
        title,
      })
      await queryClient.refetchQueries({
        queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(
          initialData?.parentDocumentId as string
        ),
      })
    }
  }, [
    initialData?.id,
    initialData?.parentDocumentId,
    initialData?.title,
    isEditing,
    queryClient,
    title,
    updateDoc,
  ])

  const debouncedUpdate = useDebounceCallback(updateData, 300)

  useEffect(() => {
    if (title.trim().length !== 0 && initialData?.title !== title) {
      addQuery(debouncedUpdate)
    }
  }, [addQuery, debouncedUpdate, initialData?.title, title, updateData])

  const enableInput = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0)
  }

  const disableInput = async () => {
    if (title.trim().length === 0) {
      setTitle(initialData?.title ?? 'Untitled Document')
    }
    await debouncedUpdate()
    setIsEditing(false)
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      disableInput()
    }
  }

  return (
    <div className='flex items-center gap-x-1'>
      {!!initialData?.icon && <p>{initialData?.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button onClick={enableInput} variant='ghost' size='sm' className='font-normal h-auto p-1'>
          <span className='truncate'>{title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-8 w-20 rounded-md' />
}

export default Title
