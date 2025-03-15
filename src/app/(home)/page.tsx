import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import Navbar from './navbar'

export default function Home() {
  return (
    <div className='h-full'>
      <Navbar />
    </div>
  )
}
