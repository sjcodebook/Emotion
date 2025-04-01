import { Document } from '@prisma/client'

import db from '@/lib/prisma'

export async function getDocumentById(documentId: string) {
  const document = await db.document.findUnique({
    where: {
      id: documentId,
    },
  })

  return document
}

export interface GetUserDocumentsByParentDocumentIdInterface
  extends Omit<Partial<Document>, 'userId' | 'parentDocumentId'> {
  userId: string
  parentDocumentId: string | null
}
export async function getUserDocumentsByParentDocumentId({
  userId,
  parentDocumentId = null,
  ...rest
}: GetUserDocumentsByParentDocumentIdInterface) {
  const documents = await db.document.findMany({
    where: {
      userId,
      parentDocumentId,
      ...rest,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return documents
}

export async function getDocumentsByUserId(userId: string) {
  const documents = await db.document.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return documents
}

export interface CreateDocumentInterface
  extends Omit<Partial<Document>, 'userId' | 'parentDocumentId' | 'title'> {
  title: string
  userId: string
  parentDocumentId?: string | null
}
export async function createDocument({
  title,
  userId,
  parentDocumentId = null,
  ...rest
}: CreateDocumentInterface) {
  const newDoc = await db.document.create({
    data: {
      title,
      userId,
      parentDocumentId,
      ...rest,
    },
  })

  return newDoc
}
