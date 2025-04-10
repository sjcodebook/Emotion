import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'

import authConfig from '@/lib/auth.config'
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.some((route) => {
    // Handle dynamic segments with any parameter name: [id], [slug], etc.
    if (route.includes('[')) {
      const dynamicRouteRegex = new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+')}$`)
      return dynamicRouteRegex.test(nextUrl.pathname)
    }
    return nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  })

  // Apply the same logic to auth routes if they can have dynamic segments
  const isAuthRoute = authRoutes.some((route) => {
    if (route.includes('[')) {
      const dynamicRouteRegex = new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+')}$`)
      return dynamicRouteRegex.test(nextUrl.pathname)
    }
    return nextUrl.pathname === route
  })

  if (isApiAuthRoute) {
    return undefined
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return undefined
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl))
  }

  return undefined
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
