import { type StandardSchemaV1 } from "@standard-schema/spec";
import { type Context } from "hono";
import { validator } from "hono-openapi";
import { badRequest } from "#/interfaces/http/responses";

type HookResult = Response | undefined | Promise<Response | undefined>;

export const validateJson = <Schema extends StandardSchemaV1>(schema: Schema) =>
  validator(
    "json",
    schema,
    (result: { success: boolean }, c: Context): HookResult => {
      if (!result.success) {
        return badRequest(c, "Invalid request");
      }
    },
  );
