# `@wildfire/api`

## Getting Started

To set up the `@wildfire/api` development environment, run:

```sh
COMPOSE_ENV_FILES=.env.development docker compose up -d

# Wait until all services are fully initialized before proceeding
bun run db:generate
bun run db:migrate
```

> [!NOTE]
> Re-run `bun run db:generate` and `bun run db:migrate` whenever changes are made to the database schema.

### Ports Used

The following **ports** are utilized during local development:

- `3000`: **WILDFIRE** server
- `3306`: **MySQL** database
- `8080`: **Adminer** web interface

> [!NOTE]
> Ensure these ports are not occupied by other services to prevent conflicts during development.
