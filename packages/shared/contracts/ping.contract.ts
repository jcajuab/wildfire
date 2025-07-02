import { oc } from '@orpc/contract'
import { pingOutputSchema } from '../schemas/ping.schema'

export const pingContract = oc
  .route({ method: 'GET', path: '/ping' })
  .output(pingOutputSchema)
