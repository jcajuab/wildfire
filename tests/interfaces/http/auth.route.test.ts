import { describe, expect, test } from "bun:test";
import path from "path";
import { setTestEnv } from "../../helpers/env";

const fixturePath = path.join(
  import.meta.dir,
  "../../fixtures/example_htshadow",
);

describe("Auth routes", () => {
  test("POST /auth/login returns token for valid credentials", async () => {
    setTestEnv({
      HTSHADOW_PATH: fixturePath,
      JWT_SECRET: "test-secret",
    });

    const { app } = await import("#/interfaces/http");

    const response = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test1", password: "xc4uuicX" }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body).toEqual({
      token: expect.any(String),
      tokenType: "Bearer",
      expiresIn: 60 * 60,
      user: { username: "test1" },
    });
  });

  test("POST /auth/login returns 401 for invalid credentials", async () => {
    setTestEnv({
      HTSHADOW_PATH: fixturePath,
      JWT_SECRET: "test-secret",
    });

    const { app } = await import("#/interfaces/http");

    const response = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test1", password: "wrong" }),
    });

    expect(response.status).toBe(401);
    const body = await response.json();

    expect(body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      },
    });
  });

  test("GET /auth/me returns refreshed token when authorized", async () => {
    setTestEnv({
      HTSHADOW_PATH: fixturePath,
      JWT_SECRET: "test-secret",
    });

    const { app } = await import("#/interfaces/http");

    const loginResponse = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test1", password: "xc4uuicX" }),
    });

    const loginBody = await loginResponse.json();
    const token = loginBody.token as string;

    const response = await app.request("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body).toEqual({
      token: expect.any(String),
      tokenType: "Bearer",
      expiresIn: 60 * 60,
      user: { username: "test1" },
    });
  });

  test("GET /auth/me returns 401 without token", async () => {
    setTestEnv({
      HTSHADOW_PATH: fixturePath,
      JWT_SECRET: "test-secret",
    });

    const { app } = await import("#/interfaces/http");

    const response = await app.request("/auth/me");

    expect(response.status).toBe(401);
  });

  test("POST /auth/logout returns 204", async () => {
    setTestEnv({
      HTSHADOW_PATH: fixturePath,
      JWT_SECRET: "test-secret",
    });

    const { app } = await import("#/interfaces/http");

    const loginResponse = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test1", password: "xc4uuicX" }),
    });

    const { token } = await loginResponse.json();

    const response = await app.request("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(204);
  });
});
