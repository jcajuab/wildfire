import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
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

export const Route = createFileRoute('/admin/playlists')({
  component: Component,
})

function Component() {
  const handleAddPlaylist = () => {
    console.log('Add playlist clicked')
    // Add your playlist creation logic here
  }

  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const quickFilters = ['All', 'Ready', 'Live', 'Down']

  return (
    <div className='w-full space-y-6'>
      {/* Header with Add Button */}
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-4xl font-bold'>Playlist Magdadaro</h1>
        <Button
          className='cursor-pointer'
          onClick={handleAddPlaylist}
          variant='default'
        >
          Create Playlist
        </Button>
      </div>

      {/* Filters and Search Section */}
      <div className='flex w-full items-center gap-4'>
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

        {/* Advanced Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className='cursor-pointer' size='sm' variant='outline'>
              Advanced Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Filter and sort playlists by various properties
              </SheetDescription>
            </SheetHeader>
            <div className='mt-6 space-y-4'>
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
        <div className='relative ml-auto max-w-sm flex-1'>
          <Input
            className='pl-10'
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search playlists...'
            value={searchQuery}
          />
        </div>
      </div>
    </div>
  )
}
