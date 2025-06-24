import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema/index.ts",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    database: Bun.env.MYSQL_DATABASE,
    user: Bun.env.MYSQL_USER,
    password: Bun.env.MYSQL_PASSWORD,
  },
});
