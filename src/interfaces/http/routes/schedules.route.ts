import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const schedulesRouter = new Hono();
const schedulesTags = ["Schedules"];

schedulesRouter.get(
  "/",
  describeRoute({
    description: "Schedules routes placeholder",
    tags: schedulesTags,
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
  (c) => notImplemented(c, "Schedules routes: to be implemented"),
);
