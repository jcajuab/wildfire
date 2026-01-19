import { type MiddlewareHandler } from "hono";
import { type RequestIdVariables, requestId } from "hono/request-id";

export { requestId };

export const requestLogger: MiddlewareHandler<{
  Variables: RequestIdVariables;
}> = async (c, next) => {
  const start = Date.now();
  await next();
  const requestId = c.get("requestId");
  const durationMs = Date.now() - start;
  const status = c.res.status;
  const method = c.req.method;
  const path = c.req.path;

  console.log(
    JSON.stringify({
      requestId,
      method,
      path,
      status,
      durationMs,
    }),
  );
};
