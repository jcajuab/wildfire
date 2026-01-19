import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import {
  type AuthorizationRepository,
  type PermissionRepository,
  type RolePermissionRepository,
  type RoleRepository,
  type UserRepository,
  type UserRoleRepository,
} from "#/application/ports/rbac";
import {
  CreateRoleUseCase,
  CreateUserUseCase,
  DeleteRoleUseCase,
  DeleteUserUseCase,
  GetRolePermissionsUseCase,
  GetRoleUseCase,
  GetUserUseCase,
  ListPermissionsUseCase,
  ListRolesUseCase,
  ListUsersUseCase,
  NotFoundError,
  SetRolePermissionsUseCase,
  SetUserRolesUseCase,
  UpdateRoleUseCase,
  UpdateUserUseCase,
} from "#/application/use-cases/rbac";
import { type JwtUserVariables } from "#/interfaces/http/middleware/jwt-user";
import { createPermissionMiddleware } from "#/interfaces/http/middleware/permissions";
import { errorResponseSchema, notFound } from "#/interfaces/http/responses";
import {
  createRoleSchema,
  createUserSchema,
  setRolePermissionsSchema,
  setUserRolesSchema,
  updateRoleSchema,
  updateUserSchema,
} from "#/interfaces/http/validators/rbac.schema";
import { validateJson } from "#/interfaces/http/validators/standard-validator";

export interface RbacRouterDeps {
  jwtSecret: string;
  repositories: {
    userRepository: UserRepository;
    roleRepository: RoleRepository;
    permissionRepository: PermissionRepository;
    userRoleRepository: UserRoleRepository;
    rolePermissionRepository: RolePermissionRepository;
    authorizationRepository: AuthorizationRepository;
  };
}

