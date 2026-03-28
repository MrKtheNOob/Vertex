# Next.js UI Build Plan (MVP)

Target implementation: pure Next.js + Supabase, with landing-page visual direction inspired by https://global-id-pro.lovable.app/.

## Build Sequence (minimal risk)

1. **Auth + role capture**
   - `/(auth)/signup`: email/password + role selector.
   - Persist to `public.users` after sign-up.

2. **Student profile editing**
   - `/profile/edit`: basic form + skills input + projects list.
   - On save, call score refresh function.

3. **Student dashboard**
   - `/dashboard`: score card + profile summary + project table.

4. **Company student discovery**
   - `/students`: searchable/filtered list, sorted by score desc.

5. **Jobs + matching**
   - `/jobs`: create/list jobs.
   - `/jobs/[id]`: top candidates sorted by `match_score`.

## Component Suggestions

- `ScoreBadge` — large visible score indicator.
- `SkillChips` — reusable chip list for skills.
- `StudentCard` — card row for ranking list.
- `JobForm` — create/edit job.
- `CandidateTable` — ranked candidates with match score.

## UX Notes that make MVP feel polished

- Always show score changes immediately after profile updates.
- Keep sorting default to highest score.
- Add visual labels: `Top Match`, `Strong Fit`, `Good Fit` based on match score bands.
- Avoid hidden logic; make scoring rule visible in UI tooltip/help text.
