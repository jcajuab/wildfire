import { type PermissionRepository } from "#/application/ports/rbac";

export class ListPermissionsUseCase {
  constructor(
    private readonly deps: { permissionRepository: PermissionRepository },
  ) {}

  execute() {
    return this.deps.permissionRepository.list();
  }
}
