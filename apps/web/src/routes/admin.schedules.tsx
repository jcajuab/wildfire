import { createFileRoute } from '@tanstack/react-router'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  isSameYear,
  isValid,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import {
  CalendarCheckIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  type Icon,
  LayoutListIcon,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '#/components/ui/button'
import { ButtonGroup } from '#/components/ui/button-group'
import { Calendar } from '#/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'

export const Route = createFileRoute('/admin/schedules')({
  component: Component,
})

type ViewType = 'day' | 'week' | 'month'

interface Tab {
  value: ViewType
  tooltip: string
  icon: typeof Icon
}

interface DateRange {
  from: Date
  to: Date
}

const tabs: Tab[] = [
  {
    value: 'day',
    tooltip: 'Day View',
    icon: CalendarCheckIcon,
  },
  {
    value: 'week',
    tooltip: 'Week View',
    icon: LayoutListIcon,
  },
  {
    value: 'month',
    tooltip: 'Month View',
    icon: CalendarDaysIcon,
  },
]

function Component() {
  const [date, setDate] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    return {
      from: startOfWeek(today),
      to: endOfWeek(today),
    }
  })

  const [open, setOpen] = useState<boolean>(false)
  const [view, setView] = useState<ViewType>('day')

  const handleTodayClick = useCallback(() => {
    const today = new Date()
    setDate(today)
    setDateRange({
      from: startOfWeek(today),
      to: endOfWeek(today),
    })
  }, [])

  const handleViewChange = useCallback(
    (newView: string) => {
      const viewType = newView as ViewType
      setView(viewType)

      // Update date range when switching to week view
      if (viewType === 'week') {
        setDateRange({
          from: startOfWeek(date),
          to: endOfWeek(date),
        })
      }
    },
    [date],
  )

  const handlePrevious = useCallback(() => {
    switch (view) {
      case 'day': {
        const prevDay = subDays(date, 1)
        setDate(prevDay)
        break
      }
      case 'week': {
        const prevWeekStart = subWeeks(dateRange.from, 1)
        const prevWeekEnd = subWeeks(dateRange.to, 1)
        setDateRange({ from: prevWeekStart, to: prevWeekEnd })
        setDate(prevWeekStart)
        break
      }
      case 'month': {
        const prevMonth = subMonths(date, 1)
        setDate(prevMonth)
        break
      }
    }
  }, [view, date, dateRange])

  const handleNext = useCallback(() => {
    switch (view) {
      case 'day': {
        const nextDay = addDays(date, 1)
        setDate(nextDay)
        break
      }
      case 'week': {
        const nextWeekStart = addWeeks(dateRange.from, 1)
        const nextWeekEnd = addWeeks(dateRange.to, 1)
        setDateRange({ from: nextWeekStart, to: nextWeekEnd })
        setDate(nextWeekStart)
        break
      }
      case 'month': {
        const nextMonth = addMonths(date, 1)
        setDate(nextMonth)
        break
      }
    }
  }, [view, date, dateRange])

  return (
    <Tabs
      className='w-full flex-1 gap-y-4'
      onValueChange={handleViewChange}
      value={view}
    >
      <ScheduleHeader
        date={date}
        dateRange={dateRange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTodayClick={handleTodayClick}
        open={open}
        setDate={setDate}
        setDateRange={setDateRange}
        setOpen={setOpen}
        view={view}
      />

      <ScheduleViews />
    </Tabs>
  )
}

interface ScheduleHeaderProps {
  onTodayClick: () => void
  onPrevious: () => void
  onNext: () => void
  date: Date
  dateRange: DateRange
  open: boolean
  setDate: (date: Date) => void
  setDateRange: (dateRange: DateRange) => void
  setOpen: (open: boolean) => void
  view: ViewType
}

function ScheduleHeader({
  onTodayClick,
  onPrevious,
  onNext,
  date,
  dateRange,
  open,
  setDate,
  setDateRange,
  setOpen,
  view,
}: ScheduleHeaderProps) {
  return (
    <>
      <h1 className='text-4xl font-bold'>Schedules</h1>
      <header className='flex items-center justify-between'>
        <NavigationControls
          onNext={onNext}
          onPrevious={onPrevious}
          onTodayClick={onTodayClick}
        />

        <SchedulesDatePicker
          date={date}
          dateRange={dateRange}
          open={open}
          setDate={setDate}
          setDateRange={setDateRange}
          setOpen={setOpen}
          view={view}
        />

        <ViewTabs />
      </header>
    </>
  )
}

