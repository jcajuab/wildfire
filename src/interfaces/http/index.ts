import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { env } from "#/env";
import { authRouter } from "#/interfaces/http/routes/auth.route";
import { contentRouter } from "#/interfaces/http/routes/content.route";
import { devicesRouter } from "#/interfaces/http/routes/devices.route";
import { healthRouter } from "#/interfaces/http/routes/health.route";
import { playlistsRouter } from "#/interfaces/http/routes/playlists.route";
import { schedulesRouter } from "#/interfaces/http/routes/schedules.route";
import packageJSON from "#/package.json" with { type: "json" };

export const app = new Hono();

app.route("/", healthRouter);
app.route("/auth", authRouter);
app.route("/content", contentRouter);
app.route("/playlists", playlistsRouter);
app.route("/schedules", schedulesRouter);
app.route("/devices", devicesRouter);

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: `${packageJSON.name.toUpperCase()} API Reference`,
        description: packageJSON.description,
        version: packageJSON.version,
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
    },
  }),
);

app.get("/docs", Scalar({ url: "/openapi.json" }));
