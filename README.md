# Common Ground

A personality-based club-matching app for college students, built for a hackathon. Students take a short quiz, get matched to real student organizations at their school on a 10-axis personality model, and get a fun "type" read on themselves alongside the matches. Currently live for **Columbia, NYU, Cornell, and Penn**, with an architecture designed to make adding another school a data problem, not a code problem.

## Why this exists

New students, transfers, and upperclassmen who haven't found their community often don't struggle from a lack of clubs — they struggle from not knowing where to start looking in a directory of hundreds of options. Common Ground tries to shortcut that by matching on *how someone likes to spend time and connect with people*, not just declared interests, and by giving them a few different lenses on their own results (a top-3 list, plus spotlight picks for cultural fit, cause-driven fit, and career fit) rather than one flat ranking.

## How the matching actually works

Every student and every club gets scored on the same 10 unipolar axes, each 0–10:

| Axis | 0 means... | 10 means... |
|---|---|---|
| `structure` | spontaneous/casual | structured/scheduled |
| `competitive` | collaborative | competitive |
| `public` | behind-the-scenes | public-facing/performance |
| `group_size` | small/intimate | large group |
| `career` | purely social/hobby | career-oriented |
| `physical` | cerebral/discussion | physical/active |
| `creative` | analytical/technical | creative/artistic |
| `cause` | craft/skill-driven | cause-driven/advocacy |
| `novelty` | deep specialization | exploratory/novelty-seeking |
| `identity` | interest-based | identity-based |

A student's vector starts at a neutral 5 on every axis and shifts based on their answers to 20 personality questions (`data/questions.ts`); each answer nudges 1-2 axes by a small delta. Matching (`lib/matching.ts`) is a weighted RMSE distance between the student's vector and each org's vector, converted to a 0-100% score — closer vectors score higher. A small, optional keyword-based boost (major, background, religion, causes the student shared) can nudge a genuinely relevant org up in the ranking, but it's capped low enough that it can't override a real personality mismatch.

Beyond the top-3 list, results also surface up to three **spotlight picks** — the best match filtered through just one signal at a time (cultural/community fit, cause-driven fit, career/academic fit) — deliberately excluding anything already in the top 3, so they add real discovery instead of repeating the same clubs.

### The archetype system

Alongside club matches, results show a fun "type" read: one of 8 primary archetypes (Social Spark, Inner-Circle Builder, Curious Wanderer, Steady Teammate, Creative Catalyst, Driven Challenger, Community Anchor, Behind-the-Scenes Architect — see `data/archetypes.ts`), matched the same way orgs are, plus up to 4 secondary badges (Purpose-driven, Career-minded, Movement-powered, Identity-centered) for whichever of those traits aren't already part of the primary archetype's own story. When the top two archetypes are close, the result blends them ("a mix of X and Y" or "mostly X, with some Y energy") instead of forcing a single label — the blend thresholds were tuned empirically against thousands of simulated quiz-takers, not guessed. The results page is explicit that this is a fun, algorithmic read, not a diagnosis, and points students toward actually attending an interest meeting as the real way to know if a club fits.

## What's in the quiz

- **7 short, skippable profile questions**: goals for the year, cultural/identity background, academic interests *or* declared major (sophomores and up get asked their major directly instead, since asking both felt redundant), international student status, postgrad interests, religious/spiritual tradition, and causes they care about. None of these are required, and none are sent to Supabase — they only ever affect the local keyword-boost calculation.
- **A short transition screen** ("Now for the fun part") between the profile questions and the real quiz, so it doesn't feel like one long undifferentiated form.
- **20 personality questions** that build the actual 10-axis vector.
- Enter-key support throughout, and a Back button on every step (including personality questions — going back correctly un-registers the previous answer rather than leaving a stale duplicate).

## Multi-school architecture

Nothing in the matching engine, quiz, or results page is Columbia-specific. Everything that varies by school lives in data:

- `data/universities.ts` — the school list (id, name, color, domain)
- `data/{school}_orgs_seed.json` — that school's real club directory, each org tagged on all 10 axes, with a primary category and optional secondary categories (14-category taxonomy: Academic, Athletics, Cultural, Fraternity and Sorority Life, Identity-Based, Media and Publications, Musical, Performing Arts, Politics/Activism and Advocacy, Pre-Professional, Religious/Spiritual, Service, Special Interest, Student Government and Advisory Boards)
- `data/majors.ts` — a `MAJORS_BY_UNIVERSITY` lookup so the quiz's major dropdown shows real majors for whichever school the student is in (falls back to Columbia's list for any school without its own yet, so nothing crashes)
- `data/events.ts` — real, verified school-specific traditions (see below)
- `content/belonging.ts` — a genuinely researched "if you want to start a club here" article per school (registration processes vary a lot between schools — Cornell's EO/IT organization split, Penn's recent shift away from rolling registration, Columbia's multiple governing boards, NYU's two-tier club system), plus ~11 universal articles on belonging that show up for every school automatically

