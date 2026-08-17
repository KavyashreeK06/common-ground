/**
 * Run with: npx tsx scripts/test-matching.ts
 *
 * Sanity-checks the matching engine against the Columbia seed data using two
 * deliberately opposite fake personas, so we can eyeball whether the
 * rankings make intuitive sense before wiring up any UI or database.
 */
import { buildStudentVector, rankOrgs, explainMatch } from "../lib/matching";
import { QuizAnswerOption, Org } from "../types";
import seed from "../data/columbia_orgs_seed.json";

const orgs = seed.orgs as unknown as Org[];

// Persona A: competitive, public-performance, large-group, low career focus,
// physical, creative — should land on things like Bhangra / Ballet / Marching Band.
const personaA: QuizAnswerOption[] = [
  { label: "", deltas: { public: 3, competitive: 3, group_size: 2, physical: 2, creative: 2, career: -3 } },
];

// Persona B: quiet, small-group, career-focused, analytical, craft-driven —
// should land on things like ACM / CU Cyber / SWE / Neuroscience Society.
const personaB: QuizAnswerOption[] = [
  { label: "", deltas: { public: -3, competitive: -3, group_size: -3, career: 3, creative: -3, cause: -3 } },
];

function runPersona(name: string, options: QuizAnswerOption[]) {
  const vec = buildStudentVector(options);
  const results = rankOrgs(vec, orgs, undefined, 5);

  console.log(`\n=== ${name} ===`);
  console.log("Student vector:", vec);
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.org.name} — ${r.score}% match`);
    console.log(`   ${explainMatch(vec, r.org)}`);
  });
}

runPersona("Persona A (performance/competitive/physical)", personaA);
runPersona("Persona B (quiet/career/analytical)", personaB);
