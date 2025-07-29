import { createFileRoute } from '@tanstack/react-router'
import {
  ClockIcon,
  FileImageIcon,
  FilterIcon,
  InfoIcon,
  ListMusicIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'
import { useState } from 'react'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
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

function Component() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  const handleAddPlaylist = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreatePlaylist = () => {
    console.log('Creating playlist:', {
      name: playlistName,
      description: playlistDescription,
      items: selectedItems,
    })
    // Reset form and close modal
    setPlaylistName('')
    setPlaylistDescription('')
    setSelectedItems([])
    setIsCreateModalOpen(false)
  }

  const handleCancel = () => {
    setPlaylistName('')
    setPlaylistDescription('')
    setSelectedItems([])
    setIsCreateModalOpen(false)
  }

  const quickFilters = ['All', 'Ready', 'Live', 'Down']

  // Mock content library data
  const contentLibrary = [
    { id: 1, name: 'AkiBlog #29', duration: '2:15' },
    { id: 2, name: 'AkiBlog #28', duration: '1:45' },
    { id: 3, name: 'AkiBlog #28', duration: '3:20' },
    { id: 4, name: 'AkiBlog #27', duration: '0:58' },
    { id: 5, name: 'AkiBlog #26', duration: '2:33' },
  ]

  // Mock playlist items (for demonstration)
  const playlistItems = [
    { id: 1, name: 'AkiBlog #30', duration: '0:45' },
    { id: 2, name: 'AkiBlog #31', duration: '0:30' },
    { id: 3, name: 'AkiBlog #32', duration: '1:00' },
  ]

  const calculateTotalDuration = () => {
    // Mock calculation - in real app would calculate from selected items
    return '2:25'
  }

  return (
    <div className='w-full space-y-6'>
      {/* Header with Add Button */}
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
                    Add and organize contents to form a playlist
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

                {/* Playlist Items Section */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='flex items-center'>
                        <ListMusicIcon className='mr-2 h-5 w-5' />
                        Playlist Items
                      </CardTitle>
                      <Button size='sm' variant='outline'>
                        Preview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {playlistItems.map((item, index) => (
                        <div
                          className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                          key={item.id}
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='text-sm font-medium'>
                              {item.name}
                            </div>
                            <div className='text-muted-foreground flex items-center text-xs'>
                              <ClockIcon className='mr-1 h-3 w-3' />
                              {item.duration} min
                            </div>
                          </div>
                          <Button size='sm' variant='ghost'>
                            <MoreVerticalIcon className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Content Library */}
              <div>
                <Card className='h-full'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <FileImageIcon className='mr-2 h-5 w-5' />
                      Content Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4'>
                      <div className='relative'>
                        <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                        <Input
                          className='pl-10'
                          placeholder='Search contents...'
                        />
                      </div>
                    </div>

                    <div className='max-h-[400px] space-y-2 overflow-y-auto'>
                      {contentLibrary.map((content) => (
                        <div
                          className='flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100'
                          key={content.id}
                        >
                          <div className='text-sm font-medium'>
                            {content.name}
                          </div>
                          <Button size='sm' variant='ghost'>
                            <MoreVerticalIcon className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
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
        {/* Simple Filters */}
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

        {/* Right side: Advanced Filters and Search */}
        <div className='flex items-center gap-4'>
          {/* Advanced Filters */}
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
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='device-status'>Device Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      <SelectItem value='live'>Live</SelectItem>
                      <SelectItem value='ready'>Ready</SelectItem>
                      <SelectItem value='down'>Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='display-groups'>Display Groups</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select group' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Groups</SelectItem>
                      <SelectItem value='group1'>Group 1</SelectItem>
                      <SelectItem value='group2'>Group 2</SelectItem>
                      <SelectItem value='group3'>Group 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='sort-by'>Sort By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='name'>Name</SelectItem>
                      <SelectItem value='date'>Date Created</SelectItem>
                      <SelectItem value='status'>Status</SelectItem>
                      <SelectItem value='group'>Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search Field */}
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
