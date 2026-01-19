import bcrypt from "bcryptjs";
import { type PasswordVerifier } from "#/application/ports/auth";

export class BcryptPasswordVerifier implements PasswordVerifier {
  async verify(input: {
    password: string;
    passwordHash: string;
  }): Promise<boolean> {
    const normalizedHash = input.passwordHash.replace(/^\$2y\$/, "$2b$");
    return bcrypt.compare(input.password, normalizedHash);
  }
}
