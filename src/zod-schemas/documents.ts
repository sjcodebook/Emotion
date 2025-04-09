import { boolean, object, string } from 'zod'

export const documentSchema = object({
  id: string().optional(),
  parentDocumentId: string().nullable().optional(),
  title: string().optional(),
  content: string().nullable().optional(),
  coverImage: string().nullable().optional(),
  icon: string().nullable().optional(),
  isPublished: boolean().optional(),
})
