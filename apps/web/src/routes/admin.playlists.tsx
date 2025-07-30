import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { createFileRoute } from '@tanstack/react-router'
import {
  ClockIcon,
  EyeIcon,
  FileImageIcon,
  FilterIcon,
  GripVerticalIcon,
  InfoIcon,
  ListMusicIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet'
import { Textarea } from '../components/ui/textarea'

export const Route = createFileRoute('/admin/playlists')({
  component: Component,
})

// Type definitions
interface PlaylistItem {
  id: number
  name: string
  duration: string
}

interface CreatedPlaylist {
  id: number
  name: string
  description: string
  author: string
  items: PlaylistItem[]
  createdAt: Date
}

interface DragData {
  [key: string]: unknown
  type: string
  index?: number
  item?: PlaylistItem
  content?: PlaylistItem
}

interface DraggablePlaylistItemProps {
  item: PlaylistItem
  index: number
  onReorder: (fromIndex: number, toIndex: number) => void
}

interface DraggableContentItemProps {
  content: PlaylistItem
  index: number
  onReorder: (fromIndex: number, toIndex: number) => void
}

interface DropZoneProps {
  children: ReactNode
  onDropItem: (item: PlaylistItem) => void
  acceptedType: string
  dropIndicatorMessage: string
}

// Reusable Drop Zone Component
function DropZone({ children, onDropItem, acceptedType }: DropZoneProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const autoScrollCleanup = autoScrollForElements({ element })
    const dropTargetCleanup = dropTargetForElements({
      element,
      canDrop: ({ source }) => (source.data as DragData).type === acceptedType,
      onDrop: ({ source }) => {
        const sourceData = source.data as DragData
        const item = (sourceData.item || sourceData.content) as PlaylistItem
        onDropItem(item)
      },
    })

    return () => {
      autoScrollCleanup()
      dropTargetCleanup()
    }
  }, [onDropItem, acceptedType])

  return (
    <div className='min-h-[200px] rounded-lg transition-all' ref={elementRef}>
      {children}
    </div>
  )
}

// Draggable Playlist Item Component
function DraggablePlaylistItem({
  item,
  index,
  onReorder,
}: DraggablePlaylistItemProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDropTarget, setIsDropTarget] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const cleanupDraggable = draggable({
      element,
      getInitialData: () => ({ type: 'playlist-item', index, item }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDropTarget = dropTargetForElements({
      element,
      canDrop: ({ source }) =>
        (source.data as DragData).type === 'playlist-item',
      onDragEnter: () => setIsDropTarget(true),
      onDragLeave: () => setIsDropTarget(false),
      onDrop: ({ source }) => {
        setIsDropTarget(false)
        const sourceIndex = (source.data as DragData).index as number
        if (sourceIndex !== index) {
          onReorder(sourceIndex, index)
        }
      },
    })

    return () => {
      cleanupDraggable()
      cleanupDropTarget()
    }
  }, [item, index, onReorder])

  return (
    <div
      className={`flex cursor-grab items-center justify-between rounded-lg bg-gray-50 p-3 transition-all active:cursor-grabbing ${
        isDragging ? 'scale-95 opacity-50' : ''
      } ${isDropTarget ? 'bg-blue-50 ring-2 ring-blue-500' : ''}`}
      ref={elementRef}
    >
      <div className='flex items-center space-x-3'>
        <div className='text-sm font-medium'>{item.name}</div>
        <div className='text-muted-foreground flex items-center text-xs'>
          <ClockIcon className='mr-1 h-3 w-3' />
          {item.duration} min
        </div>
      </div>
      <GripVerticalIcon className='h-4 w-4 text-gray-400' />
    </div>
  )
}

