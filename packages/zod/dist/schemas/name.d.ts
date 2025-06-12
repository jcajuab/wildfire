import { z } from "zod/v4"
export declare const nameSchema: z.ZodObject<
  {
    name: z.ZodString
  },
  z.core.$strip
>
export type Name = z.infer<typeof nameSchema>
