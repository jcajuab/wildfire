import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // ! This is temporary
  loader: () => {
    throw redirect({ to: '/admin/displays', replace: true })
  },
})
