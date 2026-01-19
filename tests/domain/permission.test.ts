import { describe, expect, test } from "bun:test";
import { Permission } from "#/domain/rbac/permission";

describe("Permission", () => {
  test("parses resource:action", () => {
    const permission = Permission.parse("content:read");

    expect(permission.resource).toBe("content");
    expect(permission.action).toBe("read");
  });

  test("throws on invalid format", () => {
    expect(() => Permission.parse("invalid")).toThrow(
      "Permission must be in resource:action format",
    );
  });

  test("matches exact permission", () => {
    const owned = Permission.parse("content:read");
    const required = Permission.parse("content:read");

    expect(owned.matches(required)).toBe(true);
  });

  test("manage on resource allows any action on resource", () => {
    const owned = Permission.parse("content:manage");
    const required = Permission.parse("content:delete");

    expect(owned.matches(required)).toBe(true);
  });

  test("wildcard manage allows any resource action", () => {
    const owned = Permission.parse("*:manage");
    const required = Permission.parse("users:update");

    expect(owned.matches(required)).toBe(true);
  });

  test("wildcard read allows read on any resource", () => {
    const owned = Permission.parse("*:read");
    const required = Permission.parse("content:read");

    expect(owned.matches(required)).toBe(true);
    expect(owned.matches(Permission.parse("content:update"))).toBe(false);
  });
});
