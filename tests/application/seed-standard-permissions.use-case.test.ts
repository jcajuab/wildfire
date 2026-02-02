import { describe, expect, test } from "bun:test";
import { SeedStandardPermissionsUseCase } from "#/application/use-cases/rbac";

const STANDARD_RESOURCE_ACTIONS = [
  { resource: "content", action: "read" },
  { resource: "content", action: "create" },
  { resource: "content", action: "update" },
  { resource: "content", action: "delete" },
  { resource: "playlists", action: "read" },
  { resource: "playlists", action: "create" },
  { resource: "playlists", action: "update" },
  { resource: "playlists", action: "delete" },
  { resource: "schedules", action: "read" },
  { resource: "schedules", action: "create" },
  { resource: "schedules", action: "update" },
  { resource: "schedules", action: "delete" },
  { resource: "devices", action: "read" },
  { resource: "devices", action: "create" },
  { resource: "devices", action: "update" },
  { resource: "devices", action: "delete" },
  { resource: "users", action: "read" },
  { resource: "users", action: "create" },
  { resource: "users", action: "update" },
  { resource: "users", action: "delete" },
  { resource: "roles", action: "read" },
  { resource: "roles", action: "create" },
  { resource: "roles", action: "update" },
  { resource: "roles", action: "delete" },
];

const makeStore = () => {
  const store = {
    permissions: [] as Array<{
      id: string;
      resource: string;
      action: string;
    }>,
  };

  return {
    store,
    permissionRepository: {
      list: async () => [...store.permissions],
      findByIds: async (ids: string[]) =>
        store.permissions.filter((p) => ids.includes(p.id)),
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
  };
};

describe("SeedStandardPermissionsUseCase", () => {
  test("creates all standard resource:action permissions", async () => {
    const { store, permissionRepository } = makeStore();
    const useCase = new SeedStandardPermissionsUseCase({
      permissionRepository,
    });

    const result = await useCase.execute();

    expect(result.created).toBe(STANDARD_RESOURCE_ACTIONS.length);
    expect(store.permissions.length).toBe(STANDARD_RESOURCE_ACTIONS.length);

    for (const { resource, action } of STANDARD_RESOURCE_ACTIONS) {
      const found = store.permissions.find(
        (p) => p.resource === resource && p.action === action,
      );
      expect(found).toBeDefined();
    }
  });

  test("is idempotent when permissions already exist", async () => {
    const { store, permissionRepository } = makeStore();
    const useCase = new SeedStandardPermissionsUseCase({
      permissionRepository,
    });

    await useCase.execute();
    const second = await useCase.execute();

    expect(store.permissions.length).toBe(STANDARD_RESOURCE_ACTIONS.length);
    expect(second.created).toBe(0);
  });
});
