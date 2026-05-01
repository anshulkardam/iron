# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Real pnpm workspace + Turborepo monorepo. All three apps are scaffolded:

- `backend/` — NestJS 11 API server (Fastify adapter, Drizzle ORM, Postgres)
- `app/` — Expo 54 + expo-router (mobile + RN web)
- `web/` — Next.js 16 + Tailwind v4 (landing page)
- `packages/*` — reserved for future shared code (e.g. Zod schemas shared between backend and clients). Not yet populated.

Single root `pnpm-lock.yaml`. `nodeLinker: hoisted` is required (Expo/Metro). Do not introduce per-package lockfiles or workspace files.

## Common commands (run from repo root)

- `pnpm install` — install all workspaces
- `pnpm dev` — `turbo run dev` (starts everything; usually you want one app instead)
- `pnpm build` — `turbo run build`
- `pnpm lint` — `turbo run lint` (Biome across all packages)
- `pnpm check` — `biome check --write .` (lint + format with auto-fix)
- `pnpm format` — `biome format --write .`
- `pnpm typecheck` — `turbo run typecheck`
- `pnpm test` — `turbo run test`

Per-package, with `--filter`:

- `pnpm --filter backend dev` — Nest in watch mode
- `pnpm --filter web dev` — Next dev server
- `pnpm --filter app dev` — Expo dev server
- `pnpm --filter backend test -- path/to/file.spec.ts` — single test file
- `pnpm --filter backend test -- -t "name"` — single test by name
- `pnpm --filter backend test:e2e` — e2e (config at `backend/test/jest-e2e.json`)
- `pnpm --filter backend db:generate` / `db:migrate` / `db:push` — Drizzle Kit

## Tooling

- **Package manager**: pnpm 10.33.0 (pinned via `packageManager`). Don't introduce npm/yarn lockfiles or per-package lockfiles.
- **Task runner**: Turborepo. Pipelines defined in root `turbo.json`. `^build` deps are wired so cross-package builds order correctly.
- **Lint + format**: single root `biome.json` (Biome 2.x, `recommended: true` with Next/React domains). Per-package configs are forbidden — extend the root config instead. `*.css` is excluded from Biome (Tailwind v4 directives aren't supported by Biome's CSS parser).
- **Git hooks**: husky + lint-staged at root. Configuration in `.lintstagedrc.mjs`.

## Backend architecture

- **Framework**: NestJS 11 on Fastify (`@nestjs/platform-fastify`), not Express. Bootstrap registers `@fastify/helmet`, `@fastify/csrf-protection`, and `@fastify/compress` in `src/main.ts`.
- **Global API prefix**: `api/v1`. Swagger UI is mounted at `/docs` with bearer-auth configured.
- **Env loading**: `src/env.ts` parses `process.env` through a Zod schema at import time (`DB_URL`, `PORT`). Importing `env` anywhere will throw on startup if required vars are missing — add new vars to that schema rather than reading `process.env` directly. `.env` is loaded via `dotenv/config`.
- **Module structure**: `AppModule` (`src/app.module.ts`) wires feature modules from `src/modules/*` (currently `auth`, `user`). Each feature module follows the standard Nest layout: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, with co-located `*.spec.ts` unit tests.
- **Shared code**: `src/common/` (e.g. `current-user.decorator.ts`); `src/database/database.module.ts` is the single place DB wiring should live; Drizzle schema lives under `src/database/schema/`.

## Expo (`app/`)

- `metro.config.js` is the canonical Expo monorepo config: `watchFolders` includes the workspace root and `disableHierarchicalLookup` is on so Metro resolves hoisted modules. Don't remove or simplify it — Metro will fail to resolve packages otherwise.
- EAS Build is not yet configured. When you add `eas.json`, configure it to install from the workspace root.

## Web (`web/`)

- Next.js 16 + Tailwind v4. **Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code** — Next 16 has breaking changes from earlier versions and conventions in your training data may be wrong.
- Deploy via Vercel: set Root Directory = `web` in the Vercel dashboard; Vercel auto-detects pnpm workspaces and Turborepo.

## Backend deployment

`backend/Dockerfile` uses the `turbo prune` pattern. Build context must be the **monorepo root**, not `backend/`:

```
docker build -f backend/Dockerfile -t code-iron-backend .
```

`backend/docker-compose.yml` already sets `context: ..` so `docker compose -f backend/docker-compose.yml up` works.

## Conventions

- Validate any new env var by extending the Zod schema in `backend/src/env.ts`; consume via the exported `env` object.
- New backend feature areas go under `backend/src/modules/<name>/` mirroring `auth`/`user`.
- Shared code that both backend and a client need (Zod schemas, types) belongs in `packages/shared/` (create when the first one shows up). Don't reach across `backend/` ↔ `app/` ↔ `web/` directly.
- Don't add per-package `biome.json` / `eslint.config.js` / `pnpm-workspace.yaml` files; the root config is canonical.
