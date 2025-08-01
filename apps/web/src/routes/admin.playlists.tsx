import { createFileRoute } from '@tanstack/react-router'
import { FilterIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { CreatePlaylistModal } from '../components/playlist/create-playlist-modal'
import { PlaylistCard } from '../components/playlist/playlist-card'
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
import { Dialog, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet'
// Import types
import type {
  CreatedPlaylist,
  PlaylistItem,
  PlaylistStatus,
} from '../types/playlist'

export const Route = createFileRoute('/admin/playlists')({
  component: Component,
})

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
    { id: 1, name: 'Test Content #1', duration: '2:15' },
    { id: 2, name: 'Test Content #2', duration: '1:45' },
    { id: 3, name: 'Test Content #3', duration: '3:20' },
    { id: 4, name: 'Test Content #4', duration: '0:58' },
    { id: 5, name: 'Test Content #5', duration: '2:33' },
    { id: 101, name: 'Test Content #6', duration: '0:45' },
    { id: 102, name: 'Test Content #7', duration: '0:30' },
    { id: 103, name: 'Test Content #8', duration: '1:00' },
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

  const filterPlaylists = (
    playlists: CreatedPlaylist[],
    query: string,
  ): CreatedPlaylist[] => {
    if (!query.trim()) return playlists
    try {
      const hasRegexChars = /[.*+?^${}()|[\]\\]/.test(query)
      const regex = hasRegexChars ? new RegExp(query, 'i') : null
      const lowerQuery = query.toLowerCase()
      return playlists.filter((playlist) =>
        regex
          ? regex.test(playlist.name) || regex.test(playlist.description)
          : playlist.name.toLowerCase().includes(lowerQuery) ||
            playlist.description.toLowerCase().includes(lowerQuery),
      )
    } catch {
      const lowerQuery = query.toLowerCase()
      return playlists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(lowerQuery) ||
          playlist.description.toLowerCase().includes(lowerQuery),
      )
    }
  }

  const filteredContentLibrary = filterContentLibrary(
    contentLibrary,
    contentSearchQuery,
  )

  const filteredAndStatusFilteredPlaylists = (() => {
    let filtered = filterPlaylists(createdPlaylists, searchQuery)

    if (activeFilter !== 'All') {
      const statusMap = {
        Draft: 'draft',
        'In Use': 'ready',
      } as const

      const targetStatus = statusMap[activeFilter as keyof typeof statusMap]
      if (targetStatus) {
        filtered = filtered.filter(
          (playlist) => playlist.status === targetStatus,
        )
      }
    }

    return filtered
  })()

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

  const handleSavePlaylist = (status: PlaylistStatus = 'ready') => {
    if (!playlistName.trim()) return

    if (editingPlaylist) {
      const updatedPlaylist = {
        ...editingPlaylist,
        name: playlistName,
        description: playlistDescription || 'No description provided.',
        items: [...playlistItems],
        status: status,
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
        status: status,
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

  const quickFilters = ['All', 'Draft', 'In Use']

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
        </Dialog>

        <CreatePlaylistModal
          calculateTotalDuration={calculateTotalDuration}
          contentLibrary={contentLibrary}
          contentSearchQuery={contentSearchQuery}
          editingPlaylist={editingPlaylist}
          filteredContentLibrary={filteredContentLibrary}
          isOpen={isCreateModalOpen}
          onAddContentToPlaylist={handleAddContentToPlaylist}
          onClose={closeAndResetModal}
          onReorderContentLibrary={handleReorderContentLibrary}
          onReorderPlaylistItems={handleReorderPlaylistItems}
          onReturnItemToLibrary={handleReturnItemToLibrary}
          onSave={handleSavePlaylist}
          parseDuration={parseDuration}
          playlistDescription={playlistDescription}
          playlistItems={playlistItems}
          playlistName={playlistName}
          setContentSearchQuery={setContentSearchQuery}
          setPlaylistDescription={setPlaylistDescription}
          setPlaylistName={setPlaylistName}
        />
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
            {searchQuery && (
              <div className='text-muted-foreground absolute -bottom-5 left-3 text-xs'>
                {filteredAndStatusFilteredPlaylists.length} of{' '}
                {createdPlaylists.length} playlists match
                {searchQuery.includes('*') ||
                searchQuery.includes('.') ||
                searchQuery.includes('^')
                  ? ' (regex mode)'
                  : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {createdPlaylists.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold'>
            {activeFilter === 'All'
              ? 'All Playlists'
              : `${activeFilter} Playlists`}
            {searchQuery &&
              ` (${filteredAndStatusFilteredPlaylists.length} found)`}
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredAndStatusFilteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                onDeletePrompt={handlePromptDelete}
                onEdit={handleOpenEditModal}
                playlist={playlist}
              />
            ))}
          </div>
          {filteredAndStatusFilteredPlaylists.length === 0 &&
            (searchQuery || activeFilter !== 'All') && (
              <div className='text-muted-foreground py-8 text-center'>
                <SearchIcon className='mx-auto mb-2 h-12 w-12 opacity-50' />
                <p>No playlists match your current filters</p>
                <p className='text-sm'>
                  Try adjusting your search terms or filter selection
                </p>
              </div>
            )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
