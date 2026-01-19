import { type ContentRepository } from "#/application/ports/content";
import { type UserRepository } from "#/application/ports/rbac";
import { toContentView } from "./content-view";
import { NotFoundError } from "./errors";

export class GetContentUseCase {
  constructor(
    private readonly deps: {
      contentRepository: ContentRepository;
      userRepository: UserRepository;
    },
  ) {}

  async execute(input: { id: string }) {
    const record = await this.deps.contentRepository.findById(input.id);
    if (!record) {
      throw new NotFoundError("Content not found");
    }

    const user = await this.deps.userRepository.findById(record.createdById);
    return toContentView(record, user?.name ?? null);
  }
}
