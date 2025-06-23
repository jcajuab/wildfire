import { z } from "zod/v4";

export const pingOutputSchema = z.object({ message: z.string() });
export type PingOutput = z.infer<typeof pingOutputSchema>;