// Draggable Content Library Item
function DraggableContentItem({
  content,
  index,
  onReorder,
}: DraggableContentItemProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDropTarget, setIsDropTarget] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const cleanupDraggable = draggable({
      element,
      getInitialData: () => ({ type: 'content-item', index, content }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDropTarget = dropTargetForElements({
      element,
      canDrop: ({ source }) => {
        const sourceData = source.data as DragData
        return (
          sourceData.type === 'content-item' ||
          sourceData.type === 'playlist-item'
        )
      },
      onDragEnter: ({ source }) => {
        const sourceData = source.data as DragData
        if (sourceData.type === 'content-item') {
          setIsDropTarget(true)
        }
      },
      onDragLeave: () => setIsDropTarget(false),
      onDrop: ({ source }) => {
        setIsDropTarget(false)
        const sourceData = source.data as DragData

        if (sourceData.type === 'content-item') {
          const sourceIndex = sourceData.index as number
          if (sourceIndex !== index) {
            onReorder(sourceIndex, index)
          }
        }
      },
    })

    return () => {
      cleanupDraggable()
      cleanupDropTarget()
    }
  }, [content, index, onReorder])

  return (
    <div
      className={`flex cursor-grab items-center justify-between rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100 active:cursor-grabbing ${
        isDragging ? 'scale-95 opacity-50' : ''
      } ${isDropTarget ? 'bg-blue-50 ring-2 ring-blue-500' : ''}`}
      ref={elementRef}
    >
      <div className='flex items-center space-x-3'>
        <div className='text-sm font-medium'>{content.name}</div>
        <div className='text-muted-foreground flex items-center text-xs'>
          <ClockIcon className='mr-1 h-3 w-3' />
          {content.duration} min
        </div>
      </div>
      <GripVerticalIcon className='h-4 w-4 text-gray-400' />
    </div>
  )
}

