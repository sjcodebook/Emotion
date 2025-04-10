/**
 * Array of public routes
 * Routes that are accessible to the public
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/preview', '/preview/[id]']

/**
 * Array of routes that are used for authentication purposes
 * @type {string[]}
 */
export const authRoutes: string[] = ['/auth/login', '/auth/register']

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth'

/**
 * The default redirect path after loging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard'
