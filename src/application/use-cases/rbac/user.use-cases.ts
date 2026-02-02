import {
  type RoleRepository,
  type UserRepository,
  type UserRoleRepository,
} from "#/application/ports/rbac";
import { NotFoundError } from "#/application/use-cases/rbac/errors";

export class GetUserRolesUseCase {
  constructor(
    private readonly deps: {
      userRepository: UserRepository;
      userRoleRepository: UserRoleRepository;
      roleRepository: RoleRepository;
    },
  ) {}

  async execute(input: { userId: string }) {
    const user = await this.deps.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError("User not found");

    const assignments = await this.deps.userRoleRepository.listRolesByUserId(
      input.userId,
    );
    const roleIds = assignments.map((a) => a.roleId);
    if (roleIds.length === 0) return [];

    return this.deps.roleRepository.findByIds(roleIds);
  }
}

export class ListUsersUseCase {
  constructor(private readonly deps: { userRepository: UserRepository }) {}

  execute() {
    return this.deps.userRepository.list();
  }
}

export class CreateUserUseCase {
  constructor(private readonly deps: { userRepository: UserRepository }) {}

  execute(input: { email: string; name: string; isActive?: boolean }) {
    return this.deps.userRepository.create({
      email: input.email,
      name: input.name,
      isActive: input.isActive,
    });
  }
}

export class GetUserUseCase {
  constructor(private readonly deps: { userRepository: UserRepository }) {}

  async execute(input: { id: string }) {
    const user = await this.deps.userRepository.findById(input.id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}

export class UpdateUserUseCase {
  constructor(private readonly deps: { userRepository: UserRepository }) {}

  async execute(input: {
    id: string;
    email?: string;
    name?: string;
    isActive?: boolean;
  }) {
    const user = await this.deps.userRepository.update(input.id, {
      email: input.email,
      name: input.name,
      isActive: input.isActive,
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}

export class DeleteUserUseCase {
  constructor(private readonly deps: { userRepository: UserRepository }) {}

  async execute(input: { id: string }) {
    const deleted = await this.deps.userRepository.delete(input.id);
    if (!deleted) throw new NotFoundError("User not found");
  }
}

export class SetUserRolesUseCase {
  constructor(
    private readonly deps: {
      userRepository: UserRepository;
      roleRepository: RoleRepository;
      userRoleRepository: UserRoleRepository;
    },
  ) {}

  async execute(input: { userId: string; roleIds: string[] }) {
    const user = await this.deps.userRepository.findById(input.userId);
    if (!user) throw new NotFoundError("User not found");

    await this.deps.userRoleRepository.setUserRoles(
      input.userId,
      input.roleIds,
    );

    const roles = await this.deps.roleRepository.list();
    return roles.filter((role) => input.roleIds.includes(role.id));
  }
}
