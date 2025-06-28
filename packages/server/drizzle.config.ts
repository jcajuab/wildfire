import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/db/schema/index.ts",
  dbCredentials: {
    host: Bun.env.MYSQL_HOST,
    port: Number(Bun.env.MYSQL_PORT ?? 3306),
    database: Bun.env.MYSQL_DATABASE,
    user: Bun.env.MYSQL_USER,
    password: Bun.env.MYSQL_PASSWORD,
  },
});
