import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import type { ORPC } from '../lib/orpc'

export const Route = createRootRouteWithContext<{
  orpc: ORPC
  queryClient: QueryClient
}>()({
  component: Root,
})

function Root() {
  return (
    <main className='container mx-auto flex min-h-screen items-center justify-center'>
      <Outlet />
    </main>
  )
}
