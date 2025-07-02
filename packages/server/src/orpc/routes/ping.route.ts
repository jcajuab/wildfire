import { publicProcedure } from '@/orpc'

export const ping = publicProcedure.ping.handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return { message: 'pong' }
})
