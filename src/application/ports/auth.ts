export interface CredentialsRepository {
  findPasswordHash(username: string): Promise<string | null>;
}

export interface PasswordVerifier {
  verify(input: { password: string; passwordHash: string }): Promise<boolean>;
}

export interface TokenIssuer {
  issueToken(input: {
    subject: string;
    issuedAt: number;
    expiresAt: number;
    issuer?: string;
  }): Promise<string>;
}

export interface Clock {
  nowSeconds(): number;
}