function Component() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [contentSearchQuery, setContentSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')

  // State for editing and deleting
  const [editingPlaylist, setEditingPlaylist] =
    useState<CreatedPlaylist | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [playlistToDeleteId, setPlaylistToDeleteId] = useState<number | null>(
    null,
  )

  const initialPlaylist: PlaylistItem[] = []
  const initialContent = [
    { id: 1, name: 'AkiBlog #29', duration: '2:15' },
    { id: 2, name: 'AkiBlog #28', duration: '1:45' },
    { id: 3, name: 'AkiBlog #27', duration: '3:20' },
    { id: 4, name: 'AkiBlog #26', duration: '0:58' },
    { id: 5, name: 'AkiBlog #25', duration: '2:33' },
    { id: 101, name: 'AkiBlog #30', duration: '0:45' },
    { id: 102, name: 'AkiBlog #31', duration: '0:30' },
    { id: 103, name: 'AkiBlog #32', duration: '1:00' },
  ]

  const [playlistItems, setPlaylistItems] =
    useState<PlaylistItem[]>(initialPlaylist)
  const [contentLibrary, setContentLibrary] =
    useState<PlaylistItem[]>(initialContent)
  const [createdPlaylists, setCreatedPlaylists] = useState<CreatedPlaylist[]>(
    [],
  )

  const parseDuration = (duration: string): number => {
    const parts = duration.split(':')
    const minutes = parseInt(parts[0] || '0', 10)
    const seconds = parseInt(parts[1] || '0', 10)
    return (
      (Number.isNaN(minutes) ? 0 : minutes) * 60 +
      (Number.isNaN(seconds) ? 0 : seconds)
    )
  }

  const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const filterContentLibrary = (
    items: PlaylistItem[],
    query: string,
  ): PlaylistItem[] => {
    if (!query.trim()) return items
    try {
      const hasRegexChars = /[.*+?^${}()|[\]\\]/.test(query)
      const regex = hasRegexChars ? new RegExp(query, 'i') : null
      const lowerQuery = query.toLowerCase()
      return items.filter((item) =>
        regex
          ? regex.test(item.name)
          : item.name.toLowerCase().includes(lowerQuery),
      )
    } catch {
      const lowerQuery = query.toLowerCase()
      return items.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery),
      )
    }
  }

  const filteredContentLibrary = filterContentLibrary(
    contentLibrary,
    contentSearchQuery,
  )

  const closeAndResetModal = () => {
    setEditingPlaylist(null)
    setPlaylistName('')
    setPlaylistDescription('')
    setPlaylistItems([])
    setContentLibrary(initialContent)
    setIsCreateModalOpen(false)
  }

  const handleOpenCreateModal = () => {
    setEditingPlaylist(null)
    setPlaylistName('')
    setPlaylistDescription('')
    setPlaylistItems([])
    setContentLibrary(initialContent)
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (playlist: CreatedPlaylist) => {
    setEditingPlaylist(playlist)
    setPlaylistName(playlist.name)
    setPlaylistDescription(playlist.description)
    setPlaylistItems(playlist.items)
    const playlistItemIds = new Set(playlist.items.map((item) => item.id))
    setContentLibrary(
      initialContent.filter((item) => !playlistItemIds.has(item.id)),
    )
    setIsCreateModalOpen(true)
  }

  const handleSavePlaylist = () => {
    if (!playlistName.trim()) return

    if (editingPlaylist) {
      const updatedPlaylist = {
        ...editingPlaylist,
        name: playlistName,
        description: playlistDescription || 'No description provided.',
        items: [...playlistItems],
      }
      setCreatedPlaylists((prev) =>
        prev.map((p) => (p.id === editingPlaylist.id ? updatedPlaylist : p)),
      )
    } else {
      const newPlaylist: CreatedPlaylist = {
        id: Date.now(),
        name: playlistName,
        description: playlistDescription || 'No description provided.',
        author: 'Admin',
        items: [...playlistItems],
        createdAt: new Date(),
      }
      setCreatedPlaylists((prev) => [newPlaylist, ...prev])
    }
    closeAndResetModal()
  }

  const handlePromptDelete = (playlistId: number) => {
    setPlaylistToDeleteId(playlistId)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeletePlaylist = () => {
    if (playlistToDeleteId === null) return
    setCreatedPlaylists((prev) =>
      prev.filter((p) => p.id !== playlistToDeleteId),
    )
    setPlaylistToDeleteId(null)
    setIsDeleteConfirmOpen(false)
  }

  const handleReorderPlaylistItems = (fromIndex: number, toIndex: number) => {
    const newItems = [...playlistItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    if (movedItem) {
      newItems.splice(toIndex, 0, movedItem)
      setPlaylistItems(newItems)
    }
  }

  const handleReorderContentLibrary = (fromIndex: number, toIndex: number) => {
    const newItems = [...contentLibrary]
    const [movedItem] = newItems.splice(fromIndex, 1)
    if (movedItem) {
      newItems.splice(toIndex, 0, movedItem)
      setContentLibrary(newItems)
    }
  }

  const handleAddContentToPlaylist = (content: PlaylistItem) => {
    if (playlistItems.some((item) => item.id === content.id)) return
    setPlaylistItems((prev) => [...prev, content])
    setContentLibrary((prev) => prev.filter((item) => item.id !== content.id))
  }

  const handleReturnItemToLibrary = (item: PlaylistItem) => {
    if (contentLibrary.some((c) => c.id === item.id)) return
    setContentLibrary((prev) => [...prev, item])
    setPlaylistItems((prev) => prev.filter((pItem) => pItem.id !== item.id))
  }

  const calculateTotalDuration = () => {
    if (playlistItems.length === 0) return '0:00'
    const totalSeconds = playlistItems.reduce(
      (acc, item) => acc + parseDuration(item.duration),
      0,
    )
    return formatDuration(totalSeconds)
  }

  const PlaylistCard = ({
    playlist,
    onEdit,
    onDeletePrompt,
  }: {
    playlist: CreatedPlaylist
    onEdit: (playlist: CreatedPlaylist) => void
    onDeletePrompt: (id: number) => void
  }) => {
    const totalSeconds = playlist.items.reduce(
      (acc, item) => acc + parseDuration(item.duration),
      0,
    )

    return (
      <Card className='w-full max-w-md'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <CardTitle className='text-xl font-bold text-gray-900'>
                {playlist.name}
              </CardTitle>
              <p className='mt-1 text-sm text-gray-600'>by {playlist.author}</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='h-8 w-8 p-0' variant='ghost'>
                  <MoreVerticalIcon className='h-5 w-5 text-gray-500' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-1'>
                <Button
                  className='flex w-full cursor-pointer items-center justify-start p-2 text-sm'
                  onClick={() => onEdit(playlist)}
                  variant='ghost'
                >
                  <PencilIcon className='mr-2 h-4 w-4' />
                  Edit Playlist
                </Button>
                <Button
                  className='flex w-full cursor-pointer items-center justify-start p-2 text-sm'
                  onClick={() => {
                    /* No function for now */
                  }}
                  variant='ghost'
                >
                  <EyeIcon className='mr-2 h-4 w-4' />
                  Preview Playlist
                </Button>
                <div className='my-1 h-px bg-gray-200' />
                <Button
                  className='flex w-full cursor-pointer items-center justify-start p-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600'
                  onClick={() => onDeletePrompt(playlist.id)}
                  variant='ghost'
                >
                  <Trash2Icon className='mr-2 h-4 w-4' />
                  Delete Playlist
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <p className='mt-3 text-sm text-gray-600'>{playlist.description}</p>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='mb-4 flex items-center gap-4 text-sm text-gray-600'>
            <div className='flex items-center gap-1'>
              <ListMusicIcon className='h-4 w-4' />
              <span>{playlist.items.length} items</span>
            </div>
            <div className='flex items-center gap-1'>
              <ClockIcon className='h-4 w-4' />
              <span>
                {formatDuration(totalSeconds)}{' '}
                {totalSeconds < 60 ? 'sec' : 'min'}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            {playlist.items.slice(0, 4).map((item) => (
              <div className='relative' key={item.id}>
                <div className='rounded-md bg-blue-500 px-3 py-2 text-center text-xs font-medium text-white'>
                  {item.name}
                </div>
                <div className='mt-1 text-center text-xs text-gray-500'>
                  {item.duration}
                </div>
              </div>
            ))}
            {playlist.items.length > 4 && (
              <div className='col-span-2 mt-1 text-center text-xs text-gray-500'>
                +{playlist.items.length - 4} more items
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const quickFilters = ['All', 'Ready', 'Live', 'Down']

  return (
    <div className='w-full space-y-6'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-4xl font-bold'>Playlists</h1>
        <Dialog onOpenChange={setIsCreateModalOpen} open={isCreateModalOpen}>
          <DialogTrigger asChild>
            <Button
              className='cursor-pointer'
              onClick={handleOpenCreateModal}
              variant='default'
            >
              <PlusIcon className='mr-2 h-4 w-4' />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent
            className='overflow-y-auto [&>button]:hidden'
            style={{
              width: '88vw',
              height: '88vh',
              maxWidth: 'none',
              maxHeight: 'none',
            }}
          >
            <DialogHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <DialogTitle>
                    {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
                  </DialogTitle>
                  <DialogDescription>
                    Add and organize contents to form a playlist. Drag items
                    between the content library and the playlist. You can also
                    reorder items within each section.
                  </DialogDescription>
                </div>
                <div className='flex items-center gap-2'>
                  <Button onClick={closeAndResetModal} variant='outline'>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePlaylist}>
                    {editingPlaylist ? 'Save Changes' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-6 py-4'>
              <div className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <InfoIcon className='mr-2 h-5 w-5' />
                      Playlist Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <Label htmlFor='playlist-name'>Name</Label>
                      <Input
                        className='mt-1'
                        id='playlist-name'
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder='Enter playlist name'
                        value={playlistName}
                      />
                    </div>
                    <div>
                      <Label htmlFor='playlist-description'>
                        Description (Optional)
                      </Label>
                      <Textarea
                        className='mt-1 min-h-[100px]'
                        id='playlist-description'
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        placeholder='Enter playlist description'
                        value={playlistDescription}
                      />
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      <strong>Total Duration:</strong>{' '}
                      {calculateTotalDuration()}
                      {(() => {
                        const total = parseDuration(calculateTotalDuration())
                        return total < 60 ? 'sec' : 'min'
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='flex items-center'>
                        <ListMusicIcon className='mr-2 h-5 w-5' />
                        Playlist Items ({playlistItems.length})
                      </CardTitle>
                      <Button size='sm' variant='outline'>
                        Preview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DropZone
                      acceptedType='content-item'
                      dropIndicatorMessage='Drop to add to playlist'
                      onDropItem={handleAddContentToPlaylist}
                    >
                      <div className='space-y-2'>
                        {playlistItems.length === 0 ? (
                          <div className='text-muted-foreground py-8 text-center'>
                            <ListMusicIcon className='mx-auto mb-2 h-12 w-12 opacity-50' />
                            <p>No items in playlist</p>
                            <p className='text-sm'>
                              Drag content from the library to add items
                            </p>
                          </div>
                        ) : (
                          playlistItems.map((item, index) => (
                            <DraggablePlaylistItem
                              index={index}
                              item={item}
                              key={item.id}
                              onReorder={handleReorderPlaylistItems}
                            />
                          ))
                        )}
                      </div>
                    </DropZone>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className='flex h-full flex-col'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <FileImageIcon className='mr-2 h-5 w-5' />
                      Content Library ({filteredContentLibrary.length}
                      {contentSearchQuery ? ` of ${contentLibrary.length}` : ''}
                      )
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-grow flex-col'>
                    <div className='mb-4'>
                      <div className='relative'>
                        <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                        <Input
                          className='pl-10'
                          onChange={(e) =>
                            setContentSearchQuery(e.target.value)
                          }
                          placeholder='Search contents...'
                          value={contentSearchQuery}
                        />
                      </div>
                      {contentSearchQuery && (
                        <div className='text-muted-foreground mt-2 text-xs'>
                          {filteredContentLibrary.length} of{' '}
                          {contentLibrary.length} items match
                          {contentSearchQuery.includes('*') ||
                          contentSearchQuery.includes('.') ||
                          contentSearchQuery.includes('^')
                            ? ' (regex mode)'
                            : ''}
                        </div>
                      )}
                    </div>
                    <div className='flex-grow overflow-y-auto'>
                      <DropZone
                        acceptedType='playlist-item'
                        dropIndicatorMessage='Drop to return to library'
                        onDropItem={handleReturnItemToLibrary}
                      >
                        <div className='space-y-2'>
                          {filteredContentLibrary.length > 0 ? (
                            filteredContentLibrary.map((content) => {
                              const originalIndex = contentLibrary.findIndex(
                                (item) => item.id === content.id,
                              )
                              return (
                                <DraggableContentItem
                                  content={content}
                                  index={originalIndex}
                                  key={content.id}
                                  onReorder={handleReorderContentLibrary}
                                />
                              )
                            })
                          ) : contentSearchQuery ? (
                            <div className='text-muted-foreground py-8 text-center'>
                              <SearchIcon className='mx-auto mb-2 h-12 w-12 opacity-50' />
                              <p>No items match your search</p>
                              <p className='text-sm'>
                                Try a different search term or regex pattern
                              </p>
                            </div>
                          ) : (
                            <div className='text-muted-foreground py-8 text-center'>
                              <FileImageIcon className='mx-auto mb-2 h-12 w-12 opacity-50' />
                              <p>Content library is empty</p>
                            </div>
                          )}
                        </div>
                      </DropZone>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          {quickFilters.map((filter) => (
            <Badge
              className='cursor-pointer px-3 py-1'
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? 'default' : 'secondary'}
            >
              {filter}
            </Badge>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <Sheet>
            <SheetTrigger asChild>
              <Button className='cursor-pointer' size='sm' variant='outline'>
                <FilterIcon className='mr-2 h-4 w-4' />
                Advanced Filters
              </Button>
            </SheetTrigger>
            <SheetContent className='p-6'>
              <SheetHeader className='mb-6'>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Filter and sort playlists by various properties
                </SheetDescription>
              </SheetHeader>
              <div className='space-y-6'>{/* Filter selects */}</div>
            </SheetContent>
          </Sheet>
          <div className='relative max-w-sm'>
            <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              className='pl-10'
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search playlists...'
              value={searchQuery}
            />
          </div>
        </div>
      </div>

      {createdPlaylists.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Created Playlists</h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {createdPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                onDeletePrompt={handlePromptDelete}
                onEdit={handleOpenEditModal}
                playlist={playlist}
              />
            ))}
          </div>
        </div>
      )}
      <AlertDialog
        onOpenChange={setIsDeleteConfirmOpen}
        open={isDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this playlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              playlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlaylistToDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlaylist}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
