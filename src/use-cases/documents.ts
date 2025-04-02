import {
  getDocumentById,
  getDocumentsByUserId,
  createDocument,
  getUserDocumentsByParentDocumentId,
  updateDocument,
  deleteDocument,
  getUserArchivedDocuments,
} from '@/data-access/documents'

import type {
  GetUserDocumentsByParentDocumentIdInterface,
  CreateDocumentInterface,
  UpdateDocumentInterface,
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

export async function getUserArchivedDocumentsUseCase(userId: string) {
  const doc = await getUserArchivedDocuments(userId)
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

export async function updateDocumentUseCase({ id, ...data }: UpdateDocumentInterface) {
  const updatedDoc = await updateDocument({
    id,
    ...data,
  })

  return updatedDoc
}

export async function deleteDocumentUseCase({ id }: { id: string }) {
  await deleteDocument({
    id,
  })

  return null
}
