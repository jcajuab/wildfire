import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const playlists = mysqlTable("playlists", {
  id: int("id").primaryKey().autoincrement(),
});
