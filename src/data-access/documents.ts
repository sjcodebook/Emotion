import db from '@/lib/prisma'

export async function getDocumentById(documentId: string) {
  const document = await db.document.findUnique({
    where: {
      id: documentId,
    },
  })

  return document
}

export async function getDocumentsByUserId(userId: string) {
  const documents = await db.document.findMany({
    where: {
      userId,
    },
  })
  return documents
}

export async function createDocument({ title, userId }: { title: string; userId: string }) {
  const newDoc = await db.document.create({
    data: {
      title,
      userId,
    },
  })

  return newDoc
}
