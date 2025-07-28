import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/displays')({
  component: Component,
})

function Component() {
  return <h1 className='text-4xl font-bold'>Displays</h1>
}
