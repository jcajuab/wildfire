import { Hono } from "hono"
import { PingController } from "../controllers/ping.controller"
import { PingServiceImpl } from "../services/ping.service.impl"

const pingService = new PingServiceImpl()
const pingController = new PingController(pingService)

// The method chaining is intentional. See: https://hono.dev/docs/helpers/testing#testclient
// The spread syntax is also intentional. See: https://hono.dev/docs/helpers/factory#factory-createhandlers
const app = new Hono().get("/", ...pingController.handle())

export default app
