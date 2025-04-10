import { boolean, date, object, string } from 'zod'

export const documentSchema = object({
  id: string().optional(),
  title: string().optional(),
  content: string().nullable().optional(),
  parentDocumentId: string().nullable().optional(),
  coverImage: string().nullable().optional(),
  icon: string().nullable().optional(),
  isPublished: boolean().optional(),
  createdAt: date().optional(),
  updatedAt: date().optional(),
})
