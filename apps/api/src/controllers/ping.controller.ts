import type { PingService } from "../services/ping.service"
import { factory } from "../infrastructure/hono/factory"

export class PingController {
  constructor(private readonly pingService: PingService) {}

  handle() {
    return factory.createHandlers((c) => {
      return c.text(this.pingService.ping())
    })
  }
}
