import { defineConfig } from "drizzle-kit";
import { env } from "#/env";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/infrastructure/db/schema",
  casing: "snake_case",
  dbCredentials: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    database: env.MYSQL_DATABASE,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    url: env.DATABASE_URL,
  },
});
