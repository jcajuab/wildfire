import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ModeToggle } from '#/components/mode-toggle'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: Component,
})

function Component() {
  return (
    <>
      <ModeToggle />
      <Outlet />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  )
}
