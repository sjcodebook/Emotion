'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

const Preview = () => {
  useEffect(() => {
    redirect('/')
  }, [])

  return null
}

export default Preview
