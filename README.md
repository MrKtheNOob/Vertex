# Zentra MVP Blueprint

This repository contains an implementation-ready blueprint for the **Zentra** student talent ranking MVP.

Reference landing page inspiration: https://global-id-pro.lovable.app/

## What's Included

- `docs/mvp-product-spec.md` — Finalized MVP scope and product behavior for Zentra.
- `docs/supabase-schema.sql` — SQL schema for Supabase/Postgres, including score and match helper functions.
- `docs/supabase-queries.md` — Query recipes for core app flows.
- `docs/ui-build-plan.md` — Page-by-page build order and component map for a pure Next.js + Supabase implementation.

## Suggested Execution Order

1. Apply `docs/supabase-schema.sql` in Supabase SQL Editor.
2. Bootstrap a Next.js app and connect Supabase Auth + Postgres.
3. Implement student profile create/edit and score refresh.
4. Implement company student discovery view.
5. Implement job posting and candidate matching view.

## Demo Goal

A complete demo should support:

1. Student creates profile and adds skills/projects.
2. Student sees a score on dashboard.
3. Company browses ranked students with skill filters.
4. Company posts job and sees matched candidates.
