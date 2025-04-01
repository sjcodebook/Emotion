import {
  getDocumentsByUserId,
  createDocument,
  getUserDocumentsByParentDocumentId,
} from '@/data-access/documents'

import type { GetUserDocumentsByParentDocumentIdInterface } from '@/data-access/documents'

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

export async function getDocumentsByUserIdUseCase(userId: string) {
  const docs = await getDocumentsByUserId(userId)
  return docs
}

export async function createDocumentUseCase({ title, userId }: { title: string; userId: string }) {
  const newDoc = await createDocument({
    title,
    userId,
  })
  return newDoc
}
