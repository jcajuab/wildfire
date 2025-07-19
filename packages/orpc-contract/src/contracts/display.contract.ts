import { oc } from '@orpc/contract'
import { InsertDisplaySchema, PaginationSchema, SelectDisplaySchema } from '@wildfire/zod-schemas'
import { status } from 'http-status'
import { z } from 'zod'

export const findAllDisplayContract = oc
  .route({ method: 'GET', path: '/' })
  .input(PaginationSchema)
  .output(z.array(SelectDisplaySchema))

export const findDisplayBySlugContract = oc
  .route({ method: 'GET', path: '/{slug}' })
  .errors({
    NOT_FOUND: {
      data: SelectDisplaySchema.pick({ slug: true }),
    },
  })
  .input(SelectDisplaySchema.pick({ slug: true }))
  .output(SelectDisplaySchema)

export const createDisplayContract = oc
  .route({ method: 'POST', path: '/', successStatus: status.CREATED })
  .errors({
    CONFLICT: {
      data: SelectDisplaySchema.pick({ slug: true }),
    },
  })
  .input(InsertDisplaySchema)
  .output(SelectDisplaySchema.pick({ id: true }))
