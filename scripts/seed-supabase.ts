/**
 * Run with: npx tsx scripts/seed-supabase.ts
 *
 * Prereqs:
 *   1. Create a Supabase project, run supabase/schema.sql in the SQL editor.
 *   2. In .env.local, set:
 *        NEXT_PUBLIC_SUPABASE_URL=...
 *        NEXT_PUBLIC_SUPABASE_ANON_KEY=...      (used by the deployed app, read-only)
 *        SUPABASE_SERVICE_ROLE_KEY=...          (used only by this script, bypasses RLS)
 *      Get the service role key from Project Settings > API > service_role secret.
 *      It's different from the anon key -- never expose it in client-side code,
 *      never prefix it with NEXT_PUBLIC_.
 *
 * This pushes the Columbia seed orgs + shared question bank into the DB.
 * Safe to re-run — orgs are fully replaced each run (delete-then-insert for
 * this university_id), so removing an org from the local seed file actually
 * removes it from the database too. Questions/university are still upserted
 * since those are keyed by a stable id and don't have this problem.
 *
 * Why service role and not anon: the schema's RLS policies intentionally only
 * grant public SELECT on university/org/quiz_question (so the deployed app's
 * anon key can read but not write). Seeding needs to write, so it needs the
 * elevated service role key instead -- that's expected, not a bug to route
 * around by loosening the RLS policies.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { QUESTIONS } from "../data/questions";
import seed from "../data/columbia_orgs_seed.json";

async function main() {
  const { supabaseAdmin: supabase } = await import("../lib/supabaseAdmin");
  console.log("Seeding university...");
  const { error: uniError } = await supabase
    .from("university")
    .upsert(seed.university, { onConflict: "id" });
  if (uniError) throw uniError;

  console.log(`Clearing existing ${seed.university.id} orgs before reseeding...`);
  const { error: deleteError } = await supabase
    .from("org")
    .delete()
    .eq("university_id", seed.university.id);
  if (deleteError) throw deleteError;

  console.log(`Seeding ${seed.orgs.length} orgs...`);
  const orgRows = seed.orgs.map((o) => ({
    university_id: seed.university.id,
    name: o.name,
    category: o.category,
    secondary_categories: (o as any).secondaryCategories ?? null,
    description: o.description,
    tags: o.tags,
  }));
  const { error: orgError } = await supabase.from("org").insert(orgRows);
  if (orgError) throw orgError;

  console.log(`Seeding ${QUESTIONS.length} quiz questions...`);
  const questionRows = QUESTIONS.map((q, i) => ({
    id: q.id,
    university_id: null,
    text: q.text,
    options: q.options,
    sort_order: i,
    audience_years: q.audience_years ?? null,
  }));
  const { error: qError } = await supabase
    .from("quiz_question")
    .upsert(questionRows, { onConflict: "id" });
  if (qError) throw qError;

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
