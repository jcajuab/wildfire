import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { createFileRoute } from '@tanstack/react-router'
import {
  ClockIcon,
  FileImageIcon,
  FilterIcon,
  GripVerticalIcon,
  InfoIcon,
  ListMusicIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

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
}

interface DropZoneProps {
  children: ReactNode
  onDropItem: (item: PlaylistItem) => void
  acceptedType: string
  dropIndicatorMessage: string
}

// Reusable Drop Zone Component
function DropZone({
  children,
  onDropItem,
  acceptedType,
  dropIndicatorMessage,
}: DropZoneProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDropTarget, setIsDropTarget] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const autoScrollCleanup = autoScrollForElements({ element })
    const dropTargetCleanup = dropTargetForElements({
      element,
      canDrop: ({ source }) => (source.data as DragData).type === acceptedType,
      onDragEnter: () => setIsDropTarget(true),
      onDragLeave: () => setIsDropTarget(false),
      onDrop: ({ source }) => {
        setIsDropTarget(false)
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
    <div
      className={`min-h-[200px] rounded-lg transition-all ${
        isDropTarget ? 'border-green-200 bg-green-50 ring-2 ring-green-500' : ''
      }`}
      ref={elementRef}
    >
      {isDropTarget && (
        <div className='py-4 text-center font-medium text-green-600'>
          {dropIndicatorMessage}
        </div>
      )}
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
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDropTarget, setIsDropTarget] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    const dragHandle = dragHandleRef.current
    if (!element || !dragHandle) return

    const cleanupDraggable = draggable({
      element: dragHandle,
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
      className={`flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-all ${
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
      <div
        className='cursor-grab rounded p-1 hover:bg-gray-200 active:cursor-grabbing'
        ref={dragHandleRef}
      >
        <GripVerticalIcon className='h-4 w-4 text-gray-400' />
      </div>
    </div>
  )
}

// Draggable Content Library Item
function DraggableContentItem({ content }: DraggableContentItemProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    const dragHandle = dragHandleRef.current
    if (!element || !dragHandle) return

    const cleanup = draggable({
      element: dragHandle,
      getInitialData: () => ({ type: 'content-item', content }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    return cleanup
  }, [content])

  return (
    <div
      className={`flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100 ${
        isDragging ? 'scale-95 opacity-50' : ''
      }`}
      ref={elementRef}
    >
      <div className='flex items-center space-x-3'>
        <div className='text-sm font-medium'>{content.name}</div>
        <div className='text-muted-foreground flex items-center text-xs'>
          <ClockIcon className='mr-1 h-3 w-3' />
          {content.duration} min
        </div>
      </div>
      <div
        className='cursor-grab rounded p-1 hover:bg-gray-200 active:cursor-grabbing'
        ref={dragHandleRef}
      >
        <GripVerticalIcon className='h-4 w-4 text-gray-400' />
      </div>
    </div>
  )
}

function Component() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')

  const initialPlaylist = [
    { id: 101, name: 'AkiBlog #30', duration: '0:45' },
    { id: 102, name: 'AkiBlog #31', duration: '0:30' },
    { id: 103, name: 'AkiBlog #32', duration: '1:00' },
  ]
  const initialContent = [
    { id: 1, name: 'AkiBlog #29', duration: '2:15' },
    { id: 2, name: 'AkiBlog #28', duration: '1:45' },
    { id: 3, name: 'AkiBlog #27', duration: '3:20' },
    { id: 4, name: 'AkiBlog #26', duration: '0:58' },
    { id: 5, name: 'AkiBlog #25', duration: '2:33' },
  ]

  const [playlistItems, setPlaylistItems] =
    useState<PlaylistItem[]>(initialPlaylist)
  const [contentLibrary, setContentLibrary] =
    useState<PlaylistItem[]>(initialContent)

  const handleAddPlaylist = () => setIsCreateModalOpen(true)

  const handleCreatePlaylist = () => {
    console.log('Creating playlist:', {
      name: playlistName,
      description: playlistDescription,
      items: playlistItems,
    })
    // Reset form and close modal
    setPlaylistName('')
    setPlaylistDescription('')
    setPlaylistItems([])
    setContentLibrary([...initialContent, ...initialPlaylist]) // Reset content library
    setIsCreateModalOpen(false)
  }

  const handleCancel = () => {
    setPlaylistName('')
    setPlaylistDescription('')
    setPlaylistItems(initialPlaylist)
    setContentLibrary(initialContent)
    setIsCreateModalOpen(false)
  }

  const handleReorderPlaylistItems = (fromIndex: number, toIndex: number) => {
    const newItems = [...playlistItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    if (movedItem) {
      newItems.splice(toIndex, 0, movedItem)
      setPlaylistItems(newItems)
    }
  }

  const handleAddContentToPlaylist = (content: PlaylistItem) => {
    if (playlistItems.some((item) => item.id === content.id)) return // Avoid duplicates
    setPlaylistItems((prev) => [...prev, content])
    setContentLibrary((prev) => prev.filter((item) => item.id !== content.id))
  }

  const handleReturnItemToLibrary = (item: PlaylistItem) => {
    if (contentLibrary.some((c) => c.id === item.id)) return // Avoid duplicates
    setContentLibrary((prev) => [...prev, item])
    setPlaylistItems((prev) => prev.filter((pItem) => pItem.id !== item.id))
  }

  const calculateTotalDuration = () => {
    if (playlistItems.length === 0) return '0:00'
    let totalMinutes = 0
    let totalSeconds = 0
    playlistItems.forEach((item) => {
      const parts = item.duration.split(':')
      const minutes = parseInt(parts[0] || '0', 10)
      const seconds = parseInt(parts[1] || '0', 10)
      if (!Number.isNaN(minutes)) totalMinutes += minutes
      if (!Number.isNaN(seconds)) totalSeconds += seconds
    })
    totalMinutes += Math.floor(totalSeconds / 60)
    totalSeconds %= 60
    return `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`
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
              onClick={handleAddPlaylist}
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
                  <DialogTitle>Create New Playlist</DialogTitle>
                  <DialogDescription>
                    Add and organize contents to form a playlist. Drag items
                    between the content library and the playlist.
                  </DialogDescription>
                </div>
                <div className='flex items-center gap-2'>
                  <Button onClick={handleCancel} variant='outline'>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlaylist}>Create</Button>
                </div>
              </div>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-6 py-4'>
              {/* Left Column - Playlist Information */}
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
                      {calculateTotalDuration()} min
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

              {/* Right Column - Content Library */}
              <div>
                <Card className='flex h-full flex-col'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <FileImageIcon className='mr-2 h-5 w-5' />
                      Content Library ({contentLibrary.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-grow flex-col'>
                    <div className='mb-4'>
                      <div className='relative'>
                        <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                        <Input
                          className='pl-10'
                          placeholder='Search contents...'
                        />
                      </div>
                    </div>
                    <div className='flex-grow overflow-y-auto'>
                      <DropZone
                        acceptedType='playlist-item'
                        dropIndicatorMessage='Drop to return to library'
                        onDropItem={handleReturnItemToLibrary}
                      >
                        <div className='space-y-2'>
                          {contentLibrary.length > 0 ? (
                            contentLibrary.map((content) => (
                              <DraggableContentItem
                                content={content}
                                key={content.id}
                              />
                            ))
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

      {/* Filters and Search Section */}
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
    </div>
  )
}
