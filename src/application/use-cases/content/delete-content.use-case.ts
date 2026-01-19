import {
  type ContentRepository,
  type ContentStorage,
} from "#/application/ports/content";
import { NotFoundError } from "./errors";

export class DeleteContentUseCase {
  constructor(
    private readonly deps: {
      contentRepository: ContentRepository;
      contentStorage: ContentStorage;
    },
  ) {}

  async execute(input: { id: string }) {
    const record = await this.deps.contentRepository.findById(input.id);
    if (!record) {
      throw new NotFoundError("Content not found");
    }

    await this.deps.contentStorage.delete(record.fileKey);
    const deleted = await this.deps.contentRepository.delete(input.id);
    if (!deleted) {
      throw new NotFoundError("Content not found");
    }
  }
}