export const createRbacRouter = (deps: RbacRouterDeps) => {
  const router = new Hono<{ Variables: JwtUserVariables }>();
  const { jwtMiddleware, requirePermission } = createPermissionMiddleware({
    jwtSecret: deps.jwtSecret,
    authorizationRepository: deps.repositories.authorizationRepository,
  });

  const listRoles = new ListRolesUseCase({
    roleRepository: deps.repositories.roleRepository,
  });
  const createRole = new CreateRoleUseCase({
    roleRepository: deps.repositories.roleRepository,
  });
  const getRole = new GetRoleUseCase({
    roleRepository: deps.repositories.roleRepository,
  });
  const updateRole = new UpdateRoleUseCase({
    roleRepository: deps.repositories.roleRepository,
  });
  const deleteRole = new DeleteRoleUseCase({
    roleRepository: deps.repositories.roleRepository,
  });
  const getRolePermissions = new GetRolePermissionsUseCase({
    roleRepository: deps.repositories.roleRepository,
    rolePermissionRepository: deps.repositories.rolePermissionRepository,
    permissionRepository: deps.repositories.permissionRepository,
  });
  const setRolePermissions = new SetRolePermissionsUseCase({
    roleRepository: deps.repositories.roleRepository,
    rolePermissionRepository: deps.repositories.rolePermissionRepository,
    permissionRepository: deps.repositories.permissionRepository,
  });

  const listPermissions = new ListPermissionsUseCase({
    permissionRepository: deps.repositories.permissionRepository,
  });

  const listUsers = new ListUsersUseCase({
    userRepository: deps.repositories.userRepository,
  });
  const createUser = new CreateUserUseCase({
    userRepository: deps.repositories.userRepository,
  });
  const getUser = new GetUserUseCase({
    userRepository: deps.repositories.userRepository,
  });
  const updateUser = new UpdateUserUseCase({
    userRepository: deps.repositories.userRepository,
  });
  const deleteUser = new DeleteUserUseCase({
    userRepository: deps.repositories.userRepository,
  });
  const setUserRoles = new SetUserRolesUseCase({
    userRepository: deps.repositories.userRepository,
    roleRepository: deps.repositories.roleRepository,
    userRoleRepository: deps.repositories.userRoleRepository,
  });

  router.use("/*", jwtMiddleware);

  router.get(
    "/roles",
    requirePermission("roles:read"),
    describeRoute({
      description: "List roles",
      responses: {
        200: {
          description: "Roles",
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
      const roles = await listRoles.execute();
      return c.json(roles);
    },
  );

  router.post(
    "/roles",
    requirePermission("roles:create"),
    validateJson(createRoleSchema),
    describeRoute({
      description: "Create role",
      responses: {
        201: { description: "Role created" },
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
      const payload = c.req.valid("json");
      const role = await createRole.execute(payload);
      return c.json(role, 201);
    },
  );

  router.get(
    "/roles/:id",
    requirePermission("roles:read"),
    describeRoute({
      description: "Get role",
      responses: {
        200: { description: "Role" },
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
      try {
        const role = await getRole.execute({ id: c.req.param("id") });
        return c.json(role);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.patch(
    "/roles/:id",
    requirePermission("roles:update"),
    validateJson(updateRoleSchema),
    describeRoute({
      description: "Update role",
      responses: {
        200: { description: "Role" },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
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
      const payload = c.req.valid("json");
      try {
        const role = await updateRole.execute({
          id: c.req.param("id"),
          ...payload,
        });
        return c.json(role);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.delete(
    "/roles/:id",
    requirePermission("roles:delete"),
    describeRoute({
      description: "Delete role",
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
      try {
        await deleteRole.execute({ id: c.req.param("id") });
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
    "/roles/:id/permissions",
    requirePermission("roles:read"),
    describeRoute({
      description: "Get role permissions",
      responses: {
        200: { description: "Permissions" },
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
      try {
        const permissions = await getRolePermissions.execute({
          roleId: c.req.param("id"),
        });
        return c.json(permissions);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.put(
    "/roles/:id/permissions",
    requirePermission("roles:update"),
    validateJson(setRolePermissionsSchema),
    describeRoute({
      description: "Set role permissions",
      responses: {
        200: { description: "Permissions updated" },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
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
      const payload = c.req.valid("json");
      try {
        const permissions = await setRolePermissions.execute({
          roleId: c.req.param("id"),
          permissionIds: payload.permissionIds,
        });
        return c.json(permissions);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.get(
    "/permissions",
    requirePermission("roles:read"),
    describeRoute({
      description: "List permissions",
      responses: {
        200: { description: "Permissions" },
      },
    }),
    async (c) => {
      const permissions = await listPermissions.execute();
      return c.json(permissions);
    },
  );

  router.get(
    "/users",
    requirePermission("users:read"),
    describeRoute({
      description: "List users",
      responses: {
        200: { description: "Users" },
      },
    }),
    async (c) => {
      const users = await listUsers.execute();
      return c.json(users);
    },
  );

  router.post(
    "/users",
    requirePermission("users:create"),
    validateJson(createUserSchema),
    describeRoute({
      description: "Create user",
      responses: {
        201: { description: "User created" },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("json");
      const user = await createUser.execute(payload);
      return c.json(user, 201);
    },
  );

  router.get(
    "/users/:id",
    requirePermission("users:read"),
    describeRoute({
      description: "Get user",
      responses: {
        200: { description: "User" },
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
      try {
        const user = await getUser.execute({ id: c.req.param("id") });
        return c.json(user);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.patch(
    "/users/:id",
    requirePermission("users:update"),
    validateJson(updateUserSchema),
    describeRoute({
      description: "Update user",
      responses: {
        200: { description: "User" },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
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
      const payload = c.req.valid("json");
      try {
        const user = await updateUser.execute({
          id: c.req.param("id"),
          ...payload,
        });
        return c.json(user);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.delete(
    "/users/:id",
    requirePermission("users:delete"),
    describeRoute({
      description: "Delete user",
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
      try {
        await deleteUser.execute({ id: c.req.param("id") });
        return c.body(null, 204);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return notFound(c, error.message);
        }
        throw error;
      }
    },
  );

  router.put(
    "/users/:id/roles",
    requirePermission("users:update"),
    validateJson(setUserRolesSchema),
    describeRoute({
      description: "Assign roles to user",
      responses: {
        200: { description: "Roles assigned" },
        400: {
          description: "Invalid request",
          content: {
            "application/json": {
              schema: resolver(errorResponseSchema),
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
      const payload = c.req.valid("json");
      try {
        const roles = await setUserRoles.execute({
          userId: c.req.param("id"),
          roleIds: payload.roleIds,
        });
        return c.json(roles);
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
