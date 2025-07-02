import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { contract } from '@wildfire/shared/contracts'

// TODO https://orpc.unnoq.com/docs/plugins/client-retry#client-retry-plugin
const link = new OpenAPILink(contract, {
  url: `${window.location.origin}/api`,
})

type Client = JsonifiedClient<ContractRouterClient<typeof contract>>

export const client = createORPCClient<Client>(link)
