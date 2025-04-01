'use server'

import { authenticatedAction } from '@/lib/safe-action'
import { signOut } from '@/lib/auth'

import {
  createDocumentUseCase,
  getDocumentsByUserIdUseCase,
  getUserDocumentsByParentDocumentIdUseCase,
} from '@/use-cases/documents'
import { documentSchema } from '@/zod-schemas/documents'
import { object, string } from 'zod'

export const signOutAction = authenticatedAction.createServerAction().handler(async () => {
  await signOut()
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

export const getCurrentUserDocumentByParentDocumentIdAction = authenticatedAction
  .createServerAction()
  .input(
    object({
      parentDocumentId: string().nullable(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const userDocs = await getUserDocumentsByParentDocumentIdUseCase({
        userId: ctx.user.id as string,
        parentDocumentId: input.parentDocumentId ?? null,
      })
      return { success: true, data: userDocs, error: null }
    } catch (error) {
      return { message: 'Failed to get user documents by parent document id', error }
    }
  })

export const createDocumentAction = authenticatedAction
  .createServerAction()
  .input(documentSchema)
  .handler(async ({ ctx, input }) => {
    try {
      await createDocumentUseCase({
        title: input.title,
        parentDocumentId: input.parentDocumentId ?? null,
        userId: ctx.user.id as string,
      })
      return { success: true, message: 'Document created successfully!', error: null }
    } catch (error) {
      return { message: 'Failed to create document', error }
    }
  })
