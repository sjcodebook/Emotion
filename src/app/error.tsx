'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const ErrorPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Image src='/images/404.png' alt='404' width={300} height={300} />
      <h1 className='text-2xl font-bold'>Page not found</h1>
      <p className='text-gray-500'>Sorry, the page you are looking for does not exist.</p>
      <Link href='/'>
        <Button variant='outline' className='mt-4'>
          Go to Home
        </Button>
      </Link>
    </div>
  )
}

export default ErrorPage
