# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project.

- `app/`: route entrypoints and page-level UI (`app/students/page.tsx`, `app/jobs/[id]/page.tsx`).
- `components/`: reusable UI building blocks (`StudentCard`, `AppChrome`, badges/chips).
- `lib/`: shared domain logic and helpers (`types.ts`, scoring, local storage utilities).
- `docs/`: product and data references (`mvp-product-spec.md`, Supabase schema/queries, UI build plan).
- Global styling lives in `app/globals.css`.

Use `@/*` imports (configured in `tsconfig.json`) for cross-folder references.

## Build, Test, and Development Commands
Run commands from the repository root:

- `npm run dev`: start local dev server with hot reload.
- `npm run build`: create production build.
- `npm run start`: run the production server from the built output.
- `npm run lint`: run Next.js + TypeScript ESLint checks.

There is no dedicated test script yet; use lint + manual UI checks before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true`), React 19, Next.js 15.
- Indentation: 2 spaces; keep formatting consistent with existing files.
- Components: PascalCase file and export names (for example, `StudentCard.tsx`).
- Routes: follow Next.js conventions (`page.tsx`, dynamic segments like `[id]`).
- Helpers and utilities: camelCase exports in `lib/`.
- Linting baseline: `.eslintrc.json` extends `next/core-web-vitals` and `next/typescript`.

## Testing Guidelines
- Add tests when introducing non-trivial logic (especially in `lib/`).
- Preferred naming when added: `*.test.ts` / `*.test.tsx`, colocated or in a `__tests__/` folder near the feature.
- Minimum pre-PR check right now: `npm run lint` and manual verification of touched routes.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects (for example, `Refine UI styling...`, `Build Vertex MVP...`).

- Keep commit titles concise and action-oriented.
- Group related changes per commit; avoid mixing refactors and behavior changes.
- PRs should include: purpose summary, key files changed, verification steps, and screenshots/GIFs for UI changes.
- Link the relevant issue or task when available, and call out schema/API impacts explicitly.
