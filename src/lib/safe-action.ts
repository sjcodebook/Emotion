// import { env } from '@/env'
// import { assertAuthenticated } from '@/lib/session'
// import { PublicError } from '@/use-cases/errors'
// import { createServerActionProcedure } from 'zsa'

// function shapeErrors({ err }: { err: unknown }) {
//   const isAllowedError = err instanceof PublicError
//   // let's all errors pass through to the UI so debugging locally is easier
//   const isDev = env.NODE_ENV === 'development'
//   if (isAllowedError || isDev) {
//     console.error(err)
//     return {
//       code: (err as { code?: string })?.code ?? 'ERROR',
//       message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${(err as Error).message}`,
//     }
//   } else {
//     return {
//       code: 'ERROR',
//       message: 'Something went wrong',
//     }
//   }
// }

// export const authenticatedAction = createServerActionProcedure()
//   .experimental_shapeError(shapeErrors)
//   .handler(async () => {
//     const user = await assertAuthenticated()

//     return { user }
//   })

// export const unauthenticatedAction = createServerActionProcedure()
//   .experimental_shapeError(shapeErrors)
//   .handler(async () => {})