Routing is `/school/[schoolId]/...` throughout, so adding a school is: add one entry to `universities.ts`, add one seed JSON, add one seed script (copy an existing one, swap the import), add one line to `LOCAL_ORGS_BY_UNIVERSITY` in `lib/data.ts`, and optionally add a majors list, events, and a belonging article. The homepage, nav, quiz, results, and club directory all pick up a new school automatically once it's in `UNIVERSITIES`.

Current org counts: Columbia 488, NYU 441, Cornell 677, Penn 356.

## Real, verified school traditions

`data/events.ts` includes actual named traditions per school, not filler — Columbia's Bacchanal and Homecoming, NYU's Strawberry Festival, Cornell's Dragon Day and Slope Day, Penn's Hey Day and Penn Relays, and more. Every fact (dates, history, format) was checked against each school's own official pages before being added, not guessed from general knowledge of "what colleges usually do."

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript, plain CSS (`app/globals.css`, a warm "Common Room" palette — no Tailwind)
- **Icons**: `lucide-react`
- **Backend**: Supabase (Postgres) for orgs, quiz questions, saved orgs, feedback, and org-submission review — with a local-JSON fallback (`lib/data.ts`) if Supabase is unreachable, so a network hiccup during a demo never fully breaks the app
- **Auth**: Supabase magic-link email sign-in (`lib/auth.ts`) — required for saving/comparing orgs across visits
- **Deployment**: Vercel, connected to this GitHub repo for auto-deploy on push

## Getting started

\`\`\`bash
npm install
npm run test:matching   # sanity-checks the matching engine, no setup needed
npm run dev
\`\`\`

The app works immediately with no environment variables set — it falls back to the local seed JSON files for every school. To connect a real Supabase backend:

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/schema.sql`, then each `supabase/migration_*.sql` file
3. In Project Settings → API, copy your project URL, anon key, and service role key
4. Create `.env.local` (never commit this — it's already gitignored):
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   \`\`\`
   The service role key is only ever read by the seed scripts (server-side, never shipped to the browser) — it bypasses Row Level Security, so it's more sensitive than the anon key.
5. Seed each school:
   \`\`\`bash
   npm run seed:supabase   # Columbia + the shared question bank
   npm run seed:nyu
   npm run seed:cornell
   npm run seed:penn
   \`\`\`
   Each seed script fully replaces that school's orgs on every run (delete-then-insert), so removing an org from the local JSON also removes it from the database on the next seed — no orphaned rows left behind from a previous run.

## Project structure

\`\`\`
app/
  page.tsx                          — school picker
  quiz/page.tsx                     — the whole quiz flow
  results/page.tsx                  — matches, spotlights, archetype card
  school/[schoolId]/
    page.tsx                       — per-school homepage (year picker)
    clubs/page.tsx                 — searchable/filterable club directory
    events/page.tsx                — event directory
    explore/page.tsx               — slider-based "explore by feel" matching
    saved/page.tsx                 — saved orgs (sign-in required)
    belonging/[slug]/page.tsx      — belonging articles
data/
  {school}_orgs_seed.json          — one file per school, source of truth for local fallback + seeding
  questions.ts                     — the 20-question personality quiz bank
  archetypes.ts                    — the 8 archetypes + 4 badges + blend logic
  majors.ts, universities.ts, events.ts, background.ts, causes.ts, religion.ts, postgrad.ts
lib/
  matching.ts                      — pure functions, no framework/DB dependency
  data.ts                          — Supabase fetch with local-JSON fallback
  auth.ts, supabase.ts, supabaseAdmin.ts, useSavedOrgs.ts, storage.ts
scripts/
  seed-{school}.ts                 — one per school, delete-then-insert into Supabase
  test-matching.ts                 — run after touching matching logic or org tags
supabase/
  schema.sql, migration_*.sql      — Postgres schema + incremental migrations
\`\`\`

## A note on the axis convention

Every axis is unipolar and consistent in direction: 0 is always the trait named first in the `AXES` comment block in `types/index.ts`, 10 is always the trait named second. Keep this consistent in any new org tags, quiz deltas, or archetype vectors — a polarity mismatch is a quiet bug that produces weird-but-plausible match results rather than an obvious crash, which is why `scripts/test-matching.ts` exists as a fast sanity check.

## Known gaps / possible next steps

- **Org tag precision**: axis tags for most orgs come from category-level defaults plus light keyword nudges, not individual-by-individual judgment (see the `note` field in each seed JSON for exactly how). Worth hand-refining any org that shows up in an actual demo run-through.
- **No auth-gated moderation view**: an admin view for reviewing org-submission/feedback data was deliberately parked as too risky to build under demo-day time pressure.
- **Majors list reuse**: a handful of school-specific majors don't have their own keyword-boost entry yet and will simply not contribute a boost (not a crash, just a no-op) — see `MAJOR_ORG_KEYWORDS` in `data/majors.ts`.
- **Single shared question bank**: all 4 schools currently answer the same 20 personality questions and share `MAJOR_ORG_KEYWORDS`; a school-specific question variant is possible but hasn't been needed yet.
