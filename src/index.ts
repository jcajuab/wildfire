import { env } from "#/env";
import { app } from "#/interfaces/http";

export default {
  port: env.PORT,
  fetch: app.fetch,
};
