import { readFile } from "node:fs/promises";
import { type CredentialsRepository } from "#/application/ports/auth";

interface HtshadowCredentialsRepositoryDeps {
  filePath: string;
}

export class HtshadowCredentialsRepository implements CredentialsRepository {
  constructor(private readonly deps: HtshadowCredentialsRepositoryDeps) {}

  async findPasswordHash(username: string): Promise<string | null> {
    const data = await readFile(this.deps.filePath, "utf-8");
    const lines = data.split("\n").map((line) => line.trim());

    for (const line of lines) {
      if (!line) continue;
      const [lineUsername, hash] = line.split(":", 2);
      if (lineUsername === username && hash) {
        return hash.trim();
      }
    }

    return null;
  }
}
