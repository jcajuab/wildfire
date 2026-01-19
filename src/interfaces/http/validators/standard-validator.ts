import { type StandardSchemaV1 } from "@standard-schema/spec";
import { type Context } from "hono";
import { validator } from "hono-openapi";
import { badRequest } from "#/interfaces/http/responses";

type HookResult = Response | undefined | Promise<Response | undefined>;

const validationHook = (
  result: { success: boolean },
  c: Context,
): HookResult => {
  if (!result.success) {
    return badRequest(c, "Invalid request");
  }
};

export const validateJson = <Schema extends StandardSchemaV1>(schema: Schema) =>
  validator("json", schema, validationHook);

export const validateForm = <Schema extends StandardSchemaV1>(schema: Schema) =>
  validator("form", schema, validationHook);

export const validateQuery = <Schema extends StandardSchemaV1>(
  schema: Schema,
) => validator("query", schema, validationHook);

export const validateParams = <Schema extends StandardSchemaV1>(
  schema: Schema,
) => validator("param", schema, validationHook);
