import { SeedStandardPermissionsUseCase } from "#/application/use-cases/rbac";
import { PermissionDbRepository } from "#/infrastructure/db/repositories/permission.repo";
import "#/env";

const useCase = new SeedStandardPermissionsUseCase({
  permissionRepository: new PermissionDbRepository(),
});

const result = await useCase.execute();
console.log(`Seed standard permissions: ${result.created} created.`);
