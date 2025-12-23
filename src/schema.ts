import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int(),
});
