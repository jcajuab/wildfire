import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { ClockIcon, GripVerticalIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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

interface DraggableContentItemProps {
  content: PlaylistItem
  index: number
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function DraggableContentItem({
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
