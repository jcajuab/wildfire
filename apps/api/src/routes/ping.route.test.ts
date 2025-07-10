import { describe, expect, it } from "bun:test"
import { testClient } from "hono/testing"
import ping from "./ping.route"

describe("Ping Route", () => {
  const client = testClient(ping)

  it("should return 'pong' when GET / is called", async () => {
    const res = await client.index.$get()

    expect(res.status).toBe(200)
    expect(await res.text()).toEqual("pong")
  })
})
