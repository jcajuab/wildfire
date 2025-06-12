import { trpc } from "./utils/trpc"
import { useQuery } from "@tanstack/react-query"

export function App() {
  const { data } = useQuery(trpc.hello.queryOptions({ name: "Boyo" }))

  return (
    <main>
      <p className="text-4xl">{data?.greeting}</p>
    </main>
  )
}
