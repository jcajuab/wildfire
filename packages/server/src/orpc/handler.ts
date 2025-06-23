import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import {
  experimental_ZodSmartCoercionPlugin as ZodSmartCoercionPlugin,
  experimental_ZodToJsonSchemaConverter as ZodToJsonSchemaConverter,
} from "@orpc/zod/zod4";
import { router } from "@/orpc/routes";

// TODO https://orpc.unnoq.com/docs/openapi/client/openapi-link#cors-policy
export const handler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "WILDFIRE API",
          version: "0.1.0",
        },
      },
    }),
    new ZodSmartCoercionPlugin(),
  ],
});
