import { describe, expect, test } from "bun:test";
import {
  AuthenticateUserUseCase,
  InvalidCredentialsError,
} from "#/application/use-cases/auth";

const tokenTtlSeconds = 60 * 60;

const makeDeps = () => {
  const issued: {
    subject?: string;
    issuedAt?: number;
    expiresAt?: number;
  } = {};

  return {
    issued,
    deps: {
      credentialsRepository: {
        findPasswordHash: async () => "hash",
      },
      passwordVerifier: {
        verify: async () => true,
      },
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
    },
  };
};

describe("AuthenticateUserUseCase", () => {
  test("returns token metadata for valid credentials", async () => {
    const { deps, issued } = makeDeps();
    const useCase = new AuthenticateUserUseCase(deps);

    const result = await useCase.execute({
      username: "test1",
      password: "xc4uuicX",
    });

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

  test("throws InvalidCredentialsError when user is missing", async () => {
    const { deps } = makeDeps();
    const useCase = new AuthenticateUserUseCase({
      ...deps,
      credentialsRepository: {
        findPasswordHash: async () => null,
      },
    });

    await expect(
      useCase.execute({ username: "missing", password: "pw" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("throws InvalidCredentialsError when password is invalid", async () => {
    const { deps } = makeDeps();
    const useCase = new AuthenticateUserUseCase({
      ...deps,
      passwordVerifier: {
        verify: async () => false,
      },
    });

    await expect(
      useCase.execute({ username: "test1", password: "wrong" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
