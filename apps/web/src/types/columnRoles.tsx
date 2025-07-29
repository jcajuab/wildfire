import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'

// (1) Define the columns for the table
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Role = {
  id: string
  role: string
  totalUsers: number
}

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          className='w-full justify-start text-left font-medium'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Role
          <ArrowUpDownIcon />
        </Button>
      )
    },
  },
  {
    accessorKey: 'totalUsers',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          variant='ghost'
        >
          Users
          <ArrowUpDownIcon />
        </Button>
      )
    },
  },
]
