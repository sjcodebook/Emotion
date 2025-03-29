import { getDocumentsByUserId, createDocument } from '@/data-access/documents'

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
