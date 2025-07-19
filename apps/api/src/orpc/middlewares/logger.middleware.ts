import { os } from '../implementer'

// TODO: Add a proper logging logic. See: https://logtape.org/manual/start
export const loggerMiddleware = os.middleware(async ({ context: { request }, next }) => {
  const { pathname } = new URL(request.url)
  console.log(`${request.method} ${pathname}`)
  return next()
})
