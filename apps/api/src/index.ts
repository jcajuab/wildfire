import { serve } from 'bun'

import { env } from './env'
import { handler } from './handler'

const port = env.PORT

serve({
  port,
  fetch: handler,
})
