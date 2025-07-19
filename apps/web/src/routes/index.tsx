import { createFileRoute, Link } from '@tanstack/react-router'
import { PlayIcon } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
  loader: async ({ context: { orpc, queryClient } }) => {
    return {
      displays: await queryClient.ensureQueryData(
        orpc.display.findAll.queryOptions({
          input: {},
        }),
      ),
    }
  },
})

function Index() {
  const { displays } = Route.useLoaderData()

  return (
    <ul className='list rounded-box bg-base-100 shadow-md'>
      <li className='p-4 pb-2 text-xs tracking-wide opacity-60'>Recently added displays</li>
      {displays.map(({ id, name, slug, description }) => (
        <li className='list-row items-center' key={id}>
          <h3 className='font-semibold uppercase'>{name}</h3>
          <p className='text-xs opacity-60'>{description || 'No description provided'}</p>
          <Link
            className='btn btn-square btn-ghost'
            params={{
              displaySlug: slug,
            }}
            to='/$displaySlug'
          >
            <PlayIcon className='size-5' />
          </Link>
        </li>
      ))}
    </ul>
  )
}
