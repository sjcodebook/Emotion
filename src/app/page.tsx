import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className='h-full'>
      <h1 className='text-4xl font-bold'>Hello World</h1>
      <Image src='assets/svg/logo.svg' alt='logo' width={200} height={200} />
      <Button>Click me</Button>
      <ModeToggle />
    </div>
  )
}
