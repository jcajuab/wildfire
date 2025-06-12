import { initTRPC } from "@trpc/server"
import { nameSchema } from "@wildfire/zod"

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  hello: publicProcedure.input(nameSchema).query(({ input }) => {
    return { greeting: `Hello, ${input.name}` }
  }),
})

export type AppRouter = typeof appRouter
