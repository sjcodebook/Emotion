import { object, string } from 'zod'

export const documentSchema = object({
  id: string().optional(),
  parentDocumentId: string().nullable().optional(),
  title: string().optional(),
  content: string().optional(),
  coverImage: string().optional(),
  icon: string().nullable().optional(),
  isPublished: string().optional(),
})
