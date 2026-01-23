import { describe, expect, test } from "bun:test";
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

describe("RBAC use cases", () => {
  test("ListUsersUseCase returns user list", async () => {
    const useCase = new ListUsersUseCase({
      userRepository: {
        list: async () => [
          {
            id: "user-1",
            email: "user@example.com",
            name: "User",
            isActive: true,
          },
        ],
      } as never,
    });

    await expect(useCase.execute()).resolves.toEqual([
      { id: "user-1", email: "user@example.com", name: "User", isActive: true },
    ]);
  });

  test("CreateUserUseCase delegates to repository", async () => {
    const useCase = new CreateUserUseCase({
      userRepository: {
        create: async (input: {
          email: string;
          name: string;
          isActive?: boolean;
        }) => ({ id: "user-1", ...input, isActive: true }),
      } as never,
    });

    await expect(
      useCase.execute({ email: "test@example.com", name: "Test" }),
    ).resolves.toEqual({
      id: "user-1",
      email: "test@example.com",
      name: "Test",
      isActive: true,
    });
  });

  test("GetUserUseCase throws when user missing", async () => {
    const useCase = new GetUserUseCase({
      userRepository: { findById: async () => null } as never,
    });

    await expect(useCase.execute({ id: "user-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("UpdateUserUseCase throws when user missing", async () => {
    const useCase = new UpdateUserUseCase({
      userRepository: { update: async () => null } as never,
    });

    await expect(useCase.execute({ id: "user-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("DeleteUserUseCase throws when user missing", async () => {
    const useCase = new DeleteUserUseCase({
      userRepository: { delete: async () => false } as never,
    });

    await expect(useCase.execute({ id: "user-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("SetUserRolesUseCase returns assigned roles", async () => {
    const useCase = new SetUserRolesUseCase({
      userRepository: { findById: async () => ({ id: "user-1" }) } as never,
      roleRepository: {
        list: async () => [
          { id: "role-1", name: "Admin", description: null, isSystem: false },
          { id: "role-2", name: "Viewer", description: null, isSystem: false },
        ],
      } as never,
      userRoleRepository: {
        setUserRoles: async () => undefined,
      } as never,
    });

    await expect(
      useCase.execute({ userId: "user-1", roleIds: ["role-2"] }),
    ).resolves.toEqual([
      { id: "role-2", name: "Viewer", description: null, isSystem: false },
    ]);
  });

  test("ListRolesUseCase returns roles", async () => {
    const useCase = new ListRolesUseCase({
      roleRepository: {
        list: async () => [
          {
            id: "role-1",
            name: "Admin",
            description: null,
            isSystem: false,
          },
        ],
      } as never,
    });

    await expect(useCase.execute()).resolves.toEqual([
      { id: "role-1", name: "Admin", description: null, isSystem: false },
    ]);
  });

  test("CreateRoleUseCase uses null description default", async () => {
    const useCase = new CreateRoleUseCase({
      roleRepository: {
        create: async (input: {
          name: string;
          description?: string | null;
        }) => ({
          id: "role-1",
          name: input.name,
          description: input.description ?? null,
          isSystem: false,
        }),
      } as never,
    });

    await expect(useCase.execute({ name: "Editor" })).resolves.toEqual({
      id: "role-1",
      name: "Editor",
      description: null,
      isSystem: false,
    });
  });

  test("GetRoleUseCase throws when role missing", async () => {
    const useCase = new GetRoleUseCase({
      roleRepository: { findById: async () => null } as never,
    });

    await expect(useCase.execute({ id: "role-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("UpdateRoleUseCase throws when role missing", async () => {
    const useCase = new UpdateRoleUseCase({
      roleRepository: { update: async () => null } as never,
    });

    await expect(useCase.execute({ id: "role-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("DeleteRoleUseCase throws when role missing", async () => {
    const useCase = new DeleteRoleUseCase({
      roleRepository: { delete: async () => false } as never,
    });

    await expect(useCase.execute({ id: "role-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  test("GetRolePermissionsUseCase returns permissions", async () => {
    const useCase = new GetRolePermissionsUseCase({
      roleRepository: { findById: async () => ({ id: "role-1" }) } as never,
      rolePermissionRepository: {
        listPermissionsByRoleId: async () => [
          { roleId: "role-1", permissionId: "perm-1" },
        ],
      } as never,
      permissionRepository: {
        findByIds: async () => [
          { id: "perm-1", resource: "content", action: "read" },
        ],
      } as never,
    });

    await expect(useCase.execute({ roleId: "role-1" })).resolves.toEqual([
      { id: "perm-1", resource: "content", action: "read" },
    ]);
  });

  test("SetRolePermissionsUseCase returns assigned permissions", async () => {
    const useCase = new SetRolePermissionsUseCase({
      roleRepository: { findById: async () => ({ id: "role-1" }) } as never,
      rolePermissionRepository: {
        setRolePermissions: async () => undefined,
      } as never,
      permissionRepository: {
        findByIds: async () => [
          { id: "perm-1", resource: "content", action: "read" },
        ],
      } as never,
    });

    await expect(
      useCase.execute({ roleId: "role-1", permissionIds: ["perm-1"] }),
    ).resolves.toEqual([{ id: "perm-1", resource: "content", action: "read" }]);
  });

  test("ListPermissionsUseCase returns permissions", async () => {
    const useCase = new ListPermissionsUseCase({
      permissionRepository: {
        list: async () => [
          { id: "perm-1", resource: "content", action: "read" },
        ],
      } as never,
    });

    await expect(useCase.execute()).resolves.toEqual([
      { id: "perm-1", resource: "content", action: "read" },
    ]);
  });
});
