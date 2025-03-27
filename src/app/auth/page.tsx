'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

const Auth = () => {
  useEffect(() => {
    redirect('/auth/login')
  }, [])

  return null
}

export default Auth
