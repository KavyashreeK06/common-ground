import { supabase, isSupabaseConfigured } from "./supabase";
import { AxisVector, MatchResult, Org, QuizQuestion, StudentProfile } from "../types";
import columbiaSeed from "../data/columbia_orgs_seed.json";
import nyuSeed from "../data/nyu_orgs_seed.json";
import cornellSeed from "../data/cornell_orgs_seed.json";
import { QUESTIONS as LOCAL_QUESTIONS } from "../data/questions";

function buildLocalOrgs(seed: { university: { id: string }; orgs: any[] }): Org[] {
  return seed.orgs.map((o, i) => ({
    id: `local-${seed.university.id}-${i}`,
    university_id: seed.university.id,
    name: o.name,
    category: o.category,
    secondaryCategories: o.secondaryCategories ?? undefined,
    description: o.description ?? "",
    tags: o.tags,
  }));
}

const LOCAL_ORGS_BY_UNIVERSITY: Record<string, Org[]> = {
  columbia: buildLocalOrgs(columbiaSeed as any),
  nyu: buildLocalOrgs(nyuSeed as any),
  cornell: buildLocalOrgs(cornellSeed as any),
};

export async function fetchOrgs(universityId = "columbia"): Promise<{ orgs: Org[]; source: "supabase" | "local" }> {
  const localFallback = LOCAL_ORGS_BY_UNIVERSITY[universityId] ?? LOCAL_ORGS_BY_UNIVERSITY.columbia;
  if (!isSupabaseConfigured) {
    return { orgs: localFallback, source: "local" };
  }
    try {
    const { data, error } = await supabase
      .from("org")
      .select("id, university_id, name, category, secondary_categories, description, contact_url, tags")
      .eq("university_id", universityId);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Supabase returned no orgs");

    const orgs: Org[] = data.map((row: any) => ({
      id: row.id,
      university_id: row.university_id,
      name: row.name,
      category: row.category,
      secondaryCategories: row.secondary_categories ?? undefined,
      description: row.description,
      contact_url: row.contact_url,
      tags: row.tags,
    }));

    return { orgs, source: "supabase" };
  } catch (err) {
    console.warn("[data] Falling back to local org data -- Supabase fetch failed:", err);
    return { orgs: localFallback, source: "local" };
  }
}

export async function fetchQuestions(): Promise<{ questions: QuizQuestion[]; source: "supabase" | "local" }> {
  if (!isSupabaseConfigured) {
    return { questions: LOCAL_QUESTIONS, source: "local" };
  }
  try {
    const { data, error } = await supabase
      .from("quiz_question")
      .select("id, text, options, audience_years")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Supabase returned no questions");

    return { questions: data as unknown as QuizQuestion[], source: "supabase" };
  } catch (err) {
    console.warn("[data] Falling back to local question bank -- Supabase fetch failed:", err);
    return { questions: LOCAL_QUESTIONS, source: "local" };
  }
}

export async function logQuizResult(
  universityId: string,
  studentVector: AxisVector,
  topMatches: MatchResult[]
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("quiz_result")
      .insert({
        university_id: universityId,
        student_vector: studentVector,
        top_matches: topMatches.map((m) => ({ org_id: m.org.id, org_name: m.org.name, score: m.score })),
      })
      .select("id")
      .single();
    if (error) throw error;
    return data?.id ?? null;
  } catch (err) {
    console.warn("[data] Could not log quiz result (non-blocking):", err);
    return null;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function submitFeedback(
  orgId: string,
  universityId: string,
  vote: "up" | "down",
  quizResultId?: string | null
) {
  if (!isSupabaseConfigured) return;
  if (!UUID_RE.test(orgId)) {
    console.warn("[data] Skipping feedback -- org id isn't a real database id (using local fallback data):", orgId);
    return;
  }
  try {
    const { error } = await supabase.from("org_feedback").insert({
      org_id: orgId,
      university_id: universityId,
      quiz_result_id: quizResultId ?? null,
      vote,
    });
    if (error) throw error;
  } catch (err) {
    console.warn("[data] Could not submit feedback (non-blocking):", err);
  }
}

export interface OrgEditSubmission {
  orgId: string;
  orgName: string;
  proposedDescription: string;
  submitterNote?: string;
  submitterContact?: string;
  userId?: string | null;
}

export async function submitOrgEdit(submission: OrgEditSubmission): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Submissions require a live database connection, which isn't configured right now.");
  }
  if (!UUID_RE.test(submission.orgId)) {
    throw new Error("This org isn't in the live database yet, so edits can't be submitted for it right now.");
  }
  const { error } = await supabase.from("org_submission").insert({
    org_id: submission.orgId,
    org_name: submission.orgName,
    proposed_description: submission.proposedDescription,
    submitter_note: submission.submitterNote || null,
    submitter_contact: submission.submitterContact || null,
    submitted_by_user_id: submission.userId || null,
  });
  if (error) throw error;
}

export async function saveProfileToCloud(userId: string, profile: StudentProfile): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from("user_profile").upsert({
      user_id: userId,
      university_id: profile.universityId ?? "columbia",
      year: profile.year,
      vector: profile.vector,
      goals: profile.goals,
      major: profile.major ?? null,
      background: profile.background ?? null,
      intellectual_interests: profile.intellectualInterests ?? null,
      is_international: profile.isInternational ?? null,
      postgrad_interests: profile.postGradInterests ?? null,
      name: profile.name ?? null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (err) {
    console.warn("[data] Could not save profile to cloud (non-blocking):", err);
  }
}

export async function fetchProfileFromCloud(userId: string): Promise<StudentProfile | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      year: data.year,
      vector: data.vector,
      goals: data.goals ?? [],
      major: data.major ?? undefined,
      background: data.background ?? undefined,
      intellectualInterests: data.intellectual_interests ?? undefined,
      isInternational: data.is_international ?? undefined,
      postGradInterests: data.postgrad_interests ?? undefined,
      name: data.name ?? undefined,
      universityId: data.university_id ?? "columbia",
    };
  } catch (err) {
    console.warn("[data] Could not fetch profile from cloud:", err);
    return null;
  }
}

export async function fetchOrgUpvoteCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured) return {};
  try {
    const { data, error } = await supabase
      .from("org_feedback")
      .select("org_id, vote")
      .eq("vote", "up");
    if (error) throw error;
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.org_id] = (counts[row.org_id] ?? 0) + 1;
    }
    return counts;
    } catch (err) {
    console.warn("[data] Could not fetch social proof counts:", err);
    return {};
  }
}

export async function fetchSavedOrgIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("saved_org")
      .select("org_id")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((row) => row.org_id);
  } catch (err) {
    console.warn("[data] Could not fetch saved orgs:", err);
    return [];
  }
}

export async function saveOrgToCloud(userId: string, orgId: string, universityId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from("saved_org").upsert({
      user_id: userId,
      org_id: orgId,
      university_id: universityId,
    });
    if (error) throw error;
  } catch (err) {
    console.warn("[data] Could not save org (non-blocking):", err);
  }
}

export async function unsaveOrgFromCloud(userId: string, orgId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from("saved_org")
      .delete()
      .eq("user_id", userId)
      .eq("org_id", orgId);
    if (error) throw error;
  } catch (err) {
    console.warn("[data] Could not unsave org (non-blocking):", err);
  }
}
