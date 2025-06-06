'use server'

import { authenticatedAction, unauthenticatedAction } from '@/lib/safe-action'
import { signOut, auth } from '@/lib/auth'

import {
  getDocumentByIdUseCase,
  createDocumentUseCase,
  updateDocumentUseCase,
  deleteDocumentUseCase,
  getDocumentsByUserIdUseCase,
  getUserDocumentsByParentDocumentIdUseCase,
} from '@/use-cases/documents'
import { documentSchema } from '@/zod-schemas/documents'
import { object, string } from 'zod'

export const signOutAction = authenticatedAction.createServerAction().handler(async () => {
  await signOut()
})

export const getDocumentByIdAction = unauthenticatedAction
  .createServerAction()
  .input(
    object({
      documentId: string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.documentId)

      if (!doc) {
        return { message: 'Document not found.', error: true }
      }

      if (doc.isPublished && !doc.isArchived) {
        return { success: true, message: 'Document found successfully.', error: null, data: doc }
      }

      const session = await auth()

      if (!session?.user) {
        return { message: 'Not authenticated.', error: true }
      }

      if (doc.userId !== session.user.id) {
        return { message: 'You are not authorized to view this document.', error: true }
      }

      return { success: true, data: doc, error: null }
    } catch (error) {
      return { message: 'Failed to get document.', error }
    }
  })

export const getCurrentUserAllDocumentsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      const userDocs = await getDocumentsByUserIdUseCase({ userId: ctx.user.id as string })
      return { success: true, data: userDocs, error: null }
    } catch (error) {
      return { message: 'Failed to get user documents.', error }
    }
  })

export const getCurrentUserUnArchivedDocumentsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      const userDocs = await getDocumentsByUserIdUseCase({
        userId: ctx.user.id as string,
        isArchived: false,
      })
      return { success: true, data: userDocs, error: null }
    } catch (error) {
      return { message: 'Failed to get user unarchived documents.', error }
    }
  })

export const getCurrentUserArchivedDocumentsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      const userDocs = await getDocumentsByUserIdUseCase({
        userId: ctx.user.id as string,
        isArchived: true,
      })
      return { success: true, data: userDocs, error: null }
    } catch (error) {
      return { message: 'Failed to get user archived documents.', error }
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
      return { message: 'Failed to get user documents by parent document id.', error }
    }
  })

export const createDocumentAction = authenticatedAction
  .createServerAction()
  .input(documentSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const data = await createDocumentUseCase({
        title: input.title ?? 'Untitled Document',
        parentDocumentId: input.parentDocumentId ?? null,
        userId: ctx.user.id as string,
      })
      return { success: true, message: 'Document created successfully!', error: null, data }
    } catch (error) {
      return { message: 'Failed to create document.', error }
    }
  })

export const archiveDocumentsAction = authenticatedAction
  .createServerAction()
  .input(object({ parentDocumentId: string() }))
  .handler(async ({ ctx, input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.parentDocumentId)
      if (!doc) {
        return { message: 'Document not found.', error: true }
      }
      if (doc.userId !== ctx.user.id) {
        return { message: 'You are not authorized to archive this document.', error: true }
      }

      const recursiveArchive = async (parentDocumentId: string) => {
        const childrens = await getUserDocumentsByParentDocumentIdUseCase({
          userId: ctx.user.id as string,
          parentDocumentId,
        })

        for (const child of childrens) {
          await updateDocumentUseCase({
            id: child.id,
            isArchived: true,
          })
          await recursiveArchive(child.id)
        }
      }

      await updateDocumentUseCase({
        id: input.parentDocumentId,
        isArchived: true,
      })

      await recursiveArchive(input.parentDocumentId)

      return { success: true, message: 'Document archived successfully!', error: null }
    } catch (error) {
      return { message: 'Failed to archive document.', error }
    }
  })

export const restoreArchivedDocumentsAction = authenticatedAction
  .createServerAction()
  .input(object({ documentId: string() }))
  .handler(async ({ ctx, input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.documentId)
      if (!doc) {
        return { message: 'Document not found.', error: true }
      }
      if (doc.userId !== ctx.user.id) {
        return { message: 'You are not authorized to restore this document.', error: true }
      }

      const recursiveRestoreArchive = async (id: string) => {
        const childrens = await getUserDocumentsByParentDocumentIdUseCase({
          userId: ctx.user.id as string,
          parentDocumentId: id,
        })

        for (const child of childrens) {
          await updateDocumentUseCase({
            id: child.id,
            isArchived: false,
          })
          await recursiveRestoreArchive(child.id)
        }
      }

      const options: { isArchived: boolean; parentDocumentId?: string | null } = {
        isArchived: false,
      }

      if (doc.parentDocumentId) {
        const parentDoc = await getDocumentByIdUseCase(doc.parentDocumentId)
        if (parentDoc?.isArchived) {
          options.parentDocumentId = null
        }
      }

      await updateDocumentUseCase({
        id: input.documentId,
        ...options,
      })

      await recursiveRestoreArchive(input.documentId)

      return { success: true, message: 'Document restored successfully!', error: null }
    } catch (error) {
      return { message: 'Failed to restore document.', error }
    }
  })

export const updateDocumentAction = authenticatedAction
  .createServerAction()
  .input(documentSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.id as string)
      if (!doc) {
        return { message: 'Document not found.', error: true }
      }
      if (doc.userId !== ctx.user.id) {
        return { message: 'You are not authorized to update this document.', error: true }
      }

      const updatedDoc = await updateDocumentUseCase({
        id: input.id as string,
        ...input,
      })

      return {
        success: true,
        message: 'Document updated successfully!',
        data: updatedDoc,
        error: null,
      }
    } catch (error) {
      return { message: 'Failed to update document.', error }
    }
  })

export const deleteDocumentAction = authenticatedAction
  .createServerAction()
  .input(object({ documentId: string() }))
  .handler(async ({ ctx, input }) => {
    try {
      const doc = await getDocumentByIdUseCase(input.documentId)
      if (!doc) {
        return { message: 'Document not found.', error: true }
      }
      if (doc.userId !== ctx.user.id) {
        return { message: 'You are not authorized to delete this document.', error: true }
      }

      const childrens = await getUserDocumentsByParentDocumentIdUseCase({
        userId: ctx.user.id as string,
        parentDocumentId: input.documentId,
      })

      for (const child of childrens) {
        await updateDocumentUseCase({
          id: child.id,
          parentDocumentId: null,
        })
      }

      await deleteDocumentUseCase({
        id: input.documentId,
      })

      return { success: true, message: 'Document deleted successfully!', error: null }
    } catch (error) {
      return { message: 'Failed to delete document.', error }
    }
  })
