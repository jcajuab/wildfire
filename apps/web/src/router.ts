import { createRouter } from '@tanstack/react-router'

import { orpc } from './lib/orpc'
import { queryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    orpc,
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
