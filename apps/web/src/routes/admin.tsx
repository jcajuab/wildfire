// * This is the layout route for /admin

import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdminSidebar } from '#/components/admin-sidebar'
import { SidebarProvider } from '#/components/ui/sidebar'

// TODO: Add proper authentication. See: https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes
export const Route = createFileRoute('/admin')({
  component: Component,
})

function Component() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='flex min-h-screen w-full flex-col gap-y-4 overflow-hidden p-4'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
