import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '#/lib/utils'

const buttonGroupVariants = cva('flex items-center', {
  variants: {
    orientation: {
      horizontal:
        'flex-row *:not-first:rounded-l-none *:not-first:border-l-0 *:not-last:rounded-r-none',
      vertical:
        'flex-col *:not-first:rounded-t-none *:not-first:border-t-0 *:not-last:rounded-b-none',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      className={cn(buttonGroupVariants({ orientation, className }))}
      role='group'
      {...props}
    />
  )
}
