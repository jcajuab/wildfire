import {
  FileImageIcon,
  InfoIcon,
  ListMusicIcon,
  SearchIcon,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { DraggableContentItem } from './draggable-content-item'
import { DraggablePlaylistItem } from './draggable-playlist-item'
import { DropZone } from './dropzone'

interface PlaylistItem {
  id: number
  name: string
  duration: string
}

type PlaylistStatus = 'draft' | 'ready'

interface CreatedPlaylist {
  id: number
  name: string
  description: string
  author: string
  items: PlaylistItem[]
  createdAt: Date
  status: PlaylistStatus
}

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (status?: PlaylistStatus) => void
  editingPlaylist: CreatedPlaylist | null
  playlistName: string
  setPlaylistName: (name: string) => void
  playlistDescription: string
  setPlaylistDescription: (description: string) => void
  playlistItems: PlaylistItem[]
  contentLibrary: PlaylistItem[]
  contentSearchQuery: string
  setContentSearchQuery: (query: string) => void
  onReorderPlaylistItems: (fromIndex: number, toIndex: number) => void
  onReorderContentLibrary: (fromIndex: number, toIndex: number) => void
  onAddContentToPlaylist: (content: PlaylistItem) => void
  onReturnItemToLibrary: (item: PlaylistItem) => void
  calculateTotalDuration: () => string
  parseDuration: (duration: string) => number
  filteredContentLibrary: PlaylistItem[]
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
  onSave,
  editingPlaylist,
  playlistName,
  setPlaylistName,
  playlistDescription,
  setPlaylistDescription,
  playlistItems,
  contentLibrary,
  contentSearchQuery,
  setContentSearchQuery,
  onReorderPlaylistItems,
  onReorderContentLibrary,
  onAddContentToPlaylist,
  onReturnItemToLibrary,
  calculateTotalDuration,
  parseDuration,
  filteredContentLibrary,
}: CreatePlaylistModalProps) {
  const [isSaveDraftDialogOpen, setIsSaveDraftDialogOpen] = useState(false)

  const hasUnsavedChanges = () => {
    return (
      playlistName.trim() ||
      playlistDescription.trim() ||
      playlistItems.length > 0
    )
  }

  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setIsSaveDraftDialogOpen(true)
    } else {
      onClose()
    }
  }

  const handleSaveDraft = () => {
    if (playlistName.trim()) {
      onSave('draft')
    }
    setIsSaveDraftDialogOpen(false)
  }

  const handleDiscardChanges = () => {
    setIsSaveDraftDialogOpen(false)
    onClose()
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCancelClick()
    }
  }

  return (
    <>
      <Dialog onOpenChange={handleDialogOpenChange} open={isOpen}>
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
                <Button onClick={handleCancelClick} variant='outline'>
                  Cancel
                </Button>
                <Button onClick={() => onSave('ready')}>
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
                    <strong>Total Duration:</strong> {calculateTotalDuration()}
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
                    onDropItem={onAddContentToPlaylist}
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
                            onReorder={onReorderPlaylistItems}
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
                    {contentSearchQuery ? ` of ${contentLibrary.length}` : ''})
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-grow flex-col'>
                  <div className='mb-4'>
                    <div className='relative'>
                      <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                      <Input
                        className='pl-10'
                        onChange={(e) => setContentSearchQuery(e.target.value)}
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
                      onDropItem={onReturnItemToLibrary}
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
                                onReorder={onReorderContentLibrary}
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

      {/* Save as Draft Dialog */}
      <Dialog
        onOpenChange={setIsSaveDraftDialogOpen}
        open={isSaveDraftDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Save playlist as draft?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Would you like to save this playlist as
              a draft before closing, or discard your changes?
              <br />
              <span className='text-muted-foreground mt-2 block text-xs'>
                Click outside this dialog to continue editing.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className='mt-6 flex justify-end gap-2'>
            <Button onClick={handleDiscardChanges} variant='outline'>
              Discard Changes
            </Button>
            <Button onClick={handleSaveDraft}>Save as Draft</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
