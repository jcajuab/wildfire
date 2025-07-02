import { oc } from '@orpc/contract'
import { pingOutputSchema } from '../schemas/ping.schemas'

export const pingContract = oc
  .route({ method: 'GET', path: '/ping' })
  .output(pingOutputSchema)
