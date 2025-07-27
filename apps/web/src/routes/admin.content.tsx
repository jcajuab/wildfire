import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content')({
  component: Content,
})

function Content() {
  return <h1 className='text-4xl font-bold'>Content</h1>
}
