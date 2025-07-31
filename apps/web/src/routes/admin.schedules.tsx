import { zodResolver } from '@hookform/resolvers/zod'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { createFileRoute } from '@tanstack/react-router'
import { format, isToday } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePicker } from '#/components/date-picker'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { Tooltip, TooltipContent } from '#/components/ui/tooltip'

export const Route = createFileRoute('/admin/schedules')({
  component: Component,
})

// TODO: Improve this
const formSchema = z.object({
  scheduleName: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  playlist: z.string(),
  targetDisplays: z.array(z.string()),
})

type FormSchema = z.infer<typeof formSchema>

function Component() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = (values: FormSchema) => {
    console.log(values)
    console.log(isDialogOpen)
    setIsDialogOpen(false)
  }

  const today = new Date()

  const [date, setDate] = useState<Date>(today)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)

  return (
    <>
      <header className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>Schedules</h1>
        <CreateScheduleFormDialog
          form={form}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
        />
      </header>
      <div className='flex items-center justify-between'>
        <div></div>

        <div className='flex items-center gap-x-2'>
          <DatePicker
            date={date}
            open={isDatePickerOpen}
            onDateChange={setDate}
            onOpenChange={setIsDatePickerOpen}
          >
            <Button className='text-lg font-medium' variant='ghost'>
              {format(date, 'ccc, LLL d')}
              <ChevronDownIcon />
            </Button>
          </DatePicker>
          <Button
            variant='outline'
            disabled={isToday(date)}
            onClick={() => setDate(today)}
          >
            Today
          </Button>
        </div>
        <div></div>
      </div>
    </>
  )
}

type CreateScheduleFormDialogProps = {
  form: UseFormReturn<FormSchema>
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  onSubmit: (data: FormSchema) => void
}

function CreateScheduleFormDialog({
  form,
  open,
  onOpenChange,
  onSubmit,
}: CreateScheduleFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size='lg'>Create Schedule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription
            onFocusCapture={(event) => event.stopPropagation()}
          >
            <span>Schedule a playlist or </span>
            <Tooltip>
              <TooltipTrigger>
                <strong>flash</strong>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                A marquee-style overlay that remains visible regardless of
                whether content is present.
              </TooltipContent>
            </Tooltip>
            <span> to target displays or display groups.</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='scheduleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
