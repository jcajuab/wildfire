import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context: { honoClient, queryClient } }) => {
    try {
      const message = await queryClient.ensureQueryData({
        queryKey: ["ping"],
        queryFn: async () => {
          const res = await honoClient.api.ping.$get()
          if (!res.ok) {
            throw new Error("p0nG")
          }
          return res.text()
        },
      })
      return { message }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { message: error.message }
      }

      console.error(error)
      return { message: "WTF!?" }
    }
  },
})

function Index() {
  const { message } = Route.useLoaderData()
  return <p>ping: {message}</p>
}
