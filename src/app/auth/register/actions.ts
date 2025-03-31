'use server'

import { AuthError } from 'next-auth'

import { unauthenticatedAction } from '@/lib/safe-action'
import { signIn } from '@/lib/auth'
import { signUpSchema } from '@/zod-schemas/users'
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
      await createUserUseCase({ name: input.name, email: input.email, password: input.password })
      await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirect: false,
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
