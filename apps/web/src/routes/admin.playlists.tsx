import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/playlists')({
  component: Playlists,
})

function Playlists() {
  return <h1 className='text-4xl font-bold'>Playlists</h1>
}
