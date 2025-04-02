'use server'

import { authenticatedAction } from '@/lib/safe-action'
import { signOut } from '@/lib/auth'

import {
  getDocumentByIdUseCase,
  createDocumentUseCase,
  getDocumentsByUserIdUseCase,
  getUserDocumentsByParentDocumentIdUseCase,
  updateDocumentArchiveStatusUseCase,
} from '@/use-cases/documents'
import { documentSchema } from '@/zod-schemas/documents'
import { object, string, boolean } from 'zod'

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
        isArchived: false,
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
      const data = await createDocumentUseCase({
        title: input.title,
        parentDocumentId: input.parentDocumentId ?? null,
        userId: ctx.user.id as string,
      })
      return { success: true, message: 'Document created successfully!', error: null, data }
    } catch (error) {
      return { message: 'Failed to create document', error }
    }
  })

export const updateDocumentsArchiveStatusAction = authenticatedAction
  .createServerAction()
  .input(object({ parentDocumentId: string(), isArchived: boolean() }))
  .handler(async ({ ctx, input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.parentDocumentId)
      if (!doc) {
        return { message: 'Document not found', error: true }
      }
      if (doc.userId !== ctx.user.id) {
        return { message: 'You are not authorized to update this document', error: true }
      }

      const recursiveArchive = async (parentDocumentId: string, isArchived: boolean) => {
        const childrens = await getUserDocumentsByParentDocumentIdUseCase({
          userId: ctx.user.id as string,
          parentDocumentId,
        })

        for (const child of childrens) {
          await updateDocumentArchiveStatusUseCase({
            documentId: child.id,
            isArchived,
          })
          await recursiveArchive(child.id, isArchived)
        }
      }

      await updateDocumentArchiveStatusUseCase({
        documentId: input.parentDocumentId,
        isArchived: input.isArchived,
      })

      await recursiveArchive(input.parentDocumentId, input.isArchived)

      return { success: true, message: 'Document updated successfully!', error: null }
    } catch (error) {
      return { message: 'Failed to create document', error }
    }
  })
