import type { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

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
  {
    id: 'actions',
    cell: ({ row }) => {
      const selectedRow = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='h-8 w-8 p-0' variant='ghost'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => alert(JSON.stringify(selectedRow.totalUsers))}
            >
              <PencilIcon className='h-4 w-4' />
              Edit Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-red-500'
              onClick={() => alert(JSON.stringify(selectedRow.role))}
            >
              <Trash2Icon className='h-4 w-4' />
              Remove Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
