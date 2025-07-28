import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content')({
  component: Component,
})

function Component() {
  return <h1 className='text-4xl font-bold'>Content</h1>
}
