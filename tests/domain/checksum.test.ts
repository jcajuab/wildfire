import { describe, expect, test } from "bun:test";
import { sha256Hex } from "#/domain/content/checksum";

describe("sha256Hex", () => {
  test("returns sha-256 hex digest for input", async () => {
    const data = new TextEncoder().encode("hello").buffer;
    const digest = await sha256Hex(data);

    expect(digest).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });
});
