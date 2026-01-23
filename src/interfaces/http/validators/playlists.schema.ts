import { z } from "zod";

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.object({
    id: z.string(),
    name: z.string().nullable(),
  }),
});

export const playlistItemSchema = z.object({
  id: z.string(),
  sequence: z.number().int(),
  duration: z.number().int(),
  content: z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["IMAGE", "VIDEO", "PDF"]),
    checksum: z.string(),
  }),
});

export const playlistWithItemsSchema = playlistSchema.extend({
  items: z.array(playlistItemSchema),
});

export const playlistListResponseSchema = z.object({
  items: z.array(playlistSchema),
});

export const playlistIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const playlistItemIdParamSchema = z.object({
  itemId: z.string().uuid(),
});

export const playlistItemParamSchema = playlistIdParamSchema.merge(
  playlistItemIdParamSchema,
);

export const createPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().trim().optional().nullable(),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().trim().optional().nullable(),
});

export const addPlaylistItemSchema = z.object({
  contentId: z.string().uuid(),
  sequence: z.number().int(),
  duration: z.number().int(),
});

export const updatePlaylistItemSchema = z.object({
  sequence: z.number().int().optional(),
  duration: z.number().int().optional(),
});
