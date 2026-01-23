import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  errorResponseSchema,
  notImplemented,
} from "#/interfaces/http/responses";

export const playlistsRouter = new Hono();
const playlistsTags = ["Playlists"];

playlistsRouter.get(
  "/",
  describeRoute({
    description: "Playlists routes placeholder",
    tags: playlistsTags,
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
  (c) => notImplemented(c, "Playlists routes: to be implemented"),
);
