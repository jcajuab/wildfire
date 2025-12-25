import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { devices } from "./device.sql";
import { playlists } from "./playlist.sql";

export const schedules = mysqlTable("schedules", {
  id: int("id").primaryKey().autoincrement(),
  playlistId: int("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "restrict" }),
  deviceId: int("device_id")
    .notNull()
    .references(() => devices.id, { onDelete: "cascade" }),
});
