import { ForbiddenError } from "#/application/errors/forbidden";
import {
  type PermissionRepository,
  type RolePermissionRepository,
  type RoleRepository,
  type UserRepository,
  type UserRoleRepository,
} from "#/application/ports/rbac";
import { NotFoundError } from "#/application/use-cases/rbac/errors";

export class ListRolesUseCase {
  constructor(private readonly deps: { roleRepository: RoleRepository }) {}

  execute() {
    return this.deps.roleRepository.list();
  }
}

export class CreateRoleUseCase {
  constructor(private readonly deps: { roleRepository: RoleRepository }) {}

  execute(input: { name: string; description?: string | null }) {
    return this.deps.roleRepository.create({
      name: input.name,
      description: input.description ?? null,
    });
  }
}

export class GetRoleUseCase {
  constructor(private readonly deps: { roleRepository: RoleRepository }) {}

  async execute(input: { id: string }) {
    const role = await this.deps.roleRepository.findById(input.id);
    if (!role) throw new NotFoundError("Role not found");
    return role;
  }
}

export class UpdateRoleUseCase {
  constructor(private readonly deps: { roleRepository: RoleRepository }) {}

  async execute(input: {
    id: string;
    name?: string;
    description?: string | null;
  }) {
    const role = await this.deps.roleRepository.update(input.id, {
      name: input.name,
      description: input.description,
    });
    if (!role) throw new NotFoundError("Role not found");
    return role;
  }
}

export class DeleteRoleUseCase {
  constructor(private readonly deps: { roleRepository: RoleRepository }) {}

  async execute(input: { id: string }) {
    const role = await this.deps.roleRepository.findById(input.id);
    if (!role) throw new NotFoundError("Role not found");
    if (role.isSystem) {
      throw new ForbiddenError("Cannot delete system role");
    }
    const deleted = await this.deps.roleRepository.delete(input.id);
    if (!deleted) throw new NotFoundError("Role not found");
  }
}

export class GetRolePermissionsUseCase {
  constructor(
    private readonly deps: {
      roleRepository: RoleRepository;
      rolePermissionRepository: RolePermissionRepository;
      permissionRepository: PermissionRepository;
    },
  ) {}

  async execute(input: { roleId: string }) {
    const role = await this.deps.roleRepository.findById(input.roleId);
    if (!role) throw new NotFoundError("Role not found");

    const rolePermissions =
      await this.deps.rolePermissionRepository.listPermissionsByRoleId(
        input.roleId,
      );
    const permissionIds = rolePermissions.map((item) => item.permissionId);
    return this.deps.permissionRepository.findByIds(permissionIds);
  }
}

export class SetRolePermissionsUseCase {
  constructor(
    private readonly deps: {
      roleRepository: RoleRepository;
      rolePermissionRepository: RolePermissionRepository;
      permissionRepository: PermissionRepository;
    },
  ) {}

  async execute(input: { roleId: string; permissionIds: string[] }) {
    const role = await this.deps.roleRepository.findById(input.roleId);
    if (!role) throw new NotFoundError("Role not found");

    await this.deps.rolePermissionRepository.setRolePermissions(
      input.roleId,
      input.permissionIds,
    );

    return this.deps.permissionRepository.findByIds(input.permissionIds);
  }
}

export class GetRoleUsersUseCase {
  constructor(
    private readonly deps: {
      roleRepository: RoleRepository;
      userRoleRepository: UserRoleRepository;
      userRepository: UserRepository;
    },
  ) {}

  async execute(input: { roleId: string }) {
    const role = await this.deps.roleRepository.findById(input.roleId);
    if (!role) throw new NotFoundError("Role not found");

    const userIds = await this.deps.userRoleRepository.listUserIdsByRoleId(
      input.roleId,
    );
    if (userIds.length === 0) return [];

    return this.deps.userRepository.findByIds(userIds);
  }
}
