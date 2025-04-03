'use client'

import { z } from 'zod'
import { documentSchema } from '@/zod-schemas/documents'
import { ImageIcon, Smile, X } from 'lucide-react'

import { Button } from './ui/button'
import IconPicker from './icon-picker'

interface ToolbarProps {
  initialData?: z.infer<typeof documentSchema>
  preview?: boolean
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
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
    </div>
  )
}

export default Toolbar
