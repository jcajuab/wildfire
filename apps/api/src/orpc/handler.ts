import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { CORSPlugin } from '@orpc/server/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'

import packageJSON from '../../package.json' with { type: 'json' }
import { router } from './router'

const zodToJsonSchemaConverter = new ZodToJsonSchemaConverter()

export const handler = new OpenAPIHandler(router, {
  interceptors: [],
  plugins: [
    new CORSPlugin({
      exposeHeaders: ['Content-Disposition'],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [zodToJsonSchemaConverter],
      specGenerateOptions: {
        info: {
          title: 'WILDFIRE | API Reference',
          version: packageJSON.version,
        },
      },
      // References: https://guides.scalar.com/scalar/scalar-api-references/configuration#list-of-all-attributes
      docsConfig: {
        theme: 'deepSpace',
        hideClientButton: true,
      },
      docsTitle: 'WILDFIRE | API Reference',
    }),
    new SmartCoercionPlugin({
      schemaConverters: [zodToJsonSchemaConverter],
    }),
  ],
})
