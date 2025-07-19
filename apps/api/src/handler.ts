import { file } from 'bun'

import { handler as orpc } from './orpc/handler'

const staticDir = new URL('./static/', import.meta.url)

const spaFileUrl = new URL('index.html', staticDir)
const spaFile = file(spaFileUrl)

export async function handler(request: Request): Promise<Response> {
  const { matched, response } = await orpc.handle(request, {
    prefix: '/api',
    context: {
      request,
    },
  })

  if (matched) {
    return response
  }

  const { pathname } = new URL(request.url)

  const requestedFileUrl = new URL(`.${pathname}`, staticDir)
  const requestedFile = file(requestedFileUrl)

  if (await requestedFile.exists()) {
    return new Response(requestedFile)
  }

  return new Response(spaFile)
}
