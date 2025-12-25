import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const devicesRouter = new Hono();

devicesRouter.get(
  "/",
  describeRoute({
    description: "Devices routes placeholder",
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
  (c) => notImplemented(c, "Devices routes: to be implemented"),
);
