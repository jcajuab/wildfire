import { createFileRoute } from '@tanstack/react-router'
import { InfoIcon, PlusIcon, UserPlusIcon } from 'lucide-react'

import { ComboBox } from '#/components/combobox'
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
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
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

const permissions = [
  {
    key: 'viewDisplays',
    label: 'View Displays',
    enabled: true,
    tooltipContent: 'Allows you to view display configurations',
  },
  {
    key: 'manageDisplays',
    label: 'Manage Displays',
    enabled: true,
    tooltipContent: 'Allows updates to display settings',
  },
  {
    key: 'controlDisplays',
    label: 'Control Displays',
    enabled: true,
    tooltipContent: 'Full control over display operations',
  },
  {
    key: 'viewContent',
    label: 'View Content',
    enabled: true,
    tooltipContent: 'Permission to read produced content',
  },
  {
    key: 'manageContent',
    label: 'Manage Content',
    enabled: true,
    tooltipContent: 'Create, edit or delete content entries',
  },
  {
    key: 'viewPlaylists',
    label: 'View Playlists',
    enabled: true,
    tooltipContent: 'See existing playlists',
  },
  {
    key: 'managePlaylists',
    label: 'Manage Playlists',
    enabled: true,
    tooltipContent: 'Add, remove or reorder playlists',
  },
  {
    key: 'viewSchedules',
    label: 'View Schedules',
    enabled: true,
    tooltipContent: 'Access scheduling information',
  },
  {
    key: 'manageSchedules',
    label: 'Manage Schedules',
    enabled: true,
    tooltipContent: 'Modify display schedules',
  },
  {
    key: 'viewUsers',
    label: 'View Users',
    enabled: true,
    tooltipContent: 'See user list and details',
  },
  {
    key: 'manageUsers',
    label: 'Manage Users',
    enabled: true,
    tooltipContent: 'Add, edit or remove users',
  },
  {
    key: 'viewRoles',
    label: 'View Roles',
    enabled: false,
    tooltipContent: 'See assigned roles',
  },
  {
    key: 'manageRoles',
    label: 'Manage Roles',
    enabled: true,
    tooltipContent: 'Assign or modify roles',
  },
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
                <TabsContent
                  className='overflow-hidden rounded-lg border border-gray-300'
                  value='permissions'
                >
                  <table className='min-w-full table-fixed border-collapse'>
                    <tbody>
                      {permissions.map(({ key, label, tooltipContent }) => (
                        <tr className='border-b border-gray-200' key={key}>
                          {/* Permission label column */}
                          <td className='w-3/8 px-4 py-2 align-middle'>
                            <Label
                              className='text-muted-foreground text-left'
                              htmlFor={key}
                            >
                              {label}
                            </Label>
                          </td>
                          {/* Info icon column */}
                          <td className='w-[40px] px-2 py-2 text-center align-middle'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className='text-muted-foreground h-4 w-4 align-middle' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tooltipContent}</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          {/* Switch column */}
                          <td className='px-4 py-2 text-right align-middle'>
                            <Switch
                              className='scale-125'
                              id={key}
                              onCheckedChange={(val) => {
                                console.log(`${key} toggled to`, val)
                                // your toggle logic
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                      {/* Optional row for bottom corner rounding */}
                      {permissions.length > 0 && (
                        <tr>
                          <td className='rounded-bl-lg'></td>
                          <td></td>
                          <td className='rounded-br-lg'></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </TabsContent>

                <TabsContent value='manage-users'>
                  <div className='flex gap-2'>
                    <div className='flex-1'>
                      <ComboBox />
                    </div>
                    <Button variant='outline'>
                      <UserPlusIcon /> Add User
                    </Button>
                  </div>
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
