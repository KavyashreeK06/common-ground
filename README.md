# Campus Connections — Belonging Quiz

## What's here so far

- `types/index.ts` — the shared data model. **Read the AXES comment block first**
  — every axis is 0-10 where higher = more of the named trait.
- `lib/matching.ts` — the matching engine (pure functions, no DB/framework deps).
  Builds a student vector from quiz answers, scores orgs against it, and
  generates a templated "why this fits" blurb.
- `data/questions.ts` — the 12-question quiz bank with axis deltas per answer.
- `data/columbia_orgs_seed.json` — 31 real Columbia orgs pre-tagged on all 10 axes.
- `scripts/test-matching.ts` — local sanity test, runs the engine against two
  fake personas with no DB required. **Run this first** whenever you touch
  the matching logic or the seed data.
- `supabase/schema.sql` — Postgres schema (university / org / quiz_question /
  quiz_result tables) with public-read RLS policies.
- `scripts/seed-supabase.ts` — pushes the Columbia seed + question bank into
  a real Supabase project.

# Campus Connections — Belonging Quiz

## What's here

**Data layer**
- `types/index.ts` — shared data model. Read the AXES comment first — every axis
  is 0-10 where higher = more of the named trait. Also defines `StudentYear`,
  `StudentProfile` (year + axis vector + goals), and `CampusEvent`.
- `lib/matching.ts` — the matching engine (pure functions, framework-free).
- `data/questions.ts` — 12-question personality quiz bank.
- `data/columbia_orgs_seed.json` — 495 real Columbia orgs (pulled from the
  official student-group directory), tagged on all 10 axes. See the `note`
  field in that file for how the tags were built.
- `data/events.ts` — real Columbia traditions (Homecoming, Bacchanal, Tree
  Lighting, Convocation, etc.) plus a few templated major-specific events.
- `content/belonging.ts` — the written content for the belonging/community pages.
- `scripts/test-matching.ts` — local sanity test, run this after touching
  matching logic or org tags.
- `scripts/build_full_seed.py` — the script that merged the full club
  directory paste into the seed JSON with category-default tags.

**App (Next.js App Router, all pages built and verified with `next build`)**
- `/` — landing page, choose your year
- `/quiz` — goals selection + the 12-question personality quiz
- `/results` — top matches with score + "why this fits" explanation, plus
  upcoming events for your year
- `/belonging` — editorial content on what belonging looks like for different
  student situations (first-year, introverted, identity-based community,
  transfer students, upperclassmen re-evaluating their community)
- `/clubs` — full 495-org directory, searchable and filterable by category
- `/events` — event directory, filterable by category and year

State (the quiz → results handoff) is passed via `localStorage`, no backend
required to demo. No Supabase wiring in the UI yet — see below.

## Getting started

```bash
npm install
npm run test:matching   # verify the matching engine, no setup needed
npm run dev             # run the full app locally
```

## Connecting a real Supabase project (optional, not required for the UI to work)

1. Create a free project at supabase.com
2. Open the SQL editor, paste in `supabase/schema.sql`, run it
3. In Project Settings > API, copy your URL and anon key
4. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. `npm run seed:supabase` — pushes orgs + questions into the DB

Note: the current UI reads org/question data directly from the local JSON/TS
files, not from Supabase. That's a deliberate choice for demo reliability
(no network dependency during judging) — wiring the UI to Supabase instead
of local data is a reasonable next step if you want the "real backend" story
to be literally live rather than just available.

## Known gaps / what to do next

- **Org tag precision**: the ~464 orgs added from the full directory paste
  got tags from category-level defaults, not individual reasoning (see the
  `note` field in the seed JSON). Refine the orgs most likely to appear in
  your actual demo run-throughs.
- **Major input**: the quiz doesn't currently ask for major, so `/events`
  major-filtering isn't wired to the student profile yet — it's filterable
  manually on the page but not auto-personalized. Same goes for org matches;
  major isn't currently a matching input.
- **LLM explanation layer**: `explainMatch()` is templated, not LLM-generated
  (by design — keeps the demo network-independent). Swapping in an LLM call
  for richer explanations is a good stretch goal, with the templated version
  as fallback.
- **No auth / persistence across devices**: profile lives in `localStorage`
  only. Fine for a hackathon demo, not for a real multi-session product.

## A note on the axis convention

Every axis is unipolar: 0 = low, 10 = high, higher always means "more of the
trait named first" (see the `AXES` comment block in `types/index.ts`). Keep
this consistent in any new org tags or quiz deltas — a polarity mismatch is
a quiet bug that produces weird-but-plausible match results (this happened
once already and was caught by `test-matching.ts`, which is why it exists).

