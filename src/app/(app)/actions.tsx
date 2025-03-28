'use server'

import { authenticatedAction } from '@/lib/safe-action'
import { signOut } from '@/lib/auth'

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async () => await signOut())
