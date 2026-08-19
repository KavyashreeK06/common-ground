import { AXES, Axis, AxisVector } from "../types";
import { matchScore } from "../lib/matching";

export interface Archetype {
  name: string;
  blurb: string;
  vector: AxisVector;
  color: string;
  excludedBadgeAxes?: Axis[];
}

export const ARCHETYPES: Archetype[] = [
  {
    name: "Social Spark",
    blurb: "Big rooms don't drain you, they energize you. You're quick to introduce yourself, quick to remember names, and happiest when there's a crowd worth being part of.",
    vector: { structure: 5, competitive: 4, public: 9, group_size: 8, career: 4, physical: 4, creative: 4, cause: 3, novelty: 7, identity: 4 },
    color: "#D9714A",
  },
  {
    name: "Inner-Circle Builder",
    blurb: "You're not chasing a wide social circle. You want depth: the kind of group where people actually know each other, and a smaller room feels like more room to be yourself.",
    vector: { structure: 5, competitive: 2, public: 2, group_size: 2, career: 4, physical: 3, creative: 4, cause: 3, novelty: 4, identity: 5 },
    color: "#8B4A5C",
  },
  {
    name: "Curious Wanderer",
    blurb: "You'd rather try something new than get good at something familiar. Half your best communities started as a random thing you showed up to on a whim.",
    vector: { structure: 2, competitive: 3, public: 5, group_size: 5, career: 3, physical: 4, creative: 5, cause: 3, novelty: 9, identity: 3 },
    color: "#C29B3D",
  },
  {
    name: "Steady Teammate",
    blurb: "You do best when expectations are clear and people are reliable. A regular meeting time and a group that actually shows up matters more to you than spontaneity.",
    vector: { structure: 8, competitive: 2, public: 5, group_size: 5, career: 4, physical: 4, creative: 3, cause: 4, novelty: 1, identity: 3 },
    color: "#6B7350",
  },
  {
    name: "Creative Catalyst",
    blurb: "You'd rather be in a room building, performing, or imagining something together than just discussing it. Community, for you, tends to form around a shared project.",
    vector: { structure: 5, competitive: 2, public: 7, group_size: 5, career: 3, physical: 3, creative: 9, cause: 3, novelty: 6, identity: 3 },
    color: "#C77B5F",
  },
  {
    name: "Driven Challenger",
    blurb: "You like stakes. Structure, competition, a clear way to measure whether you're getting better: that's what pulls you into a group and keeps you coming back.",
    vector: { structure: 8, competitive: 9, public: 6, group_size: 5, career: 5, physical: 6, creative: 2, cause: 2, novelty: 3, identity: 3 },
    color: "#9C3B2E",
  },
  {
    name: "Community Anchor",
    blurb: "You bond with people through shared effort, not shared conversation. Put you next to someone doing real work for something bigger than either of you, and that's where the connection actually forms.",
    vector: { structure: 5, competitive: 2, public: 5, group_size: 5, career: 3, physical: 3, creative: 3, cause: 6, novelty: 3, identity: 6 },
    color: "#B8873A",
    excludedBadgeAxes: ["cause", "identity"],
  },
  {
    name: "Behind-the-Scenes Architect",
    blurb: "You're happiest doing the work that makes an organization actually function: planning, building, organizing. You don't need to be in the spotlight while you do it.",
    vector: { structure: 8, competitive: 4, public: 2, group_size: 3, career: 6, physical: 2, creative: 5, cause: 3, novelty: 3, identity: 2 },
    color: "#4A3D33",
    excludedBadgeAxes: ["career"],
  },
];

export interface Badge {
  name: string;
  axis: Axis;
}

export const BADGES: Badge[] = [
  { name: "Purpose-driven", axis: "cause" },
  { name: "Career-minded", axis: "career" },
  { name: "Movement-powered", axis: "physical" },
  { name: "Identity-centered", axis: "identity" },
];

const BADGE_THRESHOLD = 7;

export type BlendTier = "tie" | "lean" | "clean";

export interface ArchetypeResult {
  primary: Archetype;
  secondary: Archetype | null;
  blendTier: BlendTier;
  badges: string[];
}

export function findArchetypeResult(studentVec: AxisVector): ArchetypeResult {
  const scored = ARCHETYPES.map((archetype) => ({
    archetype,
    score: matchScore(studentVec, archetype.vector),
  })).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];
  const gap = top.score - second.score;

  const blendTier: BlendTier = gap <= 1 ? "tie" : gap <= 3 ? "lean" : "clean";

  const excluded = new Set(top.archetype.excludedBadgeAxes ?? []);
  const badges = BADGES.filter((b) => studentVec[b.axis] >= BADGE_THRESHOLD && !excluded.has(b.axis)).map(
    (b) => b.name
  );

  return {
    primary: top.archetype,
    secondary: blendTier !== "clean" ? second.archetype : null,
    blendTier,
    badges,
  };
}

export function describeBlend(result: ArchetypeResult): string {
  if (result.blendTier === "clean" || !result.secondary) {
    return result.primary.name;
  }
  if (result.blendTier === "tie") {
    return `a mix of ${result.primary.name} and ${result.secondary.name}`;
  }
  return `mostly ${result.primary.name}, with some ${result.secondary.name} energy`;
}
