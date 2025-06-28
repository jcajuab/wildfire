import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import * as schema from "@/lib/db/schema";

const client = await createConnection({
  database: Bun.env.MYSQL_DATABASE,
  user: Bun.env.MYSQL_USER,
  password: Bun.env.MYSQL_PASSWORD,
});

export const db = drizzle({
  client,
  casing: "snake_case",
  mode: "default",
  schema,
});
