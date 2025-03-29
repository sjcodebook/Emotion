import db from '@/lib/prisma'

export async function getDocumentById(documentId: string) {
  const document = await db.document.findUnique({
    where: {
      id: documentId,
    },
  })

  return document
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
