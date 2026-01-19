import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { type RequestIdVariables } from "hono/request-id";
import { openAPIRouteHandler } from "hono-openapi";
import { env } from "#/env";
import { BcryptPasswordVerifier } from "#/infrastructure/auth/bcrypt-password.verifier";
import { HtshadowCredentialsRepository } from "#/infrastructure/auth/htshadow.repo";
import { JwtTokenIssuer } from "#/infrastructure/auth/jwt";
import { AuthorizationDbRepository } from "#/infrastructure/db/repositories/authorization.repo";
import { PermissionDbRepository } from "#/infrastructure/db/repositories/permission.repo";
import { RoleDbRepository } from "#/infrastructure/db/repositories/role.repo";
import { RolePermissionDbRepository } from "#/infrastructure/db/repositories/role-permission.repo";
import { UserDbRepository } from "#/infrastructure/db/repositories/user.repo";
import { UserRoleDbRepository } from "#/infrastructure/db/repositories/user-role.repo";
import { SystemClock } from "#/infrastructure/time/system.clock";
import {
  requestId,
  requestLogger,
} from "#/interfaces/http/middleware/observability";
import { createAuthRouter } from "#/interfaces/http/routes/auth.route";
import { contentRouter } from "#/interfaces/http/routes/content.route";
import { devicesRouter } from "#/interfaces/http/routes/devices.route";
import { healthRouter } from "#/interfaces/http/routes/health.route";
import { playlistsRouter } from "#/interfaces/http/routes/playlists.route";
import { createRbacRouter } from "#/interfaces/http/routes/rbac.route";
import { schedulesRouter } from "#/interfaces/http/routes/schedules.route";
import packageJSON from "#/package.json" with { type: "json" };

export const app = new Hono<{ Variables: RequestIdVariables }>();

app.use("*", requestId());
app.use("*", requestLogger);

const tokenTtlSeconds = 60 * 60;
const authRouter = createAuthRouter({
  credentialsRepository: new HtshadowCredentialsRepository({
    filePath: env.HTSHADOW_PATH,
  }),
  passwordVerifier: new BcryptPasswordVerifier(),
  tokenIssuer: new JwtTokenIssuer({
    secret: env.JWT_SECRET,
    issuer: env.JWT_ISSUER,
  }),
  clock: new SystemClock(),
  userRepository: new UserDbRepository(),
  tokenTtlSeconds,
  issuer: env.JWT_ISSUER,
  jwtSecret: env.JWT_SECRET,
});

app.route("/", healthRouter);
app.route("/auth", authRouter);
app.route("/content", contentRouter);
app.route("/playlists", playlistsRouter);
app.route("/schedules", schedulesRouter);
app.route("/devices", devicesRouter);

const rbacRouter = createRbacRouter({
  jwtSecret: env.JWT_SECRET,
  repositories: {
    userRepository: new UserDbRepository(),
    roleRepository: new RoleDbRepository(),
    permissionRepository: new PermissionDbRepository(),
    userRoleRepository: new UserRoleDbRepository(),
    rolePermissionRepository: new RolePermissionDbRepository(),
    authorizationRepository: new AuthorizationDbRepository(),
  },
});

app.route("/", rbacRouter);

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: `${packageJSON.name.toUpperCase()} API Reference`,
        description: packageJSON.description,
        version: packageJSON.version,
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
    },
  }),
);

app.get("/docs", Scalar({ url: "/openapi.json" }));
