import { describe, expect, test } from "bun:test";
import { setTestEnv } from "../../helpers/env";

const bootstrap = async () => {
  setTestEnv({ JWT_SECRET: "test-secret" });
  const { app } = await import("#/interfaces/http");
  return app;
};

describe("Observability middleware", () => {
  test("adds X-Request-Id header", async () => {
    const app = await bootstrap();

    const response = await app.request("/");

    const requestId = response.headers.get("X-Request-Id");
    expect(requestId).not.toBeNull();
    expect(requestId?.length).toBeGreaterThan(0);
  });
});
