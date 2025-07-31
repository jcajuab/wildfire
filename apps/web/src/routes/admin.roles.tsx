import { Label } from '@radix-ui/react-label'
import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { DataTable } from '#/components/ui/data-table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
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
        <Dialog>
          <DialogTrigger>
            <Button className='cursor-pointer'>
              <PlusIcon /> Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='mb-3'>Create New Role</DialogTitle>
              <Tabs className='w-full' defaultValue='display'>
                <TabsList className='mb-3 w-full'>
                  <TabsTrigger value='display'>Display</TabsTrigger>
                  <TabsTrigger value='permissions'>Permissions</TabsTrigger>
                  <TabsTrigger value='manage-users'>
                    Manage Users (X)
                  </TabsTrigger>
                </TabsList>
                <TabsContent className='flex flex-col gap-2' value='display'>
                  <Label htmlFor='role'>Role Name</Label>
                  <Input id='role' placeholder='Enter role name' />
                </TabsContent>
                <TabsContent value='permissions'>
                  Change your permissions here.
                </TabsContent>
                <TabsContent value='manage-users'>
                  Manage users here.
                </TabsContent>
              </Tabs>
            </DialogHeader>
            <DialogFooter className='flex gap-2 md:justify-end'>
              <DialogClose asChild>
                <div>
                  <Button className='mt-4' variant='outline'>
                    Cancel
                  </Button>
                </div>
              </DialogClose>
              <Button
                className='mt-4 cursor-pointer'
                onClick={(event) => {
                  console.log(event)
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} />
      {/* <DataTablePagination table={table} /> */}
    </>
  )
}
