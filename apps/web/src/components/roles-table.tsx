import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { SearchIcon, UserIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Input } from '#/components/ui/input'
import { Pagination } from '#/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function RolesTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Adds sorting functionality
  const [sorting, setSorting] = React.useState<SortingState>([])
  // Adds filter functionality
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  // Adds pagination functionality
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  return (
    <>
      <div className='flex items-end justify-between'>
        <h2 className='scroll-m-20 font-semibold tracking-tight first:mt-0'>
          Search results
        </h2>
        <div className='relative'>
          <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2' />
          <Input
            className='max-w-sm pl-10'
            onChange={(event) =>
              table.getColumn('role')?.setFilterValue(event.target.value)
            }
            placeholder='Search roles...'
            value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
          />
        </div>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'totalUsers' ? (
                        <span className='flex items-center gap-2'>
                          <div className='inline-block min-w-[2ch] text-left'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                          <UserIcon className='h-4 w-4' />
                        </span>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className='h-24 text-center'
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination table={table} />
      </div>
    </>
  )
}
