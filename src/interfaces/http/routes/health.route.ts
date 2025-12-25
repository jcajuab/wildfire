import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";

export const healthRouter = new Hono();

const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

healthRouter.get(
  "/",
  describeRoute({
    description: "Health check",
    responses: {
      200: {
        description: "Service healthy",
        content: {
          "application/json": {
            schema: resolver(healthResponseSchema),
          },
        },
      },
    },
  }),
  (c) => c.json({ status: "ok" }),
);
