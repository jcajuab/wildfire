import type { QueryClient } from "@tanstack/react-query"
import type { HonoClient } from "../lib/hono"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export const Route = createRootRouteWithContext<{
  honoClient: HonoClient
  queryClient: QueryClient
}>()({
  component: Root,
})

function Root() {
  return (
    <>
      <Outlet />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  )
}
