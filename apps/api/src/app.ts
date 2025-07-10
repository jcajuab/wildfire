import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { logger } from "hono/logger"
import { trimTrailingSlash } from "hono/trailing-slash"
import ping from "./routes/ping.route"

const app = new Hono().use(trimTrailingSlash()).use(logger())
const routes = app.basePath("/api").route("/ping", ping)

// SPA
app.use("*", serveStatic({ root: "./static" }))
app.use("*", serveStatic({ root: "./static", path: "index.html" }))

export type AppType = typeof routes
export default app
