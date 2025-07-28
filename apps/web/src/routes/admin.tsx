// * This is the layout route for /admin

import { createFileRoute, Outlet } from '@tanstack/react-router'

// TODO: Add proper authentication. See: https://github.com/TanStack/router/tree/main/examples/react/authenticated-routes
export const Route = createFileRoute('/admin')({
  component: Component,
})

function Component() {
  return <Outlet />
}
