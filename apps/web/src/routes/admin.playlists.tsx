import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/playlists')({
  component: Component,
})

function Component() {
  return <h1 className='text-4xl font-bold'>Playlists</h1>
}
