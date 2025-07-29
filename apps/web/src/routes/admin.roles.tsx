import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/roles')({
  component: Component,
})

function Component() {
  return <h1 className='text-4xl font-bold'>Roles</h1>
}
