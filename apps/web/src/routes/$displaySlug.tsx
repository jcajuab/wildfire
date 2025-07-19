import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$displaySlug')({
  component: Display,
  loader: async ({ context: { orpc, queryClient }, params: { displaySlug } }) => {
    return {
      display: await queryClient.ensureQueryData(
        orpc.display.findBySlug.queryOptions({
          input: {
            slug: displaySlug,
          },
        }),
      ),
    }
  },
})

function Display() {
  const { display } = Route.useLoaderData()

  // HACK: Got lazy ^_^
  return <pre>{JSON.stringify(display, null, 2)}</pre>
}
