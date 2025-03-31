'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ChevronsLeftRight } from 'lucide-react'
import Avatar from 'boring-avatars'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LoadingSpinner from '@/components/loading-spinner'

import SignOutButton from './sign-out'

const UserItem = () => {
  const { data: session } = useSession()

  if (!session?.user)
    return (
      <div className='my-3 text-center'>
        <LoadingSpinner />
      </div>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role='button'
          className='flex items-center text-sm p-3 w-full hover:bg-primary/5 cursor-pointer'>
          <div className='gap-x-2 flex items-center max-w-[150px]'>
            <div className='relative h-6 w-9 rounded-full overflow-hidden'>
              {session?.user?.image ? (
                <Image fill src={session?.user?.image} alt={session?.user?.name + "'s avatar"} />
              ) : (
                <Avatar name={session?.user?.name ?? ''} variant='beam' />
              )}
            </div>
            <span className='text-start font-medium line-clamp-1'>
              {session?.user?.name}&apos; Emotion
            </span>
          </div>
          <ChevronsLeftRight className='rotate-90 ml-2 text-muted-foreground h-4 w-4' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='start' alignOffset={11} forceMount>
        <div className='flex flex-col space-y-4 p-2'>
          <p className='text-xs font-medium leading-none text-muted-foreground'>
            {session?.user?.email}
          </p>
          <div className='flex items-center gap-x-2'>
            <div className='rounded-md bg-secondary p-1'>
              <div className='relative h-6 w-6 rounded-full overflow-hidden'>
                {session?.user?.image ? (
                  <Image fill src={session?.user?.image} alt={session?.user?.name + "'s avatar"} />
                ) : (
                  <Avatar name={session?.user?.name ?? ''} variant='beam' />
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-sm line-clamp-1'>{session?.user?.name}&apos;s Emotion</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='w-full cursor-pointer text-muted-foreground'>
          <SignOutButton btnText='Log out' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserItem
