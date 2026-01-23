import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const devicesRouter = new Hono();
const devicesTags = ["Devices"];

devicesRouter.get(
  "/",
  describeRoute({
    description: "Devices routes placeholder",
    tags: devicesTags,
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
