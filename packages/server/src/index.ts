import { app } from '@/app'

const port = Number(Bun.env.PORT ?? 3000)

try {
  Bun.serve({
    fetch: app.fetch,
    port,
  })

  console.log(`Listening on http://localhost:${port}`)
} catch (error) {
  console.error('Failed to start server', error)
}
