-- Campus Connections schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) to set up
-- the core tables. Axis vectors are stored as JSONB so we don't need a
-- migration every time we tweak the axis list during the hackathon.

create table if not exists university (
  id text primary key,              -- short slug, e.g. 'columbia'
  name text not null,
  domain text not null
);

create table if not exists org (
  id uuid primary key default gen_random_uuid(),
  university_id text not null references university(id) on delete cascade,
  name text not null,
  category text not null,
  description text,
  contact_url text,
  tags jsonb not null,              -- AxisVector, e.g. {"structure": 7, ...}
  created_at timestamptz default now(),
  unique (university_id, name)      -- lets the seed script upsert safely on re-run
);

create index if not exists org_university_idx on org(university_id);

create table if not exists quiz_question (
  id text primary key,              -- e.g. 'q1'
  university_id text references university(id) on delete cascade, -- null = shared across all schools
  text text not null,
  options jsonb not null,           -- QuizAnswerOption[]
  sort_order int not null default 0
);

-- Optional: log completed quiz results for a lightweight "who matched with what"
-- view later, or for analytics on which orgs are surfacing most. No auth/user
-- table yet since the hackathon flow can stay anonymous for the demo.
create table if not exists quiz_result (
  id uuid primary key default gen_random_uuid(),
  university_id text not null references university(id) on delete cascade,
  student_vector jsonb not null,
  top_matches jsonb not null,       -- array of {org_id, score}
  created_at timestamptz default now()
);

-- Row Level Security: keep it simple for the hackathon — public read on
-- university/org/question data, no public write access to quiz_result inserts
-- beyond the anon key's insert (fine for a demo, tighten before any real launch).
alter table university enable row level security;
alter table org enable row level security;
alter table quiz_question enable row level security;
alter table quiz_result enable row level security;

create policy "public read university" on university for select using (true);
create policy "public read org" on org for select using (true);
create policy "public read quiz_question" on quiz_question for select using (true);
create policy "public insert quiz_result" on quiz_result for insert with check (true);
