import { createORPCClient } from '@orpc/client'
import { ClientRetryPlugin, type ClientRetryPluginContext } from '@orpc/client/plugins'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { contract } from '@wildfire/orpc-contract'

interface ORPCClientContext extends ClientRetryPluginContext {}

const link = new OpenAPILink<ORPCClientContext>(contract, {
  url: `${window.location.origin}/api`,
  plugins: [new ClientRetryPlugin({})],
})

// biome-ignore format: looks worse formatted lol
const client = createORPCClient<JsonifiedClient<ContractRouterClient<typeof contract, ORPCClientContext>>>(link)

export const orpc = createTanstackQueryUtils(client)
export type ORPC = typeof orpc
