import { config } from "dotenv";
config({ path: ".env.local" });

import seed from "../data/penn_orgs_seed.json";

async function main() {
  const { supabaseAdmin: supabase } = await import("../lib/supabaseAdmin");

  console.log("Seeding Penn university row...");
  const { error: uniError } = await supabase
    .from("university")
    .upsert(seed.university, { onConflict: "id" });
  if (uniError) throw uniError;

  console.log("Clearing existing Penn orgs before reseeding...");
  const { error: deleteError } = await supabase
    .from("org")
    .delete()
    .eq("university_id", seed.university.id);
  if (deleteError) throw deleteError;

  console.log(`Seeding ${seed.orgs.length} Penn orgs...`);
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

  console.log("Penn seed complete.");
}

main().catch((err) => {
  console.error("Penn seed failed:", err);
  process.exit(1);
});
