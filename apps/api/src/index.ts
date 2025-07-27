import { nanoseconds, serve } from 'bun'

const messages = [
  'hamsters revolting but server still kinda workin',
  'system vibes: corrupted but functional',
  'uptime held together by spite and duct tape',
  'errors? maybe. do we care? no.',
  "code works but don't ask how",
  'server is awake and deeply confused',
  'ran outta coffee three days ago, still pushin packets',
  'restarted once, saw god, continued running',
  "debugged it till it cried, now it's compliant",
  "yes it's up, no we don't know why",
  'this is fine dot jpeg',
  'it compiles therefore it lives',
  'technically functioning, morally questionable',
  'running on vibes, rage, and stackoverflow posts',
  'performance: cursed but consistent',
]

serve({
  routes: {
    '/api/health': {
      GET: () => {
        const index = Math.floor(Math.random() * messages.length)
        const message = messages[index]

        return Response.json({
          status: 'UP',
          uptime: `${(nanoseconds() / 1e9).toFixed(2)} seconds`,
          message,
        })
      },
    },
  },
  fetch: () => new Response('Not Found', { status: 404 }),
})
