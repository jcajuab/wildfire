export interface PlaylistItem {
  id: number
  name: string
  duration: string
}

export type PlaylistStatus = 'draft' | 'ready'

export interface CreatedPlaylist {
  id: number
  name: string
  description: string
  author: string
  items: PlaylistItem[]
  createdAt: Date
  status: PlaylistStatus
}

export interface DragData {
  [key: string]: unknown
  type: string
  index?: number
  item?: PlaylistItem
  content?: PlaylistItem
}
