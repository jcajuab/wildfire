import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/schedules')({
  component: Schedules,
})

function Schedules() {
  return <h1 className='text-4xl font-bold'>Schedules</h1>
}