function NavigationControls({
  onTodayClick,
  onPrevious,
  onNext,
}: {
  onTodayClick: () => void
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div className='flex gap-x-2'>
      <Button onClick={onTodayClick} variant='outline'>
        Today
      </Button>
      <ButtonGroup>
        <Button onClick={onPrevious} size='icon' variant='outline'>
          <ChevronLeftIcon />
        </Button>
        <Button onClick={onNext} size='icon' variant='outline'>
          <ChevronRightIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}

function ViewTabs() {
  return (
    <TabsList>
      {tabs.map((tab) => (
        <Tooltip key={tab.value}>
          <TabsTrigger asChild value={tab.value}>
            <TooltipTrigger>
              <tab.icon />
            </TooltipTrigger>
          </TabsTrigger>
          <TooltipContent>
            <p>{tab.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </TabsList>
  )
}

function ScheduleViews() {
  return (
    <>
      <TabsContent value='day'>
        <p>Day View</p>
      </TabsContent>
      <TabsContent value='week'>
        <p>Week View</p>
      </TabsContent>
      <TabsContent value='month'>
        <p>Month View</p>
      </TabsContent>
    </>
  )
}

interface SchedulesDatePickerProps {
  date: Date
  dateRange: DateRange
  open: boolean
  setDate: (date: Date) => void
  setDateRange: (dateRange: DateRange) => void
  setOpen: (open: boolean) => void
  view: ViewType
}

function SchedulesDatePicker({
  date,
  dateRange,
  setDate,
  setDateRange,
  open,
  setOpen,
  view,
}: SchedulesDatePickerProps) {
  const [rangeStep, setRangeStep] = useState<'from' | 'to'>('from')

  const formattedDate = useMemo(() => {
    const formatters: Record<ViewType, string> = {
      day: format(date, 'cccc, LLLL d'),
      week: formatWeekRange(dateRange.from, dateRange.to),
      month: format(date, 'LLLL yyyy'),
    }
    return formatters[view] ?? 'Invalid date'
  }, [date, dateRange, view])

  const calendarProps = useMemo(() => {
    const baseProps = {
      captionLayout: 'dropdown' as const,
      defaultMonth: date,
      startMonth: startOfYear(date),
      endMonth: startOfYear(addYears(date, 5)), // TODO: Make configurable
    }

    return baseProps
  }, [date])

  const handleSelect = useCallback(
    (newDate?: Date) => {
      if (!newDate || !isValid(newDate)) return
      setDate(newDate)
    },
    [setDate],
  )

  const handleSelectRange = useCallback(
    (newDateRange?: { from?: Date; to?: Date }) => {
      if (!newDateRange) return

      const { from, to } = newDateRange

      if (rangeStep === 'from' && from && isValid(from)) {
        setDateRange({ from, to: from })
        setRangeStep('to')
      } else if (rangeStep === 'to' && from && to && isValid(to)) {
        setDateRange({ from, to })
        setDate(from)
        setRangeStep('from')
      }
    },
    [setDate, setDateRange, rangeStep],
  )

  const isWeekView = view === 'week'

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className='text-lg font-medium' variant='ghost'>
          {formattedDate}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {isWeekView ? (
          <Calendar
            max={6}
            min={1}
            mode='range'
            onSelect={handleSelectRange}
            selected={dateRange}
            {...calendarProps}
          />
        ) : (
          <Calendar
            mode='single'
            onSelect={handleSelect}
            selected={date}
            {...calendarProps}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

function formatWeekRange(from: Date, to: Date): string {
  if (isSameYear(from, to)) {
    return `${format(from, 'LLLL d')} - ${format(to, 'LLLL d')}`
  }
  return `${format(from, 'LLLL d, yyyy')} - ${format(to, 'LLLL d, yyyy')}`
}
