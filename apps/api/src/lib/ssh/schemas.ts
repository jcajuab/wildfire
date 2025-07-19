import { z } from 'zod'

export const ClientIdSchema = z
  .string('Client ID must be a string')
  .trim()
  .nonempty('Client ID must not be empty')
  .max(128, 'Client ID must be at most 128 characters long')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Client ID must contain only letters, numbers, hyphens, or underscores',
  )
