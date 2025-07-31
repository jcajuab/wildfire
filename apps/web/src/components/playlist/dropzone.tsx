import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { type ReactNode, useEffect, useRef } from 'react'

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

interface DropZoneProps {
  children: ReactNode
  onDropItem: (item: PlaylistItem) => void
  acceptedType: string
  dropIndicatorMessage: string
}

export function DropZone({
  children,
  onDropItem,
  acceptedType,
}: DropZoneProps) {
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
