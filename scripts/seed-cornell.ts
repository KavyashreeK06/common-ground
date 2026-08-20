import { config } from "dotenv";
config({ path: ".env.local" });

import seed from "../data/cornell_orgs_seed.json";

async function main() {
  const { supabaseAdmin: supabase } = await import("../lib/supabaseAdmin");

  console.log("Seeding Cornell university row...");
  const { error: uniError } = await supabase
    .from("university")
    .upsert(seed.university, { onConflict: "id" });
  if (uniError) throw uniError;

  console.log("Clearing existing Cornell orgs before reseeding...");
  const { error: deleteError } = await supabase
    .from("org")
    .delete()
    .eq("university_id", seed.university.id);
  if (deleteError) throw deleteError;

  console.log(`Seeding ${seed.orgs.length} Cornell orgs...`);
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

  console.log("Cornell seed complete.");
}

main().catch((err) => {
  console.error("Cornell seed failed:", err);
  process.exit(1);
});
