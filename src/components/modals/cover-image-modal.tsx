'use client'

import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { useCoverImage } from '@/hooks/use-cover-image'
import { SingleImageDropzone } from '@/components/single-image-dropzone'

const CoverImageModal = () => {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const coverImage = useCoverImage()

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000)
      })
      setIsSubmitting(false)
      setFile(undefined)
      coverImage.onClose()
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal
