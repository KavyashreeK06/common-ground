"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadProfile } from "../../lib/storage";
import { LoadingPage } from "../../components/Loading";
import { rankOrgs, explainMatch, describeOrgForComparison, describeStudent } from "../../lib/matching";
import { fetchOrgs, logQuizResult, submitFeedback, fetchProfileFromCloud, fetchOrgUpvoteCounts } from "../../lib/data";
import { getCurrentUser } from "../../lib/auth";
import { MatchResult, Org, StudentProfile } from "../../types";
import { EVENTS_BY_UNIVERSITY } from "../../data/events";
import { MAJOR_ORG_KEYWORDS } from "../../data/majors";
import { BACKGROUND_ORG_KEYWORDS } from "../../data/background";
import { POSTGRAD_ORG_KEYWORDS } from "../../data/postgrad";
import { RELIGION_ORG_KEYWORDS } from "../../data/religion";
import { CAUSE_ORG_KEYWORDS } from "../../data/causes";
import { findArchetypeResult, describeBlend } from "../../data/archetypes";
import { recommendSection } from "../../content/belonging";
import { CategoryIcon } from "../../components/CategoryIcon";
import { SaveButton } from "../../components/SaveButton";
import { useSavedOrgs } from "../../lib/useSavedOrgs";
import {
  Award, ThumbsUp, ThumbsDown, Check, Plus, Sliders,
  Users, Heart, Compass, Clock, Palette, Trophy, Anchor, Settings, Flag, Briefcase, Footprints, Fingerprint,
} from "lucide-react";

const ARCHETYPE_ICONS: Record<string, typeof Users> = {
  "Social Spark": Users,
  "Inner-Circle Builder": Heart,
  "Curious Wanderer": Compass,
  "Steady Teammate": Clock,
  "Creative Catalyst": Palette,
  "Driven Challenger": Trophy,
  "Community Anchor": Anchor,
  "Behind-the-Scenes Architect": Settings,
};

const BADGE_ICONS: Record<string, typeof Flag> = {
  "Purpose-driven": Flag,
  "Career-minded": Briefcase,
  "Movement-powered": Footprints,
  "Identity-centered": Fingerprint,
};

type Vote = "up" | "down";
const MAX_COMPARE = 3;

