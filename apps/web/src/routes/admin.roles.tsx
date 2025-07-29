import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import { columns, type Role } from '#/types/columnRoles'

export const Route = createFileRoute('/admin/roles')({
  component: Component,
})

const data: Role[] = [
  {
    id: '1',
    role: 'Admin',
    totalUsers: 5,
  },
  {
    id: '2',
    role: 'Editor',
    totalUsers: 10,
  },
  {
    id: '3',
    role: 'Viewer',
    totalUsers: 20,
  },
]

function Component() {
  return (
    <>
      {/* Header */}
      <div className='flex items-center'>
        <h1 className='mr-auto text-4xl font-bold'>Roles</h1>
        <Button className='ml-auto'>+ Create Role</Button>
      </div>

      <DataTable columns={columns} data={data} />
    </>
  )
}
