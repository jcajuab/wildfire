import {
  type PermissionRepository,
  type RolePermissionRepository,
  type RoleRepository,
} from "#/application/ports/rbac";

interface SeedSuperAdminDeps {
  roleRepository: RoleRepository;
  permissionRepository: PermissionRepository;
  rolePermissionRepository: RolePermissionRepository;
}

const SUPER_ADMIN_ROLE = "Super Admin";
const SUPER_ADMIN_PERMISSION = { resource: "*", action: "manage" };

export class SeedSuperAdminRoleUseCase {
  constructor(private readonly deps: SeedSuperAdminDeps) {}

  async execute(): Promise<{
    role: {
      id: string;
      name: string;
      description: string | null;
      isSystem: boolean;
    };
    permission: { id: string; resource: string; action: string };
    created: { role: boolean; permission: boolean; assignment: boolean };
  }> {
    const roles = await this.deps.roleRepository.list();
    let role = roles.find((item) => item.name === SUPER_ADMIN_ROLE) ?? null;
    let createdRole = false;

    if (!role) {
      role = await this.deps.roleRepository.create({
        name: SUPER_ADMIN_ROLE,
        description: "All access",
        isSystem: true,
      });
      createdRole = true;
    }

    const permissions = await this.deps.permissionRepository.list();
    let permission =
      permissions.find(
        (item) =>
          item.resource === SUPER_ADMIN_PERMISSION.resource &&
          item.action === SUPER_ADMIN_PERMISSION.action,
      ) ?? null;
    let createdPermission = false;

    if (!permission) {
      permission = await this.deps.permissionRepository.create(
        SUPER_ADMIN_PERMISSION,
      );
      createdPermission = true;
    }

    const existingAssignments =
      await this.deps.rolePermissionRepository.listPermissionsByRoleId(role.id);
    const permissionIds = new Set(
      existingAssignments.map((item) => item.permissionId),
    );

    let assignmentChanged = false;
    if (!permissionIds.has(permission.id)) {
      permissionIds.add(permission.id);
      await this.deps.rolePermissionRepository.setRolePermissions(
        role.id,
        Array.from(permissionIds),
      );
      assignmentChanged = true;
    }

    return {
      role,
      permission,
      created: {
        role: createdRole,
        permission: createdPermission,
        assignment: assignmentChanged,
      },
    };
  }
}
