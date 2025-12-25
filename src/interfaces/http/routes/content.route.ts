import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const contentRouter = new Hono();

contentRouter.get(
  "/",
  describeRoute({
    description: "Content routes placeholder",
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
  (c) => notImplemented(c, "Content routes: to be implemented"),
);
