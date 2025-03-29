'use server'

import { authenticatedAction } from '@/lib/safe-action'
import { signOut } from '@/lib/auth'

import { createDocumentUseCase, getDocumentsByUserIdUseCase } from '@/use-cases/documents'
import { documentSchema } from '@/zod-schemas/documents'

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async () => await signOut())

export const createDocumentAction = authenticatedAction
  .createServerAction()
  .input(documentSchema)
  .handler(async ({ ctx, input }) => {
    try {
      await createDocumentUseCase({
        title: input.title,
        userId: ctx.user.id as string,
      })
      return { success: true, message: 'Document created successfully', error: null }
    } catch (error) {
      return { message: 'Failed to create document', error }
    }
  })

export const getCurrentUserDocumentsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      const userDocs = await getDocumentsByUserIdUseCase(ctx.user.id as string)
      return { success: true, data: userDocs, error: null }
    } catch (error) {
      return { message: 'Failed to get user documents', error }
    }
  })
