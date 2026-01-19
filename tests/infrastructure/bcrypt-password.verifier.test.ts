import { describe, expect, test } from "bun:test";
import { BcryptPasswordVerifier } from "#/infrastructure/auth/bcrypt-password.verifier";

const sampleHash =
  "$2y$05$/DOLvW/Ik.IObiHeAhCaEeHEbfZBozBvHihclOISfRAG4kKu4MuFe";

describe("BcryptPasswordVerifier", () => {
  test("verifies a valid password against a $2y$ hash", async () => {
    const verifier = new BcryptPasswordVerifier();
    const result = await verifier.verify({
      password: "xc4uuicX",
      passwordHash: sampleHash,
    });

    expect(result).toBe(true);
  });

  test("returns false for an invalid password", async () => {
    const verifier = new BcryptPasswordVerifier();
    const result = await verifier.verify({
      password: "wrong",
      passwordHash: sampleHash,
    });

    expect(result).toBe(false);
  });
});
