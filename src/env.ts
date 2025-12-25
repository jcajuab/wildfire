import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),

    // Ensures required database environment variables are present
    MYSQL_ROOT_PASSWORD: z.string(),
    MYSQL_HOST: z.string(),
    MYSQL_PORT: z.coerce.number().default(3306),
    MYSQL_DATABASE: z.string(),
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
