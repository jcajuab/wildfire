import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/displays')({
  component: Displays,
})

function Displays() {
  return <h1 className='text-4xl font-bold'>Displays</h1>
}
