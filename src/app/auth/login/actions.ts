'use server'

import { AuthError } from 'next-auth'

import { unauthenticatedAction } from '@/lib/safe-action'
import { signIn } from '@/lib/auth'
import { signInSchema } from '@/zod-schemas/users'
import { getUserProfileByEmailUseCase } from '@/use-cases/users'

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    try {
      const user = await getUserProfileByEmailUseCase(input.email)
      if (!user) {
        return { error: "User doesn't exists. Please sign up first." }
      }
      await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirect: false,
      })
      return { error: null }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin': {
            return { error: 'Invalid crendentials.' }
          }
          default: {
            return { error: "Something went wrong. We're looking into it." }
          }
        }
      }
      throw error
    }
  })
