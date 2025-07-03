import { serve } from 'bun'
import { app } from '@/app'

const port = Number(process.env.PORT ?? 3000)

try {
  serve({
    fetch: app.fetch,
    port,
  })

  console.log(`Listening on http://localhost:${port}`)
} catch (error) {
  console.error('Failed to start server', error)
}
