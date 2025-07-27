import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Sidebar } from '#/components/admin/Sidebar'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    // TODO: Add proper authentication. See: https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes
    if (!(Math.random() > 0.01)) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full p-4'>
        <Outlet />
      </main>
    </div>
  )
}
