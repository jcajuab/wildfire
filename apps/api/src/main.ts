import { serve } from "bun"
import ping from "./app"

const port = Number(process.env.PORT ?? 3000)

try {
  serve({
    fetch: ping.fetch,
    port,
  })

  console.log(`Listening on http://localhost:${port}`)
} catch (error) {
  console.error("Failed to start server", error)
}
