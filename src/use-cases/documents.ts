import {
  getDocumentById,
  getDocumentsByUserId,
  createDocument,
  getUserDocumentsByParentDocumentId,
  updateDocumentArchiveStatus,
} from '@/data-access/documents'

import type {
  GetUserDocumentsByParentDocumentIdInterface,
  CreateDocumentInterface,
} from '@/data-access/documents'

export async function getUserDocumentsByParentDocumentIdUseCase({
  userId,
  parentDocumentId,
  ...rest
}: GetUserDocumentsByParentDocumentIdInterface) {
  const docs = await getUserDocumentsByParentDocumentId({
    userId,
    parentDocumentId,
    ...rest,
  })
  return docs
}

export async function getDocumentByIdUseCase(documentId: string) {
  const doc = await getDocumentById(documentId)
  return doc
}

export async function getDocumentsByUserIdUseCase(userId: string) {
  const docs = await getDocumentsByUserId(userId)
  return docs
}

export async function createDocumentUseCase({
  title,
  userId,
  parentDocumentId,
}: CreateDocumentInterface) {
  const newDoc = await createDocument({
    title,
    userId,
    parentDocumentId,
  })
  return newDoc
}

export async function updateDocumentArchiveStatusUseCase({
  documentId,
  isArchived,
}: {
  documentId: string
  isArchived: boolean
}) {
  const updatedDoc = await updateDocumentArchiveStatus({
    documentId,
    isArchived,
  })

  return updatedDoc
}
