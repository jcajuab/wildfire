import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'

interface DatePickerProps extends PropsWithChildren {
  date: Date
  open: boolean
  onDateChange: Dispatch<SetStateAction<Date>>
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function DatePicker({
  date,
  open,
  onDateChange,
  onOpenChange,
  children,
}: DatePickerProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode='single'
          timeZone='Asia/Manila'
          selected={date}
          onSelect={onDateChange}
          defaultMonth={date}
          required
        />
      </PopoverContent>
    </Popover>
  )
}
