import { describe, expect, test } from "bun:test";
import { SeedSuperAdminRoleUseCase } from "#/application/use-cases/rbac";

const makeStore = () => {
  const store = {
    roles: [] as Array<{
      id: string;
      name: string;
      description: string | null;
      isSystem: boolean;
    }>,
    permissions: [] as Array<{
      id: string;
      resource: string;
      action: string;
    }>,
    rolePermissions: [] as Array<{ roleId: string; permissionId: string }>,
  };

  return {
    store,
    repositories: {
      roleRepository: {
        list: async () => [...store.roles],
        findById: async (id: string) =>
          store.roles.find((role) => role.id === id) ?? null,
        create: async (input: {
          name: string;
          description?: string | null;
          isSystem?: boolean;
        }) => {
          const role = {
            id: `role-${store.roles.length + 1}`,
            name: input.name,
            description: input.description ?? null,
            isSystem: input.isSystem ?? false,
          };
          store.roles.push(role);
          return role;
        },
        update: async () => null,
        delete: async () => false,
      },
      permissionRepository: {
        list: async () => [...store.permissions],
        findByIds: async (ids: string[]) =>
          store.permissions.filter((permission) => ids.includes(permission.id)),
        create: async (input: { resource: string; action: string }) => {
          const permission = {
            id: `perm-${store.permissions.length + 1}`,
            resource: input.resource,
            action: input.action,
          };
          store.permissions.push(permission);
          return permission;
        },
      },
      rolePermissionRepository: {
        listPermissionsByRoleId: async (roleId: string) =>
          store.rolePermissions.filter((item) => item.roleId === roleId),
        setRolePermissions: async (roleId: string, permissionIds: string[]) => {
          store.rolePermissions = store.rolePermissions.filter(
            (item) => item.roleId !== roleId,
          );
          store.rolePermissions.push(
            ...permissionIds.map((permissionId) => ({ roleId, permissionId })),
          );
        },
      },
    },
  };
};

describe("SeedSuperAdminRoleUseCase", () => {
  test("creates Super Admin role and *:manage permission", async () => {
    const { store, repositories } = makeStore();
    const useCase = new SeedSuperAdminRoleUseCase(repositories);

    const result = await useCase.execute();

    expect(result.role.name).toBe("Super Admin");
    expect(result.role.isSystem).toBe(true);
    expect(result.permission.resource).toBe("*");
    expect(result.permission.action).toBe("manage");
    expect(store.rolePermissions.length).toBe(1);
  });

  test("is idempotent when role and permission already exist", async () => {
    const { store, repositories } = makeStore();
    const useCase = new SeedSuperAdminRoleUseCase(repositories);

    await useCase.execute();
    const second = await useCase.execute();

    expect(store.roles.length).toBe(1);
    expect(store.permissions.length).toBe(1);
    expect(store.rolePermissions.length).toBe(1);
    expect(second.created.role).toBe(false);
    expect(second.created.permission).toBe(false);
  });
});
