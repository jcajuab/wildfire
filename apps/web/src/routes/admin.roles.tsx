import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

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
    totalUsers: 329599,
  },
  {
    id: '2',
    role: 'Editor',
    totalUsers: 1039,
  },
  {
    id: '3',
    role: 'Viewer',
    totalUsers: 20,
  },
  // Add 47 more sample items for a total of 50
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `${i + 4}`,
    role: `Role ${i + 4}`,
    totalUsers: Math.floor(Math.random() * 100) + 1,
  })),
]

function Component() {
  return (
    <>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>Roles</h1>
        <Button className=''>
          <PlusIcon /> Create Role
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
      {/* <DataTablePagination table={table} /> */}
    </>
  )
}
