import { Hono } from "hono"
import { appRouter } from "./trpc/index.js"
import { logger } from "hono/logger"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { trpcServer } from "@hono/trpc-server"

const app = new Hono()

app.use(logger())

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
)

app.use("*", serveStatic({ root: "./dist/static" }))
app.use("/favicon.ico", serveStatic({ path: "./dist/static/favicon.ico" }))

// SPA fallback
app.get("*", serveStatic({ path: "./dist/static/index.html" }))

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  ({ port }) => {
    console.log(`Server is running on http://localhost:${port}`)
  },
)
