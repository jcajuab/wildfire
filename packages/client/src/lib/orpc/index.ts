import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { client } from '@/lib/orpc/client'

export const orpc = createTanstackQueryUtils(client)
export type Orpc = typeof orpc
