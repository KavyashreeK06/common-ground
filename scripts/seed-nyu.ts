import { config } from "dotenv";
config({ path: ".env.local" });

import seed from "../data/nyu_orgs_seed.json";

async function main() {
  const { supabaseAdmin: supabase } = await import("../lib/supabaseAdmin");

  console.log("Seeding NYU university row...");
  const { error: uniError } = await supabase
    .from("university")
    .upsert(seed.university, { onConflict: "id" });
  if (uniError) throw uniError;

  console.log(`Seeding ${seed.orgs.length} NYU orgs...`);
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

  console.log("NYU seed complete.");
}

main().catch((err) => {
  console.error("NYU seed failed:", err);
  process.exit(1);
});
