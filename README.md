# WILDFIRE

## Prerequisites

- [Bun](https://bun.sh/docs/installation)
- [Docker](https://docs.docker.com/engine/install/)
  - [Docker Compose](https://docs.docker.com/compose/install/)
- [Visual Studio Code](https://code.visualstudio.com/Download) (optional, but recommended)

## Getting Started

```sh
git clone https://github.com/jcajuab/wildfire.git
cd wildfire/
bun install --filter '*'
bun run dev
```

### Adding Packages

Currently, [Bun does not support `bun add --filter <workspace> <package>`](https://github.com/oven-sh/bun/issues/14719). As a temporary workaround:

```sh
cd apps/api
bun add slug
```

> [!IMPORTANT]
> Please avoid adding dependencies to the root `package.json`.
