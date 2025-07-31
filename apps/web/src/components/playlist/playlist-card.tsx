import {
  ClockIcon,
  EyeIcon,
  ListMusicIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

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

interface PlaylistCardProps {
  playlist: CreatedPlaylist
  onEdit: (playlist: CreatedPlaylist) => void
  onDeletePrompt: (id: number) => void
}

export function PlaylistCard({
  playlist,
  onEdit,
  onDeletePrompt,
}: PlaylistCardProps) {
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

  const totalSeconds = playlist.items.reduce(
    (acc, item) => acc + parseDuration(item.duration),
    0,
  )

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='flex items-center gap-2 text-xl font-bold text-gray-900'>
              {playlist.name}
              {playlist.status === 'draft' && (
                <span className='text-sm font-normal text-red-600'>
                  (Draft)
                </span>
              )}
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
              {formatDuration(totalSeconds)} {totalSeconds < 60 ? 'sec' : 'min'}
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
