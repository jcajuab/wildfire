import { z } from 'zod'

export const PaginationSchema = z.object({
  limit: z.int().min(1).max(100).default(10),
  offset: z.int().min(0).default(0),
})

export type Pagination = z.infer<typeof PaginationSchema>
