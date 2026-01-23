import { type ContentRecord } from "#/application/ports/content";
import {
  type PlaylistItemRecord,
  type PlaylistRecord,
} from "#/application/ports/playlists";

export const toPlaylistView = (
  playlist: PlaylistRecord,
  creatorName: string | null,
) => ({
  id: playlist.id,
  name: playlist.name,
  description: playlist.description,
  createdAt: playlist.createdAt,
  updatedAt: playlist.updatedAt,
  createdBy: {
    id: playlist.createdById,
    name: creatorName,
  },
});

export const toPlaylistItemView = (
  item: PlaylistItemRecord,
  content: ContentRecord,
) => ({
  id: item.id,
  sequence: item.sequence,
  duration: item.duration,
  content: {
    id: content.id,
    title: content.title,
    type: content.type,
    checksum: content.checksum,
  },
});
