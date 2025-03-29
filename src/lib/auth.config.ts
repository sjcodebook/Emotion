import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { env } from '@/env'
import { signInSchema } from '@/zod-schemas/users'
import { getUserProfileByEmailUseCase, verifyUserPasswordUseCase } from '@/use-cases/users'

import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = signInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          // Check if the user exists in the database
          const user = await getUserProfileByEmailUseCase(email)

          if (!user || !user.hashedPassword) return null

          // Check if the password is correct
          const isPasswordCorrect = await verifyUserPasswordUseCase({ userId: user.id, password })

          if (!isPasswordCorrect) return null

          // Return the user object
          return user
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
