import { oc } from '@orpc/contract'

import {
  createDisplayContract,
  findAllDisplayContract,
  findDisplayBySlugContract,
} from './contracts/display.contract'

export const contract = {
  display: oc.prefix('/displays').tag('Display Management').router({
    findAll: findAllDisplayContract,
    findBySlug: findDisplayBySlugContract,
    create: createDisplayContract,
  }),
}
