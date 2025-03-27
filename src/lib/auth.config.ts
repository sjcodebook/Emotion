import { ZodError } from 'zod'
import Credentials from 'next-auth/providers/credentials'

import { signInSchema } from '@/lib/zod'
import { getUserProfileByEmailUseCase, verifyUserPasswordUseCase } from '@/use-cases/users'

import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          // Check if the user exists in the database
          const user = await getUserProfileByEmailUseCase(email)

          if (!user) {
            throw new Error('User not found.')
          }

          // Check if the password is correct
          const isPasswordCorrect = await verifyUserPasswordUseCase(user.id, password)

          if (!isPasswordCorrect) {
            throw new Error('Password is incorrect.')
          }

          // Return the user object
          return user
        } catch (error) {
          console.error(error)
          if (error instanceof ZodError) {
            return new Error('Invalid credentials')
          }
          return new Error(error instanceof Error ? error.message : 'An unknown error occurred')
        }
      },
    }),
  ],
} satisfies NextAuthConfig
