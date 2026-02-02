import { type PermissionRepository } from "#/application/ports/rbac";

const STANDARD_RESOURCE_ACTIONS: ReadonlyArray<{
  resource: string;
  action: string;
}> = [
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

interface SeedStandardPermissionsDeps {
  permissionRepository: PermissionRepository;
}

export class SeedStandardPermissionsUseCase {
  constructor(private readonly deps: SeedStandardPermissionsDeps) {}

  async execute(): Promise<{ created: number }> {
    const existing = await this.deps.permissionRepository.list();
    const existingKey = new Set(
      existing.map((p) => `${p.resource}:${p.action}`),
    );

    let created = 0;
    for (const { resource, action } of STANDARD_RESOURCE_ACTIONS) {
      const key = `${resource}:${action}`;
      if (existingKey.has(key)) continue;

      await this.deps.permissionRepository.create({ resource, action });
      existingKey.add(key);
      created += 1;
    }

    return { created };
  }
}
