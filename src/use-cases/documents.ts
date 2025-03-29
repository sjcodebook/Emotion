import { createDocument } from '@/data-access/documents'

export async function createDocumentUseCase({ title, userId }: { title: string; userId: string }) {
  const newDoc = await createDocument({
    title,
    userId,
  })
  return newDoc
}
