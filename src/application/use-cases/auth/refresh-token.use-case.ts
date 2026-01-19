import { type Clock, type TokenIssuer } from "#/application/ports/auth";

export interface RefreshTokenInput {
  username: string;
}

export interface RefreshTokenResult {
  token: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: { username: string };
}

interface RefreshTokenDeps {
  tokenIssuer: TokenIssuer;
  clock: Clock;
  tokenTtlSeconds: number;
  issuer?: string;
}

export class RefreshTokenUseCase {
  constructor(private readonly deps: RefreshTokenDeps) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenResult> {
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
