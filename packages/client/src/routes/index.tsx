import { Await, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
  loader: ({ context: { orpc, queryClient } }) => ({
    deferredPromise: queryClient.ensureQueryData(
      orpc.public.ping.queryOptions(),
    ),
  }),
})

function Index() {
  const { deferredPromise } = Route.useLoaderData()
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mockup-code w-md">
        <Await
          promise={deferredPromise}
          fallback={
            <>
              <pre data-prefix="$">
                <code className="text-white/50">
                  Fetching message from server...
                </code>
                <AsciiSpinner interval={100} />
              </pre>
              <p className="invisible">Nothing to see here</p>
            </>
          }
        >
          {({ message }) => (
            <>
              <pre data-prefix="$">
                <code className="text-white/50">
                  Fetching message from server...done
                </code>
              </pre>
              <pre data-prefix="">
                <code>{message}!</code>
              </pre>
            </>
          )}
        </Await>
      </div>
    </main>
  )
}

function AsciiSpinner({ interval = 100 }) {
  const frames = ['|', '/', '-', '\\']
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((i) => (i + 1) % frames.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return <span className="text-white/50">{frames[frameIndex]}</span>
}