export default function ResultsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [quizResultId, setQuizResultId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const loggedRef = useRef(false);
  const { savedIds, toggleSave, signedIn } = useSavedOrgs(profile?.universityId ?? "columbia");

  useEffect(() => {
    async function load() {
      const localProfile = loadProfile();
      const user = await getCurrentUser();

      let finalProfile = localProfile;
      if (user) {
        const cloudProfile = await fetchProfileFromCloud(user.id);
        if (cloudProfile) finalProfile = cloudProfile;
      }

      const universityId = finalProfile?.universityId ?? "columbia";
      const [{ orgs }, counts] = await Promise.all([
        fetchOrgs(universityId),
        fetchOrgUpvoteCounts(),
      ]);

      setProfile(finalProfile);
      setOrgs(orgs);
      setUpvoteCounts(counts);
      setLoaded(true);
    }
    load();
  }, []);

  if (loaded && !profile) {
    return (
      <main className="page">
        <h1>No quiz results yet</h1>
        <p className="subtitle">Take the quiz first so we can find your matches.</p>
        <Link href="/" className="btn">Choose your school</Link>
      </main>
    );
  }

  if (!loaded || !profile) {
    return <LoadingPage />;
  }

  const universityId = profile.universityId ?? "columbia";
  const majorKeywords = profile.major ? MAJOR_ORG_KEYWORDS[profile.major] : undefined;
  const backgroundKeywords = (profile.background ?? []).flatMap((tag) => BACKGROUND_ORG_KEYWORDS[tag] ?? []);
  const interestKeywords = (profile.intellectualInterests ?? []).flatMap((m) => MAJOR_ORG_KEYWORDS[m] ?? []);
  const internationalKeywords = profile.isInternational ? ["cultural"] : [];
  const postgradKeywords = (profile.postGradInterests ?? []).flatMap((tag) => POSTGRAD_ORG_KEYWORDS[tag] ?? []);
  const religionKeywords = (profile.religiousTraditions ?? []).flatMap((tag) => RELIGION_ORG_KEYWORDS[tag] ?? []);
  const causeKeywords = (profile.causes ?? []).flatMap((tag) => CAUSE_ORG_KEYWORDS[tag] ?? []);
  const boostKeywords = [
    ...(majorKeywords ?? []),
    ...backgroundKeywords,
    ...interestKeywords,
    ...internationalKeywords,
    ...postgradKeywords,
    ...religionKeywords,
    ...causeKeywords,
  ];
  const matches = rankOrgs(profile.vector, orgs, undefined, 6, boostKeywords.length > 0 ? boostKeywords : undefined);
  const top3 = matches.slice(0, 3);

  const shownIds = new Set(top3.map((m) => m.org.id));
  function spotlightPick(lensKeywords: string[]): MatchResult | null {
    if (lensKeywords.length === 0) return null;
    const ranked = rankOrgs(profile!.vector, orgs, undefined, orgs.length, lensKeywords);
    const pick = ranked.find((m) => !shownIds.has(m.org.id));
    if (pick) shownIds.add(pick.org.id);
    return pick ?? null;
  }
  const culturalSpotlight = spotlightPick([...backgroundKeywords, ...religionKeywords]);
  const causeSpotlight = spotlightPick(causeKeywords);
  const careerSpotlight = spotlightPick([...(majorKeywords ?? []), ...postgradKeywords, ...interestKeywords]);
  const spotlights = [
    { label: "Best cultural / community fit", match: culturalSpotlight },
    { label: "Best cause-driven fit", match: causeSpotlight },
    { label: "Best career / academic fit", match: careerSpotlight },
  ].filter((s): s is { label: string; match: MatchResult } => s.match !== null);

  const rest = matches.slice(3).filter((m) => !shownIds.has(m.org.id));
  const allShown = [...top3, ...spotlights.map((s) => s.match), ...rest];

  const archetypeResult = findArchetypeResult(profile.vector);
  const ArchetypeIcon = ARCHETYPE_ICONS[archetypeResult.primary.name];
  const traits = describeStudent(profile.vector, 2);

  if (!loggedRef.current && matches.length > 0) {
    loggedRef.current = true;
    logQuizResult(universityId, profile.vector, matches).then(setQuizResultId);
  }

  function handleVote(orgId: string, vote: Vote) {
    setVotes((prev) => ({ ...prev, [orgId]: prev[orgId] === vote ? undefined as any : vote }));
    const newVote = votes[orgId] === vote ? null : vote;
    if (newVote) {
      submitFeedback(orgId, universityId, newVote, quizResultId);
    }
  }

  function toggleCompare(orgId: string) {
    setCompareIds((prev) => {
      if (prev.includes(orgId)) return prev.filter((id) => id !== orgId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, orgId];
    });
  }

  const compareMatches: MatchResult[] = compareIds
    .map((id) => allShown.find((m) => m.org.id === id))
    .filter((m): m is MatchResult => Boolean(m));

  const yearEvents = (EVENTS_BY_UNIVERSITY[universityId] ?? []).filter((e) => {
    const matchesYear = !e.audience_years || e.audience_years.includes(profile.year);
    const matchesMajor =
      !e.audience_majors ||
      (profile.major ? e.audience_majors.includes(profile.major) : false);
    if (e.category === "major_specific") return matchesMajor;
    return matchesYear;
  }).slice(0, 3);

    const extraFactors: string[] = [];
  if (profile.background && profile.background.length > 0) extraFactors.push("cultural and identity-based orgs");
  if (profile.intellectualInterests && profile.intellectualInterests.length > 0) extraFactors.push("your academic interests");
  if (profile.religiousTraditions && profile.religiousTraditions.length > 0) extraFactors.push("the faith communities you shared");
  if (profile.causes && profile.causes.length > 0) extraFactors.push("the causes you care about");

  function joinWithAnd(items: string[]): string {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
  }

  return (
    <main className="page">
      <h1>{profile.name ? `${profile.name}'s matches` : "Your matches"}</h1>
      <p className="subtitle">
        {profile.name ? `${profile.name}, here's` : "Here's"} where you're most likely to find your people.
        {profile.major && <> We're also giving extra weight to orgs and events relevant to <strong>{profile.major}</strong>.</>}
        {extraFactors.length > 0 && <> We're also weighting {joinWithAnd(extraFactors)}.</>}
      </p>

      <div className="card" style={{ marginBottom: 20, borderColor: archetypeResult.primary.color }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `${archetypeResult.primary.color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArchetypeIcon size={28} strokeWidth={2} color={archetypeResult.primary.color} aria-hidden="true" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Your type
            </p>
            <h2 style={{ margin: "2px 0 0" }}>{describeBlend(archetypeResult)}</h2>
          </div>
        </div>
        <p style={{ marginTop: 14, marginBottom: 12 }}>{archetypeResult.primary.blurb}</p>
        {traits.length > 0 && (
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>
            A couple things that stood out: you {traits[0]}{traits[1] ? ` and ${traits[1]}` : ""}.
          </p>
        )}
        {archetypeResult.badges.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {archetypeResult.badges.map((badgeName) => {
              const BadgeIcon = BADGE_ICONS[badgeName];
              return (
                <span key={badgeName} className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <BadgeIcon size={12} strokeWidth={2} aria-hidden="true" />
                  {badgeName}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          This is a fun, algorithm-generated read on your answers -- not a diagnosis. The real way to
          get a feel for a club is to show up to a meeting and meet the people in it.{" "}
          <Link href={`/school/${universityId}/explore`} style={{ color: "var(--accent)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Sliders size={13} strokeWidth={2} aria-hidden="true" />
            Play with the sliders yourself →
          </Link>
        </p>
      </div>

      <details style={{ marginBottom: 28, fontSize: 14, color: "var(--ink-soft)" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--ink)" }}>
          How is this percentage calculated?
        </summary>
        <div style={{ marginTop: 10, maxWidth: "60ch" }}>
          <p>
            You and every club get scored on 10 personality axes -- things like structured vs.
            spontaneous, competitive vs. collaborative, public-facing vs. behind-the-scenes. Your
            quiz answers shift your score on each axis; the match % is based on how close your 10
            numbers are to a club's 10 numbers.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you shared a major, intellectual interests, cultural background, or international
            status, clubs whose name or category matches those get a small additional boost on top
            -- enough to move them up in the ranking, not enough to override a genuinely poor
            personality fit.
          </p>
        </div>
      </details>

      {compareMatches.length >= 2 && (
        <>
          <h2>Comparing {compareMatches.length} orgs</h2>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th></th>
                  {compareMatches.map((m) => (
                    <th key={m.org.id}>{m.org.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Match</td>
                  {compareMatches.map((m) => (
                    <td key={m.org.id}><strong>{m.score}%</strong></td>
                  ))}
                </tr>
                <tr>
                  <td>Category</td>
                  {compareMatches.map((m) => (
                    <td key={m.org.id}>{m.org.category}</td>
                  ))}
                </tr>
                {describeOrgForComparison(compareMatches[0].org).map((attr, i) => (
                  <tr key={attr.label}>
                    <td>{attr.label}</td>
                    {compareMatches.map((m) => (
                      <td key={m.org.id}>{describeOrgForComparison(m.org)[i].value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Best fits for you</h2>
      <div className="grid grid-2">
        {top3.map((m) => (
          <MatchCard
            key={m.org.id}
            org={m.org}
            score={m.score}
            explanation={explainMatch(profile.vector, m.org)}
            highlight
            vote={votes[m.org.id]}
            onVote={(v) => handleVote(m.org.id, v)}
            comparing={compareIds.includes(m.org.id)}
            compareDisabled={compareIds.length >= MAX_COMPARE && !compareIds.includes(m.org.id)}
            onToggleCompare={() => toggleCompare(m.org.id)}
            upvotes={upvoteCounts[m.org.id] ?? 0}
            saved={savedIds.has(m.org.id)}
            onToggleSave={() => toggleSave(m.org.id)}
            signedIn={signedIn}
          />
        ))}
      </div>

      {spotlights.length > 0 && (
        <>
          <h2>Different sides of you</h2>
          <p className="subtitle" style={{ marginTop: -8 }}>
            A few more picks, each based on just one thing you shared -- not already in your top matches above.
          </p>
          <div className="grid grid-2">
            {spotlights.map(({ label, match }) => (
              <div key={match.org.id}>
                <span className="pill pill-terracotta" style={{ marginBottom: 8, display: "inline-block" }}>{label}</span>
                <MatchCard
                  org={match.org}
                  score={match.score}
                  explanation={explainMatch(profile.vector, match.org)}
                  vote={votes[match.org.id]}
                  onVote={(v) => handleVote(match.org.id, v)}
                  comparing={compareIds.includes(match.org.id)}
                  compareDisabled={compareIds.length >= MAX_COMPARE && !compareIds.includes(match.org.id)}
                  onToggleCompare={() => toggleCompare(match.org.id)}
                  upvotes={upvoteCounts[match.org.id] ?? 0}
                  saved={savedIds.has(match.org.id)}
                  onToggleSave={() => toggleSave(match.org.id)}
                  signedIn={signedIn}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <>
          <h2>Worth a look too</h2>
          <div className="grid grid-2">
            {rest.map((m) => (
              <MatchCard
                key={m.org.id}
                org={m.org}
                score={m.score}
                explanation={explainMatch(profile.vector, m.org)}
                vote={votes[m.org.id]}
                onVote={(v) => handleVote(m.org.id, v)}
                comparing={compareIds.includes(m.org.id)}
                compareDisabled={compareIds.length >= MAX_COMPARE && !compareIds.includes(m.org.id)}
                onToggleCompare={() => toggleCompare(m.org.id)}
                upvotes={upvoteCounts[m.org.id] ?? 0}
                saved={savedIds.has(m.org.id)}
                onToggleSave={() => toggleSave(m.org.id)}
                signedIn={signedIn}
              />
            ))}
          </div>
        </>
      )}

      {yearEvents.length > 0 && (
        <>
          <h2>Coming up for you</h2>
          <div className="grid grid-2">
            {yearEvents.map((e) => (
              <div key={e.id} className="card">
                <span className="pill pill-terracotta">{e.timing}</span>
                <h3 style={{ marginTop: 10 }}>{e.name}</h3>
                <p style={{ margin: 0, color: "var(--ink-soft)" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <p style={{ margin: 0 }}>
          Clubs are one piece of finding your footing here.{" "}
          <Link href={`/school/${universityId}/belonging/${recommendSection(profile)}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
            Read what belonging might look like for you →
          </Link>
        </p>
      </div>

      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <Link href={`/school/${universityId}/clubs`} className="btn btn-outline">Browse full directory</Link>
        <Link href={`/quiz?school=${universityId}`} className="btn btn-outline">Retake quiz</Link>
      </div>

      {compareIds.length > 0 && (
        <div className="compare-bar">
          <span style={{ fontSize: 14 }}>
            {compareIds.length} selected to compare{compareIds.length < 2 ? " -- pick at least one more" : ""}
          </span>
          <button
            type="button"
            className="btn-outline"
            style={{ background: "transparent", borderColor: "var(--bg)", color: "var(--bg)" }}
            onClick={() => setCompareIds([])}
          >
            Clear
          </button>
        </div>
      )}
    </main>
  );
}

function MatchCard({
  org,
  score,
  explanation,
  highlight,
  vote,
  onVote,
  comparing,
  compareDisabled,
  onToggleCompare,
  upvotes,
  saved,
  onToggleSave,
  signedIn,
}: {
  org: Org;
  score: number;
  explanation: string;
  highlight?: boolean;
  vote?: Vote;
  onVote: (v: Vote) => void;
  comparing: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  upvotes: number;
  saved: boolean;
  onToggleSave: () => void;
  signedIn: boolean;
}) {
  return (
    <div className="card" style={highlight ? { borderColor: "var(--accent)" } : undefined}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{org.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {signedIn && <SaveButton saved={saved} onToggle={onToggleSave} />}
          <span className="match-score">
            <Award size={14} strokeWidth={2} aria-hidden="true" />
            <span>{score}%</span>
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <CategoryIcon category={org.category} />
          {org.category}
        </span>
        {(org.secondaryCategories ?? []).map((c) => (
          <span
            key={c}
            className="pill"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, opacity: 0.7 }}
          >
            <CategoryIcon category={c} />
            {c}
          </span>
        ))}
      </div>
      {upvotes > 0 && (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--terracotta)", fontWeight: 600 }}>
          {upvotes} {upvotes === 1 ? "student" : "students"} marked this as a fit
        </p>
      )}
      <p style={{ marginTop: 10, marginBottom: 6, color: "var(--ink-soft)" }}>{org.description}</p>
      <p style={{ margin: 0, fontSize: 14, fontStyle: "italic" }}>{explanation}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => onVote("up")}
          aria-pressed={vote === "up"}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 12px",
            fontSize: 13,
            background: vote === "up" ? "var(--accent)" : "transparent",
            color: vote === "up" ? "var(--bg)" : "var(--ink)",
            border: `1.5px solid ${vote === "up" ? "var(--accent)" : "var(--border)"}`,
          }}
        >
          <ThumbsUp size={14} strokeWidth={2} aria-hidden="true" />
          Interested
        </button>
        <button
          type="button"
          onClick={() => onVote("down")}
          aria-pressed={vote === "down"}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 12px",
            fontSize: 13,
            background: vote === "down" ? "var(--ink-soft)" : "transparent",
            color: vote === "down" ? "var(--bg)" : "var(--ink)",
            border: `1.5px solid ${vote === "down" ? "var(--ink-soft)" : "var(--border)"}`,
          }}
        >
          <ThumbsDown size={14} strokeWidth={2} aria-hidden="true" />
          Not for me
        </button>
      </div>

      <button
        type="button"
        className={`compare-toggle ${comparing ? "active" : ""}`}
        onClick={onToggleCompare}
        disabled={compareDisabled}
        aria-pressed={comparing}
        style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
      >
        {comparing ? (
          <>
            <Check size={14} strokeWidth={2} aria-hidden="true" /> Added to comparison
          </>
        ) : compareDisabled ? (
          "Compare (max 3 reached)"
        ) : (
          <>
            <Plus size={14} strokeWidth={2} aria-hidden="true" /> Add to comparison
          </>
        )}
      </button>
    </div>
  );
}
