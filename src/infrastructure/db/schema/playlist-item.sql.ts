import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { content } from "./content.sql";
import { playlists } from "./playlist.sql";

export const playlistItems = mysqlTable("playlist_items", {
  id: int("id").primaryKey().autoincrement(),
  playlistId: int("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  contentId: varchar("content_id", { length: 36 })
    .notNull()
    .references(() => content.id, { onDelete: "restrict" }),
});
