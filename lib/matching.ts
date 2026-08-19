import { AXES, Axis, AxisVector, MatchResult, Org, QuizAnswerOption } from "../types";

export function buildStudentVector(chosenOptions: QuizAnswerOption[]): AxisVector {
  const vector = Object.fromEntries(AXES.map((a) => [a, 5])) as AxisVector;

  for (const option of chosenOptions) {
    for (const [axis, delta] of Object.entries(option.deltas) as [Axis, number][]) {
      vector[axis] += delta;
    }
  }

  for (const axis of AXES) {
    vector[axis] = clamp(vector[axis], 0, 10);
  }

  return vector;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function matchScore(
  studentVec: AxisVector,
  orgVec: AxisVector,
  axisWeights: Partial<Record<Axis, number>> = {}
): number {
  let sumSqDiff = 0;
  let totalWeight = 0;

  for (const axis of AXES) {
    const weight = axisWeights[axis] ?? 1;
    const diff = studentVec[axis] - orgVec[axis];
    sumSqDiff += weight * diff * diff;
    totalWeight += weight;
  }

  const rmse = Math.sqrt(sumSqDiff / totalWeight);
  const score = 100 * (1 - rmse / 10);
  return Math.round(clamp(score, 0, 100));
}

export function rankOrgs(
  studentVec: AxisVector,
  orgs: Org[],
  axisWeights?: Partial<Record<Axis, number>>,
  topN = 5,
  majorKeywords?: string[],
  majorBoost = 12
): MatchResult[] {
  return orgs
    .map((org) => {
      let score = matchScore(studentVec, org.tags, axisWeights);
      if (majorKeywords && majorKeywords.length > 0) {
        const haystack = `${org.name} ${org.category}`.toLowerCase();
        const isRelevant = majorKeywords.some((kw) => haystack.includes(kw.toLowerCase()));
        if (isRelevant) score = Math.min(100, score + majorBoost);
      }
      return { org, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function findSimilarOrgs(target: Org, allOrgs: Org[], topN = 4): MatchResult[] {
  return allOrgs
    .filter((o) => o.id !== target.id)
    .map((org) => ({ org, score: matchScore(target.tags, org.tags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export const AXIS_PHRASES: Record<Axis, [string, string]> = {
  structure: ["prefers a casual, spontaneous vibe", "thrives with structure and routine"],
  competitive: ["values collaboration over competition", "is drawn to competition"],
  public: ["prefers working behind the scenes", "enjoys being in the spotlight"],
  group_size: ["prefers small, tight-knit groups", "loves big-group energy"],
  career: ["just wants something fun, no career pressure", "is career- and resume-minded"],
  physical: ["prefers discussion over physical activity", "wants to stay active"],
  creative: ["thinks analytically and technically", "is creatively driven"],
  cause: ["wants to build a specific craft or skill", "cares about advocacy and causes"],
  novelty: ["likes going deep on one specialty", "likes exploring lots of new things"],
  identity: ["values shared interests above all", "values shared identity and background"],
};

export function explainMatch(studentVec: AxisVector, org: Org): string {
  const diffs = AXES.map((axis) => ({
    axis,
    diff: Math.abs(studentVec[axis] - org.tags[axis]),
    studentLow: studentVec[axis] <= 5,
  }));

  diffs.sort((a, b) => a.diff - b.diff);
  const topTwo = diffs.slice(0, 2);

  const phrases = topTwo.map(({ axis, studentLow }) => AXIS_PHRASES[axis][studentLow ? 0 : 1]);

  return `You matched with ${org.name} because you ${phrases[0]} and ${phrases[1]}.`;
}

export function describeStudent(studentVec: AxisVector, n = 3): string[] {
  const diffs = AXES.map((axis) => ({
    axis,
    magnitude: Math.abs(studentVec[axis] - 5),
    isHigh: studentVec[axis] > 5,
  }));
  diffs.sort((a, b) => b.magnitude - a.magnitude);
  return diffs.slice(0, n).map(({ axis, isHigh }) => AXIS_PHRASES[axis][isHigh ? 1 : 0]);
}

export interface ComparisonAttribute {
  label: string;
  value: string;
}

const COMPARISON_AXES: { axis: Axis; label: string; low: string; high: string }[] = [
  { axis: "group_size", label: "Group size", low: "Small & tight-knit", high: "Large & energetic" },
  { axis: "structure", label: "Commitment style", low: "Casual, drop-in", high: "Structured, scheduled" },
  { axis: "competitive", label: "Vibe", low: "Collaborative", high: "Competitive" },
  { axis: "public", label: "Visibility", low: "Behind-the-scenes", high: "Public-facing" },
  { axis: "career", label: "Focus", low: "Just for fun", high: "Career-oriented" },
  { axis: "physical", label: "Energy", low: "Discussion-based", high: "Physically active" },
];

export function describeOrgForComparison(org: Org): ComparisonAttribute[] {
  return COMPARISON_AXES.map(({ axis, label, low, high }) => {
    const score = org.tags[axis];
    const value = score <= 3 ? low : score >= 7 ? high : "Mixed / balanced";
    return { label, value };
  });
}
