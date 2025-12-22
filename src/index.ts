import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import {
  describeRoute,
  openAPIRouteHandler,
  resolver,
  validator,
} from "hono-openapi";
import { z } from "zod";
import packageJSON from "../package.json" with { type: "json" };

const app = new Hono();
const port = 3000;

const responseSchema = z.string();
const querySchema = z.object({
  name: z.string().optional(),
});

app.get(
  "/",
  describeRoute({
    description: "Say hello to the user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "text/plain": {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  validator("query", querySchema),
  (c) => {
    const query = c.req.valid("query");
    return c.text(`Hello ${query?.name ?? "Hono"}!`);
  },
);

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Hono API",
        description: "Greeting API",
        version: packageJSON.version,
      },
      servers: [
        { url: `http://localhost:${port}`, description: "Local Server" },
      ],
    },
  }),
);

app.get("/docs", Scalar({ url: "/openapi.json" }));

export default {
  port,
  fetch: app.fetch,
};
