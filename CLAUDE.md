# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Monorepo with three top-level workspaces. Only `backend/` is implemented; `app/` and `web/` are empty placeholders.

- `backend/` — NestJS 11 API server (Fastify adapter)
- `app/` — empty (intended for a mobile/desktop client)
- `web/` — empty (intended for a web client)

All commands below are run from `backend/` and use **pnpm**.

## Common commands (backend/)

- `pnpm install` — install deps
- `pnpm start:dev` — run API in watch mode
- `pnpm start:prod` — run compiled API from `dist/`
- `pnpm build` — `nest build` to `dist/`
- `pnpm lint` — eslint with `--fix`
- `pnpm format` — prettier write
- `pnpm test` — unit tests (jest, picks up `*.spec.ts` under `src/`)
- `pnpm test -- path/to/file.spec.ts` — single test file
- `pnpm test -- -t "name"` — single test by name
- `pnpm test:e2e` — e2e tests (config at `test/jest-e2e.json`)
- `pnpm test:cov` — coverage

## Backend architecture

- **Framework**: NestJS 11 on Fastify (`@nestjs/platform-fastify`), not Express. Bootstrap registers `@fastify/helmet`, `@fastify/csrf-protection`, and `@fastify/compress` in `src/main.ts`.
- **Global API prefix**: `api/v1`. Swagger UI is mounted at `/docs` with bearer-auth configured.
- **Env loading**: `src/env.ts` parses `process.env` through a Zod schema at import time (`DB_URL`, `PORT`). Importing `env` anywhere will throw on startup if required vars are missing — add new vars to that schema rather than reading `process.env` directly. `.env` is loaded via `dotenv/config`.
- **Module structure**: `AppModule` (`src/app.module.ts`) wires feature modules from `src/modules/*` (currently `auth`, `user`). Each feature module follows the standard Nest layout: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, with co-located `*.spec.ts` unit tests.
- **Shared code**: `src/common/` (e.g. `current-user.decorator.ts`); `src/database/database.module.ts` is the single place DB wiring should live.

## Conventions

- Package manager is pnpm (lockfile committed). Don't introduce npm/yarn lockfiles.
- New feature areas go under `src/modules/<name>/` mirroring `auth`/`user`.
- Validate any new env var by extending the Zod schema in `src/env.ts`; consume via the exported `env` object.
