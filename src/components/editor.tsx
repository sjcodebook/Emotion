'use client'

import { useTheme } from 'next-themes'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/shadcn'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'

import '@blocknote/shadcn/style.css'
interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string | null
  editable?: boolean
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
  })

  return (
    <div className='blocknote-editor z-[9999999]'>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        editable={editable}
        onChange={() => {
          onChange(JSON.stringify(editor.document, null, 2))
        }}
      />
    </div>
  )
}

export default Editor
