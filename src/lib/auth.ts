import NextAuth from 'next-auth'
import { ZodError } from 'zod'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'

import prisma from '@/lib/prisma'
import { signInSchema } from '@/lib/zod'

import { getUserProfileByEmailUseCase, verifyUserPasswordUseCase } from '@/use-cases/users'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
          if (error instanceof ZodError) {
            return new Error('Invalid credentials')
          }
          return new Error(error instanceof Error ? error.message : 'An unknown error occurred')
        }
      },
    }),
  ],
})
