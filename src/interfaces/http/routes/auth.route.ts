import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";
import {
  AuthenticateUserUseCase,
  InvalidCredentialsError,
  RefreshTokenUseCase,
} from "#/application/use-cases/auth";
import { env } from "#/env";
import { BcryptPasswordVerifier } from "#/infrastructure/auth/bcrypt-password.verifier";
import { HtshadowCredentialsRepository } from "#/infrastructure/auth/htshadow.repo";
import { createJwtMiddleware, JwtTokenIssuer } from "#/infrastructure/auth/jwt";
import { SystemClock } from "#/infrastructure/time/system.clock";
import {
  badRequest,
  errorResponseSchema,
  unauthorized,
} from "#/interfaces/http/responses";
import { authLoginSchema } from "#/interfaces/http/validators/auth.schema";

export const authRouter = new Hono();

const tokenTtlSeconds = 60 * 60;
const credentialsRepository = new HtshadowCredentialsRepository({
  filePath: env.HTSHADOW_PATH,
});
const passwordVerifier = new BcryptPasswordVerifier();
const tokenIssuer = new JwtTokenIssuer({
  secret: env.JWT_SECRET,
  issuer: env.JWT_ISSUER,
});
const clock = new SystemClock();

const authenticateUser = new AuthenticateUserUseCase({
  credentialsRepository,
  passwordVerifier,
  tokenIssuer,
  clock,
  tokenTtlSeconds,
  issuer: env.JWT_ISSUER,
});

const refreshToken = new RefreshTokenUseCase({
  tokenIssuer,
  clock,
  tokenTtlSeconds,
  issuer: env.JWT_ISSUER,
});

const authResponseSchema = z.object({
  token: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number(),
  user: z.object({ username: z.string() }),
});

const jwtMiddleware = createJwtMiddleware(env.JWT_SECRET);

authRouter.post(
  "/login",
  describeRoute({
    description: "Authenticate user credentials and issue JWT",
    responses: {
      200: {
        description: "Authenticated",
        content: {
          "application/json": {
            schema: resolver(authResponseSchema),
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const payload = await c.req.json().catch(() => null);
    const parsed = authLoginSchema.safeParse(payload);
    if (!parsed.success) {
      return badRequest(c, "Invalid request");
    }

    try {
      const result = await authenticateUser.execute(parsed.data);
      return c.json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return unauthorized(c, error.message);
      }

      throw error;
    }
  },
);

authRouter.get(
  "/me",
  jwtMiddleware,
  describeRoute({
    description: "Get current user and refresh JWT",
    responses: {
      200: {
        description: "Authenticated user",
        content: {
          "application/json": {
            schema: resolver(authResponseSchema),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const jwtPayload = c.get("jwtPayload") as { sub?: string } | undefined;
    const username = jwtPayload?.sub;

    if (!username) {
      return unauthorized(c, "Invalid token");
    }

    const result = await refreshToken.execute({ username });
    return c.json(result);
  },
);

authRouter.post(
  "/logout",
  jwtMiddleware,
  describeRoute({
    description: "Logout current user (no-op)",
    responses: {
      204: {
        description: "Logged out",
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
    },
  }),
  (c) => c.body(null, 204),
);
