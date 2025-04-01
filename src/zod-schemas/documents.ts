import { object, string } from 'zod'

export const documentSchema = object({
  parentDocumentId: string().nullable().optional(),
  title: string().min(1, { message: 'Title is required' }),
})
