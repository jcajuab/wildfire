import { z } from "zod/v4"
export const nameSchema = z.object({
  name: z
    .string("Name should be a string")
    .trim()
    .nonempty("Name should not be empty"),
})
