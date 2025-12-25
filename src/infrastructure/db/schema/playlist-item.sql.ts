import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { contents } from "./content.sql";
import { playlists } from "./playlist.sql";

export const playlistItems = mysqlTable("playlist_items", {
  id: int("id").primaryKey().autoincrement(),
  playlistId: int("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  contentId: int("content_id")
    .notNull()
    .references(() => contents.id, { onDelete: "restrict" }),
});
