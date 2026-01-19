import { SeedSuperAdminRoleUseCase } from "#/application/use-cases/rbac";
import { PermissionDbRepository } from "#/infrastructure/db/repositories/permission.repo";
import { RoleDbRepository } from "#/infrastructure/db/repositories/role.repo";
import { RolePermissionDbRepository } from "#/infrastructure/db/repositories/role-permission.repo";
import "#/env";

const useCase = new SeedSuperAdminRoleUseCase({
  roleRepository: new RoleDbRepository(),
  permissionRepository: new PermissionDbRepository(),
  rolePermissionRepository: new RolePermissionDbRepository(),
});

await useCase.execute();
