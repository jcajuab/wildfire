import { eq, inArray } from "drizzle-orm";
import { type AuthorizationRepository } from "#/application/ports/rbac";
import { Permission } from "#/domain/rbac/permission";
import { db } from "#/infrastructure/db/client";
import {
  permissions,
  rolePermissions,
  userRoles,
} from "#/infrastructure/db/schema/rbac.sql";

export class AuthorizationDbRepository implements AuthorizationRepository {
  async findPermissionsForUser(userId: string): Promise<Permission[]> {
    const userRoleRows = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    const roleIds = userRoleRows.map((row) => row.roleId);
    if (roleIds.length === 0) return [];

    const rolePermissionRows = await db
      .select()
      .from(rolePermissions)
      .where(inArray(rolePermissions.roleId, roleIds));

    const permissionIds = rolePermissionRows.map((row) => row.permissionId);
    if (permissionIds.length === 0) return [];

    const permissionRows = await db
      .select()
      .from(permissions)
      .where(inArray(permissions.id, permissionIds));

    return permissionRows.map((permission) =>
      Permission.parse(`${permission.resource}:${permission.action}`),
    );
  }
}
