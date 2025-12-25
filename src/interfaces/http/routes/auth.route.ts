import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const authRouter = new Hono();

authRouter.get(
  "/",
  describeRoute({
    description: "Auth routes placeholder",
    responses: {
      501: {
        description: "Not implemented",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
    },
  }),
  (c) => notImplemented(c, "Auth routes: to be implemented"),
);
