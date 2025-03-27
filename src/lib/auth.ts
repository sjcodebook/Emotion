import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import prisma from '@/lib/prisma'
import authConfig from '@/lib/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
})
