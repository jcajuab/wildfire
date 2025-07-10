import { describe, expect, it } from "bun:test"
import { PingServiceImpl } from "./ping.service.impl"

describe("PingServiceImpl", () => {
  it("should return 'pong' when ping is called", () => {
    const pingService = new PingServiceImpl()

    expect(pingService.ping()).toBe("pong")
  })
})
