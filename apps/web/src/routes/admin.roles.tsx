import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/admin/roles')({
  component: Component,
})

function Component() {
  return (
    <>
      {/* Header */}
      <div className='flex items-center'>
        <h1 className='mr-auto text-4xl font-bold'>Roles</h1>
        <Button className='ml-auto'>+ Create Role</Button>
      </div>
    </>
  )
}
