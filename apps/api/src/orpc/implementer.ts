import { implement } from '@orpc/server'
import { contract } from '@wildfire/orpc-contract'

type ORPCServerContext = {
  request: Request
}

export const os = implement(contract).$context<ORPCServerContext>()
