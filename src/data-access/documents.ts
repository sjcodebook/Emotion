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

export async function getUserArchivedDocuments(userId: string) {
  const documents = await db.document.findMany({
    where: {
      userId,
      isArchived: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return documents
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

export interface UpdateDocumentInterface extends Omit<Partial<Document>, 'id'> {
  id: string
}
export async function updateDocument({ id, ...data }: UpdateDocumentInterface) {
  const updatedDoc = await db.document.update({
    where: {
      id,
    },
    data,
  })

  return updatedDoc
}

export async function deleteDocument({ id }: { id: string }) {
  await db.document.delete({
    where: {
      id,
    },
  })

  return null
}
