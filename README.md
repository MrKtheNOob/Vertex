# Vertex MVP Blueprint

This repository now contains an implementation-ready blueprint for the **Vertex (Zentra) student talent ranking MVP**.

## What's Included

- `docs/mvp-product-spec.md` — Finalized MVP scope and product behavior.
- `docs/supabase-schema.sql` — SQL schema for Supabase/Postgres, including score/match helper functions.
- `docs/supabase-queries.md` — Query recipes for core app flows.
- `docs/ui-build-plan.md` — Page-by-page build order and component map for Next.js.

## Suggested Execution Order

1. Apply `docs/supabase-schema.sql` in Supabase SQL Editor.
2. Build auth + route guards in Next.js.
3. Implement student profile create/edit and score refresh.
4. Implement company student discovery view.
5. Implement job posting and candidate matching view.

## Demo Goal

A complete demo should support:

1. Student creates profile and adds skills/projects.
2. Student sees a score on dashboard.
3. Company browses ranked students with skill filters.
4. Company posts job and sees matched candidates.

## Local Setup (Supabase)

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project.
3. Run the SQL in `docs/supabase-schema.sql` in Supabase.
4. Start the app:

```bash
npm install
npm run dev
```
