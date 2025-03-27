'use server'

import { AuthError } from 'next-auth'

import { unauthenticatedAction } from '@/lib/safe-action'
import { signIn } from '@/lib/auth'
import { signUpSchema } from '@/lib/zod'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserProfileByEmailUseCase, createUserUseCase } from '@/use-cases/users'

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    try {
      const user = await getUserProfileByEmailUseCase(input.email)
      if (user) {
        return { error: 'User already exists. Please login.' }
      }
      await createUserUseCase(input.name, input.email, input.password)
      await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      })
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
