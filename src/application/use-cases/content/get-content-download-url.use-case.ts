import {
  type ContentRepository,
  type ContentStorage,
} from "#/application/ports/content";
import { NotFoundError } from "./errors";

export class GetContentDownloadUrlUseCase {
  constructor(
    private readonly deps: {
      contentRepository: ContentRepository;
      contentStorage: ContentStorage;
      expiresInSeconds: number;
    },
  ) {}

  async execute(input: { id: string }) {
    const record = await this.deps.contentRepository.findById(input.id);
    if (!record) {
      throw new NotFoundError("Content not found");
    }

    const downloadUrl = await this.deps.contentStorage.getPresignedDownloadUrl({
      key: record.fileKey,
      expiresInSeconds: this.deps.expiresInSeconds,
    });

    return { downloadUrl };
  }
}
