'use client'

import { ComponentRef, useRef, useState, useEffect, useCallback } from 'react'
import { useServerAction } from 'zsa-react'
import { useDebounceCallback } from 'usehooks-ts'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { documentSchema } from '@/zod-schemas/documents'
import { ImageIcon, Smile, X } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'
import { useLimitQuery } from '@/hooks/use-limit-query'

import { updateDocumentAction } from '../app/(app)/actions'

import { Button } from './ui/button'
import IconPicker from './icon-picker'

interface ToolbarProps {
  initialData?: z.infer<typeof documentSchema>
  preview?: boolean
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ComponentRef<'textarea'>>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData?.title)

  const addQuery = useLimitQuery({
    limitDuration: 300,
  })

  const queryClient = useQueryClient()

  const { execute: updateDoc } = useServerAction(updateDocumentAction)

  const updateData = useCallback(async () => {
    if (isEditing && initialData?.title !== value && value?.trim().length !== 0) {
      await updateDoc({
        id: initialData?.id,
        title: value,
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
    value,
    updateDoc,
  ])

  const debouncedUpdate = useDebounceCallback(updateData, 300)

  useEffect(() => {
    if (value?.trim().length !== 0 && initialData?.title !== value) {
      addQuery(debouncedUpdate)
    }
  }, [addQuery, debouncedUpdate, initialData?.title, value, updateData])

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData?.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onInput = (value: string) => {
    setValue(value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      disableInput()
    }
  }

  return (
    <div className='pl-[54px] group relative'>
      {!!initialData?.icon && !preview && (
        <div className='flex items-center gap-x-2 group/icon pt-6'>
          <IconPicker onChange={() => {}}>
            <p className='text-6xl hover:opacity-75 transition'>{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={() => {}}
            variant='outline'
            size='icon'
            className='rounded-full text-muted-foreground text-xs opacity-0 group-hover/icon:opacity-100 transition'>
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}
      {!!initialData?.icon && preview && <p className='text-6xl pt-6'>{initialData.icon}</p>}
      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
        {!initialData?.icon && !preview && (
          <IconPicker onChange={() => {}} asChild>
            <Button variant='outline' size='sm' className='text-muted-foreground text-xs'>
              <Smile className='h-4 w-4 mr-2' />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData?.coverImage && !preview && (
          <Button variant='outline' size='sm' className='text-muted-foreground text-xs'>
            <ImageIcon className='h-4 w-4 mr-2' />
            Add cover image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]'>
          {initialData?.title || 'Untitled'}
        </div>
      )}
    </div>
  )
}

export default Toolbar
