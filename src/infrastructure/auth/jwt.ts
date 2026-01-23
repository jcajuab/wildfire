import { jwt, sign } from "hono/jwt";
import { type TokenIssuer } from "#/application/ports/auth";

interface JwtTokenIssuerDeps {
  secret: string;
  issuer?: string;
}

export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly deps: JwtTokenIssuerDeps) {}

  issueToken(input: {
    subject: string;
    issuedAt: number;
    expiresAt: number;
    issuer?: string;
    email?: string;
  }): Promise<string> {
    const payload = {
      sub: input.subject,
      email: input.email,
      iat: input.issuedAt,
      exp: input.expiresAt,
      iss: input.issuer ?? this.deps.issuer,
    };

    return sign(payload, this.deps.secret);
  }
}

export const createJwtMiddleware = (secret: string) =>
  jwt({ secret, alg: "HS256" });
