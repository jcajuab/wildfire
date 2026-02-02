/**
 * Assigns the "Super Admin" role to a user by email so they have all permissions (*:manage).
 * Usage: SEED_USER_EMAIL=test@example.com bun run src/infrastructure/db/seeds/assign-super-admin-to-user.ts
 * Default email: test@example.com
 */
import { SetUserRolesUseCase } from "#/application/use-cases/rbac";
import { RoleDbRepository } from "#/infrastructure/db/repositories/role.repo";
import { UserDbRepository } from "#/infrastructure/db/repositories/user.repo";
import { UserRoleDbRepository } from "#/infrastructure/db/repositories/user-role.repo";
import "#/env";

const SUPER_ADMIN_ROLE_NAME = "Super Admin";
const defaultEmail = "test@example.com";
const email =
  (process.env.SEED_USER_EMAIL as string | undefined)?.trim() || defaultEmail;

const userRepository = new UserDbRepository();
const roleRepository = new RoleDbRepository();
const userRoleRepository = new UserRoleDbRepository();

const user = await userRepository.findByEmail(email);
if (!user) {
  console.error(`User not found: ${email}`);
  process.exit(1);
}

const roles = await roleRepository.list();
const superAdmin = roles.find((r) => r.name === SUPER_ADMIN_ROLE_NAME);
if (!superAdmin) {
  console.error(
    `Role "${SUPER_ADMIN_ROLE_NAME}" not found. Run seed:super-admin first.`,
  );
  process.exit(1);
}

const setUserRoles = new SetUserRolesUseCase({
  userRepository,
  roleRepository,
  userRoleRepository,
});

// Assign only Super Admin (replace existing roles with just this one)
await setUserRoles.execute({
  userId: user.id,
  roleIds: [superAdmin.id],
});

console.log(
  `Assigned role "${SUPER_ADMIN_ROLE_NAME}" to ${email} (${user.id}).`,
);
