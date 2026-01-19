import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { describeRoute, resolver } from "hono-openapi";
import {
  type ContentRepository,
  type ContentStorage,
} from "#/application/ports/content";
import {
  type AuthorizationRepository,
  type UserRepository,
} from "#/application/ports/rbac";
import {
  DeleteContentUseCase,
  GetContentDownloadUrlUseCase,
  GetContentUseCase,
  InvalidContentTypeError,
  ListContentUseCase,
  NotFoundError,
  UploadContentUseCase,
} from "#/application/use-cases/content";
import { createPermissionMiddleware } from "#/interfaces/http/middleware/permissions";
import {
  badRequest,
  errorResponseSchema,
  notFound,
  unauthorized,
} from "#/interfaces/http/responses";
import {
  contentIdParamSchema,
  contentListQuerySchema,
  contentListResponseSchema,
  contentSchema,
  createUploadContentSchema,
  downloadUrlResponseSchema,
} from "#/interfaces/http/validators/content.schema";
import {
  validateForm,
  validateParams,
  validateQuery,
} from "#/interfaces/http/validators/standard-validator";

export interface ContentRouterDeps {
  jwtSecret: string;
  maxUploadBytes: number;
  downloadUrlExpiresInSeconds: number;
  repositories: {
    contentRepository: ContentRepository;
    userRepository: UserRepository;
    authorizationRepository: AuthorizationRepository;
  };
  storage: ContentStorage;
}

export const createContentRouter = (deps: ContentRouterDeps) => {
  const router = new Hono();
  const { jwtMiddleware, requirePermission } = createPermissionMiddleware({
    jwtSecret: deps.jwtSecret,
    authorizationRepository: deps.repositories.authorizationRepository,
  });

  const uploadContent = new UploadContentUseCase({
    contentRepository: deps.repositories.contentRepository,
    contentStorage: deps.storage,
    userRepository: deps.repositories.userRepository,
  });

  const listContent = new ListContentUseCase({
    contentRepository: deps.repositories.contentRepository,
    userRepository: deps.repositories.userRepository,
  });

  const getContent = new GetContentUseCase({
    contentRepository: deps.repositories.contentRepository,
    userRepository: deps.repositories.userRepository,
  });

  const deleteContent = new DeleteContentUseCase({
    contentRepository: deps.repositories.contentRepository,
    contentStorage: deps.storage,
  });

  const getDownloadUrl = new GetContentDownloadUrlUseCase({
    contentRepository: deps.repositories.contentRepository,
    contentStorage: deps.storage,
    expiresInSeconds: deps.downloadUrlExpiresInSeconds,
  });

  const uploadSchema = createUploadContentSchema(deps.maxUploadBytes);

  router.use("/*", jwtMiddleware);

  router.post(
    "/",
    requirePermission("content:create"),
    bodyLimit({ maxSize: deps.maxUploadBytes }),
    validateForm(uploadSchema),
    describeRoute({
      description: "Upload a content file",
      responses: {
        201: {
          description: "Content created",
          content: {
            "application/json": {
              schema: resolver(contentSchema),
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
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("form");
      const jwtPayload = c.get("jwtPayload") as { sub?: string } | undefined;
      const userId = jwtPayload?.sub;

      if (!userId) {
        return unauthorized(c, "Invalid token");
      }

      try {
        const result = await uploadContent.execute({
          title: payload.title,
          file: payload.file,
          createdById: userId,
        });
        return c.json(result, 201);
      } catch (error) {
        if (error instanceof InvalidContentTypeError) {
          return badRequest(c, error.message);
        }
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.get(
    "/",
    requirePermission("content:read"),
    validateQuery(contentListQuerySchema),
    describeRoute({
      description: "List content",
      responses: {
        200: {
          description: "Content list",
          content: {
            "application/json": {
              schema: resolver(contentListResponseSchema),
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
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const query = c.req.valid("query");
      const result = await listContent.execute(query);
      return c.json(result);
    },
  );

  router.get(
    "/:id",
    requirePermission("content:read"),
    validateParams(contentIdParamSchema),
    describeRoute({
      description: "Get content details",
      responses: {
        200: {
          description: "Content details",
          content: {
            "application/json": {
              schema: resolver(contentSchema),
            },
          },
        },
        404: {
          description: "Not found",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      try {
        const result = await getContent.execute({ id: params.id });
        return c.json(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.delete(
    "/:id",
    requirePermission("content:delete"),
    validateParams(contentIdParamSchema),
    describeRoute({
      description: "Delete content",
      responses: {
        204: { description: "Deleted" },
        404: {
          description: "Not found",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      try {
        await deleteContent.execute({ id: params.id });
        return c.body(null, 204);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.get(
    "/:id/file",
    requirePermission("content:read"),
    validateParams(contentIdParamSchema),
    describeRoute({
      description: "Get presigned content download URL",
      responses: {
        200: {
          description: "Download URL",
          content: {
            "application/json": {
              schema: resolver(downloadUrlResponseSchema),
            },
          },
        },
        404: {
          description: "Not found",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const params = c.req.valid("param");
      try {
        const result = await getDownloadUrl.execute({ id: params.id });
        return c.json(result);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  return router;
};
