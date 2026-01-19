import { eq } from "drizzle-orm";
import { type UserRoleRepository } from "#/application/ports/rbac";
import { db } from "#/infrastructure/db/client";
import { userRoles } from "#/infrastructure/db/schema/rbac.sql";

export class UserRoleDbRepository implements UserRoleRepository {
  async listRolesByUserId(
    userId: string,
  ): Promise<{ userId: string; roleId: string }[]> {
    return db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }

  async setUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await db.delete(userRoles).where(eq(userRoles.userId, userId));
    if (roleIds.length === 0) return;
    await db
      .insert(userRoles)
      .values(roleIds.map((roleId) => ({ userId, roleId })));
  }
}
