import { describe, expect, test } from "bun:test";
import { RefreshTokenUseCase } from "#/application/use-cases/auth";

const tokenTtlSeconds = 60 * 60;

describe("RefreshTokenUseCase", () => {
  test("issues a refreshed token with new exp", async () => {
    const issued: { subject?: string; issuedAt?: number; expiresAt?: number } =
      {};

    const useCase = new RefreshTokenUseCase({
      tokenIssuer: {
        issueToken: async ({ subject, issuedAt, expiresAt }: any) => {
          issued.subject = subject;
          issued.issuedAt = issuedAt;
          issued.expiresAt = expiresAt;
          return `${subject}:${issuedAt}:${expiresAt}`;
        },
      },
      clock: {
        nowSeconds: () => 1_700_000_000,
      },
      tokenTtlSeconds,
    });

    const result = await useCase.execute({ username: "test1" });

    expect(result).toEqual({
      token: "test1:1700000000:1700003600",
      tokenType: "Bearer",
      expiresIn: tokenTtlSeconds,
      user: { username: "test1" },
    });
    expect(issued).toEqual({
      subject: "test1",
      issuedAt: 1_700_000_000,
      expiresAt: 1_700_000_000 + tokenTtlSeconds,
    });
  });
});
