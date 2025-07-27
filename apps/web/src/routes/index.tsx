// ! This is temporary

import { createFileRoute } from '@tanstack/react-router'
import { ColorArea, ColorThumb } from 'react-aria-components'
import { z } from 'zod'

import { Link } from '#/components/Link'

const healthSchema = z.object({
  status: z.literal('UP'),
  uptime: z.string(),
  message: z.string(),
})

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ['health'],
      queryFn: async () => {
        const response = await fetch('/api/health')
        if (!(Math.random() > 0.01)) {
          throw new Error('What a goofy goober!')
        }
        const json = await response.json()
        const { success, data, error } = healthSchema.safeParse(json)
        if (!success) {
          throw new Error(JSON.stringify(z.flattenError(error).fieldErrors))
        }
        return data
      },
    })
  },
  component: Index,
})

function Index() {
  const { message } = Route.useLoaderData()
  return (
    <main className='flex h-screen flex-col items-center justify-center'>
      <p className='text-base-content/80 mt-4 text-xl'>{message}</p>
      <p className='text-base-content/60 mt-2'>Anyways, here are some colors</p>
      <ColorArea className='mt-2 size-48 shrink-0'>
        <ColorThumb className='size-5 rounded-[50%] border-2 border-solid border-white shadow-[0_0_0_1px_black] inset-shadow-[0_0_0_1px_black] focus-visible:size-6' />
      </ColorArea>
      <Link className='hover:text-primary mt-6' to='/admin'>
        Go to Admin
      </Link>
    </main>
  )
}
