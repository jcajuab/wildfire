import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarCheckIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutListIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { ButtonGroup } from '#/components/ui/button-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'

export const Route = createFileRoute('/admin/schedules')({
  component: Component,
})

const tabs = [
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
  return (
    // TODO: Switch classes to 'min-h-screen w-full gap-y-4 p-4' after dropping `admin.tsx`
    <Tabs className='w-full flex-1 gap-y-4' defaultValue='day'>
      <h1 className='text-4xl font-bold'>Schedules</h1>
      <header className='flex items-center justify-between'>
        <div className='flex gap-x-2'>
          <Button variant='outline'>Today</Button>
          <ButtonGroup>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='icon' variant='outline'>
                  <ChevronLeftIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Day</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='icon' variant='outline'>
                  <ChevronRightIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Day</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </div>
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
      </header>
      <main>
        <TabsContent value='day'>
          <p>Day View</p>
        </TabsContent>
        <TabsContent value='week'>
          <p>Week View</p>
        </TabsContent>
        <TabsContent value='month'>
          <p>Month View</p>
        </TabsContent>
      </main>
    </Tabs>
  )
}
