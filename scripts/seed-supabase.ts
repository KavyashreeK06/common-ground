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

  console.log(`Seeding ${seed.orgs.length} orgs...`);
  const orgRows = seed.orgs.map((o) => ({
    university_id: seed.university.id,
    name: o.name,
    category: o.category,
    secondary_categories: (o as any).secondaryCategories ?? null,
    description: o.description,
    tags: o.tags,
  }));
  const { error: orgError } = await supabase
    .from("org")
    .upsert(orgRows, { onConflict: "university_id,name" });
  if (orgError) throw orgError;

  console.log(`Seeding ${QUESTIONS.length} quiz questions...`);
  const questionRows = QUESTIONS.map((q, i) => ({
    id: q.id,
    university_id: null,
    text: q.text,
    options: q.options,
    sort_order: i,
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
