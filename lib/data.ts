import { supabase, isSupabaseConfigured } from "./supabase";
import { AxisVector, MatchResult, Org, QuizQuestion, StudentProfile } from "../types";
import localSeed from "../data/columbia_orgs_seed.json";
import { QUESTIONS as LOCAL_QUESTIONS } from "../data/questions";

const LOCAL_ORGS: Org[] = (localSeed.orgs as any[]).map((o, i) => ({
  id: `local-${i}`,
  university_id: "columbia",
  name: o.name,
  category: o.category,
  description: o.description ?? "",
  tags: o.tags,
}));

export async function fetchOrgs(universityId = "columbia"): Promise<{ orgs: Org[]; source: "supabase" | "local" }> {
  if (!isSupabaseConfigured) {
    return { orgs: LOCAL_ORGS, source: "local" };
  }
  try {
    const { data, error } = await supabase
      .from("org")
      .select("id, university_id, name, category, description, contact_url, tags")
      .eq("university_id", universityId);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Supabase returned no orgs");

    return { orgs: data as Org[], source: "supabase" };
  } catch (err) {
    console.warn("[data] Falling back to local org data -- Supabase fetch failed:", err);
    return { orgs: LOCAL_ORGS, source: "local" };
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
      university_id: "columbia",
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
