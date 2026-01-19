import { type ContentRepository } from "#/application/ports/content";
import { type UserRepository } from "#/application/ports/rbac";
import { toContentView } from "./content-view";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export class ListContentUseCase {
  constructor(
    private readonly deps: {
      contentRepository: ContentRepository;
      userRepository: UserRepository;
    },
  ) {}

  async execute(input: { page?: number; pageSize?: number }) {
    const page = clamp(Math.trunc(input.page ?? 1), 1, Number.MAX_SAFE_INTEGER);
    const pageSize = clamp(Math.trunc(input.pageSize ?? 20), 1, 100);
    const offset = (page - 1) * pageSize;

    const { items, total } = await this.deps.contentRepository.list({
      offset,
      limit: pageSize,
    });

    const creators = await Promise.all(
      items.map((item) => this.deps.userRepository.findById(item.createdById)),
    );

    return {
      items: items.map((item, index) =>
        toContentView(item, creators[index]?.name ?? null),
      ),
      page,
      pageSize,
      total,
    };
  }
}
