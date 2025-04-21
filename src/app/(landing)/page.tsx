'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

const Landing = () => {
  useEffect(() => {
    redirect('/dashboard')
  }, [])

  return null
}

export default Landing
