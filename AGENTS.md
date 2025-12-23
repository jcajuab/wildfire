# Development Principles

This document defines how to work in the Wildfire backend codebase. It is aligned with:

- `docs/overview.md`
- `docs/best-practices.md`

## Project Overview (Backend Only)

Wildfire is a **centralized backend platform** for managing digital signage content across a school campus. The system manages content uploads, playlists, schedules, and device polling for Raspberry Pi displays.

**Core flow:**
Admin uploads content -> Content stored in MinIO (with checksum) -> Content placed into playlists -> Schedules assign playlists to devices -> Devices poll for manifests and play cached content.

**Key entities:**

- Content (image/video/pdf in MinIO)
- Playlist / PlaylistItem (ordered content + duration)
- Schedule (time-based assignment)
- Device (display unit)

**Architecture:**

- Modular Monolith (6 bounded contexts)
- Runtime: Bun
- Framework: Hono
- Database: MySQL + Drizzle ORM
- Storage: MinIO (S3-compatible)
- Auth: Hono JWT
- Validation: Zod
- Testing: Bun test runner
- API Docs: Scalar

**Note:** This is **not** a Next.js project. Do not apply Next.js or frontend rules.

---

## TDD First (Required)

Use Red-Green-Refactor for all behavior changes:

1. Write a failing test
2. Make it pass with the smallest change
3. Refactor with tests still green

Testing alignment:

- Domain: fast unit tests (no I/O)
- Use cases: unit tests with faked ports
- Adapters: contract tests for mapping
- Infrastructure: integration tests with real services

Commands:

- `bun test`
- `bun test <path>`

---

## Clean Architecture + SOLID (Required)

Dependencies point inward. Outer layers may depend on inner layers, never the reverse.

Layers:

1. Entities (domain rules)
2. Use cases (application logic)
3. Interface adapters (controllers, presenters, repositories)
4. Frameworks & drivers (DB, storage, web server, external APIs)

Folder guidance:

- `domain/` -> entities, value objects, domain services
- `application/` -> use cases, ports (interfaces)
- `interfaces/` -> controllers, request/response mappers
- `infrastructure/` -> DB, storage, external clients

SOLID enforcement:

- SRP: one concept per entity/use case/adapter
- OCP: extend via new implementations, not by modifying core use cases
- LSP: adapters must satisfy their interface contracts
- ISP: keep interfaces small and purpose-built
- DIP: use cases depend on interfaces, not concrete services

---

## Security & Performance (Secondary)

Security:

- Validate all inputs at the boundary (controllers) with Zod
- Keep secrets in environment variables
- Enforce RBAC via use case boundaries
- Never log secrets or PII

Performance:

- Prefer batch operations in repositories
- Cache only at interface boundaries or infrastructure layer
- Keep domain logic synchronous and side-effect free

---

## API & Module Conventions

- Hono routes should be thin; call use cases for business logic
- Keep consistent error shapes and HTTP status codes
- Use JWT auth middleware + RBAC checks for protected routes
- Use Drizzle for DB access through repository interfaces
- Store binary content in MinIO; no server-side media processing
- Playlists are scheduled, not individual content items

---

## Backend Audit Prompt

When auditing the codebase, use this checklist:

1. **Architecture alignment**

- Verify dependencies point inward (no infrastructure in use cases)
- Validate folder boundaries and ports/adapters usage

2. **Domain correctness**

- Ensure entities and relationships match the overview (Content, Playlist, Schedule, Device)
- Confirm schedules apply to playlists (not individual content)

3. **API correctness**

- Routes match documented modules (Auth, RBAC, Content, Playlists, Schedules, Devices)
- Controllers validate inputs and return consistent error shapes

4. **Security**

- JWT + RBAC enforced on protected routes
- No secrets or PII logged
- Input validation at boundary

5. **Storage & data integrity**

- MinIO uploads store checksums
- MySQL schema matches Drizzle models

6. **Testing**

- TDD followed for behavior changes
- Tests aligned to architectural layers
- Missing coverage flagged

7. **Maintainability**

- No unused code or dead paths
- Interfaces remain small and cohesive
- Avoid framework-specific logic in domain/use cases
