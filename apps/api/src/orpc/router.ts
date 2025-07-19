import { createDisplay, findAllDisplay, findDisplayBySlug } from './routes/display.route'

export const router = {
  display: {
    findAll: findAllDisplay,
    findBySlug: findDisplayBySlug,
    create: createDisplay,
  },
}
