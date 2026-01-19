import {
  type Clock,
  type CredentialsRepository,
  type PasswordVerifier,
  type TokenIssuer,
} from "#/application/ports/auth";
import { InvalidCredentialsError } from "#/application/use-cases/auth/errors";

export interface AuthenticateUserInput {
  username: string;
  password: string;
}

export interface AuthResult {
  token: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: { username: string };
}

interface AuthenticateUserDeps {
  credentialsRepository: CredentialsRepository;
  passwordVerifier: PasswordVerifier;
  tokenIssuer: TokenIssuer;
  clock: Clock;
  tokenTtlSeconds: number;
  issuer?: string;
}

export class AuthenticateUserUseCase {
  constructor(private readonly deps: AuthenticateUserDeps) {}

  async execute(input: AuthenticateUserInput): Promise<AuthResult> {
    const passwordHash = await this.deps.credentialsRepository.findPasswordHash(
      input.username,
    );

    if (!passwordHash) {
      throw new InvalidCredentialsError();
    }

    const verified = await this.deps.passwordVerifier.verify({
      password: input.password,
      passwordHash,
    });

    if (!verified) {
      throw new InvalidCredentialsError();
    }

    const issuedAt = this.deps.clock.nowSeconds();
    const expiresAt = issuedAt + this.deps.tokenTtlSeconds;
    const token = await this.deps.tokenIssuer.issueToken({
      subject: input.username,
      issuedAt,
      expiresAt,
      issuer: this.deps.issuer,
    });

    return {
      token,
      tokenType: "Bearer",
      expiresIn: this.deps.tokenTtlSeconds,
      user: { username: input.username },
    };
  }
}
