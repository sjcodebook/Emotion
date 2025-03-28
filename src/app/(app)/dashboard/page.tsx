import Image from 'next/image'

import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

const Dashboard = async () => {
  const session = await auth()

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src='/assets/image/empty.webp' height='300' width='300' alt='Empty' />
      <h2 className='text-lg font-medium'>Welcome to {session?.user?.name}&apos;s dashboard</h2>
      <Button>
        <PlusCircle className='h-4 w-4 mr-1' />
        Create a new document
      </Button>
    </div>
  )
}

export default Dashboard
