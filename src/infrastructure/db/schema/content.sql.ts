import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const contents = mysqlTable("contents", {
  id: int("id").primaryKey().autoincrement(),
});
