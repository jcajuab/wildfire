import { type MiddlewareHandler } from "hono";
import { type AuthorizationRepository } from "#/application/ports/rbac";
import { CheckPermissionUseCase } from "#/application/use-cases/rbac";
import { createJwtMiddleware } from "#/infrastructure/auth/jwt";
import { forbidden, unauthorized } from "#/interfaces/http/responses";

export const createPermissionMiddleware = (deps: {
  jwtSecret: string;
  authorizationRepository: AuthorizationRepository;
}) => {
  const jwtMiddleware = createJwtMiddleware(deps.jwtSecret);
  const checkPermission = new CheckPermissionUseCase({
    authorizationRepository: deps.authorizationRepository,
  });

  const requirePermission = (permission: string): MiddlewareHandler => {
    return async (c, next) => {
      const jwtPayload = c.get("jwtPayload") as { sub?: string } | undefined;
      if (!jwtPayload?.sub) {
        return unauthorized(c, "Invalid token");
      }

      const allowed = await checkPermission.execute({
        userId: jwtPayload.sub,
        required: permission,
      });

      if (!allowed) {
        return forbidden(c, "Forbidden");
      }

      await next();
    };
  };

  return { jwtMiddleware, requirePermission };
};
