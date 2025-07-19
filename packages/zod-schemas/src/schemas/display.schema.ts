import { z } from 'zod'

export const SelectDisplaySchema = z.object({
  id: z.uuidv7('ID must be a valid UUIDv7'),
  name: z
    .string('Name must be a string')
    .trim()
    .nonempty('Name must not be empty')
    .refine((val) => !val.includes(' '), {
      error: 'Name must not contain spaces',
    }),
  slug: z.string('Slug must be a string').lowercase('Slug must be lowercase'),
  description: z
    .string('Description must be a string')
    .trim()
    .nonempty('Description must not be empty')
    .nullish(),
})

export const InsertDisplaySchema = SelectDisplaySchema.omit({
  id: true,
  slug: true,
})

export const UpdateDisplaySchema = InsertDisplaySchema.partial().refine(
  (val) => Object.keys(val).length > 0,
  {
    error: 'Provide at least one field to update',
  },
)

export type SelectDisplay = z.infer<typeof SelectDisplaySchema>
export type InsertDisplay = z.infer<typeof InsertDisplaySchema>
export type UpdateDisplaySchema = z.infer<typeof UpdateDisplaySchema>
