import { object, string } from 'zod'

export const documentSchema = object({
  title: string().min(1, { message: 'Title is required' }),
})
