'use client'

import { SessionProvider } from 'next-auth/react'

function UserSessionProvider({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>
}

export default UserSessionProvider
