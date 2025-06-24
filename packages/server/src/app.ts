import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { trimTrailingSlash } from "hono/trailing-slash";
import { handler } from "@/orpc/handler";

export const app = new Hono()
  .use(trimTrailingSlash())
  .use("/api/*", async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: "/api",
      context: { header: c.req.raw.headers },
    });

    if (matched) {
      return c.newResponse(response.body, response);
    }

    await next();
  })
  .use("*", serveStatic({ root: "./static" }))
  .use("*", serveStatic({ root: "./static", path: "index.html" }));
