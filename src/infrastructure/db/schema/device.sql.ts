import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const devices = mysqlTable("devices", {
  id: int("id").primaryKey().autoincrement(),
});
