# Repository Guidelines

## Project Structure & Module Organization
This repository currently contains a single NestJS service in `backend/`. Application code lives in `backend/src`, organized by feature modules such as `modules/auth` and `modules/user`. Shared helpers belong in `backend/src/common`, and environment parsing is centralized in `backend/src/env.ts`. Unit tests sit beside implementation files as `*.spec.ts`; end-to-end tests live in `backend/test`.

## Build, Test, and Development Commands
Run all commands from `backend/`.

- `pnpm install` installs dependencies.
- `pnpm run start:dev` starts the API in watch mode.
- `pnpm run build` compiles TypeScript to `dist/`.
- `pnpm run start:prod` runs the compiled server.
- `pnpm run lint` applies ESLint fixes across `src` and `test`.
- `pnpm run format` runs Prettier on `src/**/*.ts` and `test/**/*.ts`.
- `pnpm run test` runs unit tests.
- `pnpm run test:e2e` runs e2e tests from `backend/test`.
- `pnpm run test:cov` generates Jest coverage output in `backend/coverage`.

## Coding Style & Naming Conventions
This codebase uses TypeScript with ESLint 9 and Prettier 3. Prettier enforces `singleQuote: true` and trailing commas. Follow the existing 2-space NestJS/TypeScript style and keep imports explicit. Use `PascalCase` for classes, DTOs, and modules, `camelCase` for functions and variables, and kebab-free filenames that match Nest defaults such as `auth.service.ts` and `create-user.dto.ts`.

## Testing Guidelines
Add unit tests next to the code they cover using the `*.spec.ts` suffix. Put higher-level HTTP coverage in `backend/test`, following the `*.e2e-spec.ts` pattern. New endpoints, DTO validation, and service branches should ship with tests. Run `pnpm run test` before opening a PR; run `pnpm run test:e2e` when changing routing, middleware, or bootstrapping.

## Commit & Pull Request Guidelines
The current history uses short, imperative subjects such as `backend init`. Keep commit titles brief and descriptive, and split unrelated work into separate commits when practical. PRs should explain the change, note any config or env updates, link related issues, and include request/response examples for API-facing changes.

## Security & Configuration Tips
Environment variables are validated through `zod` in `backend/src/env.ts`; `DB_URL` and `PORT` are required. Do not hardcode secrets. The app serves Swagger at `/docs` and applies a global `/api/v1` prefix, so keep route and documentation changes in sync.
