import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import prisma from '@/lib/prisma'
import authConfig from '@/lib/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub
      }

      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true,
  ...authConfig,
})
