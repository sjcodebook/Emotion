'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { signOutAction } from '../actions'

const SignOutButton = ({
  btnText = 'Sign Out',
  variant = 'link',
  classes = '',
}: {
  btnText?: string
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined
  classes?: string
}) => {
  const handleSignOut = async () => {
    try {
      await signOutAction()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      window.location.reload()
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant={variant}
      className={cn('text-muted-foreground', classes)}>
      {btnText}
    </Button>
  )
}

export default SignOutButton
