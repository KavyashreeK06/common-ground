"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadProfile } from "../../lib/storage";
import { rankOrgs, explainMatch, describeOrgForComparison } from "../../lib/matching";
import { fetchOrgs, logQuizResult, submitFeedback } from "../../lib/data";
import { MatchResult, Org, StudentProfile } from "../../types";
import { ALL_COLUMBIA_EVENTS } from "../../data/events";
import { MAJOR_ORG_KEYWORDS } from "../../data/majors";
import { BACKGROUND_ORG_KEYWORDS } from "../../data/background";
import { POSTGRAD_ORG_KEYWORDS } from "../../data/postgrad";

type Vote = "up" | "down";
const MAX_COMPARE = 3;

export default function ResultsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [quizResultId, setQuizResultId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const loggedRef = useRef(false);

  useEffect(() => {
    Promise.all([Promise.resolve(loadProfile()), fetchOrgs()]).then(([p, { orgs }]) => {
      setProfile(p);
      setOrgs(orgs);
      setLoaded(true);
    });
  }, []);

  if (loaded && !profile) {
    return (
      <main className="page">
        <h1>No quiz results yet</h1>
        <p className="subtitle">Take the quiz first so we can find your matches.</p>
        <Link href="/quiz" className="btn">Take the quiz</Link>
      </main>
    );
  }

  if (!loaded || !profile) {
    return <main className="page">Loading...</main>;
  }

  const majorKeywords = profile.major ? MAJOR_ORG_KEYWORDS[profile.major] : undefined;
  const backgroundKeywords = (profile.background ?? []).flatMap((tag) => BACKGROUND_ORG_KEYWORDS[tag] ?? []);
  const interestKeywords = (profile.intellectualInterests ?? []).flatMap((m) => MAJOR_ORG_KEYWORDS[m] ?? []);
  const internationalKeywords = profile.isInternational ? ["cultural"] : [];
  const postgradKeywords = (profile.postGradInterests ?? []).flatMap((tag) => POSTGRAD_ORG_KEYWORDS[tag] ?? []);
  const boostKeywords = [...(majorKeywords ?? []), ...backgroundKeywords, ...interestKeywords, ...internationalKeywords, ...postgradKeywords];
  const matches = rankOrgs(profile.vector, orgs, undefined, 6, boostKeywords.length > 0 ? boostKeywords : undefined);
  const top3 = matches.slice(0, 3);
  const rest = matches.slice(3);
  const allShown = [...top3, ...rest];

  if (!loggedRef.current && matches.length > 0) {
    loggedRef.current = true;
    logQuizResult("columbia", profile.vector, matches).then(setQuizResultId);
  }

  function handleVote(orgId: string, vote: Vote) {
    setVotes((prev) => ({ ...prev, [orgId]: prev[orgId] === vote ? undefined as any : vote }));
    const newVote = votes[orgId] === vote ? null : vote;
    if (newVote) {
      submitFeedback(orgId, "columbia", newVote, quizResultId);
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

  const yearEvents = ALL_COLUMBIA_EVENTS.filter((e) => {
    const matchesYear = !e.audience_years || e.audience_years.includes(profile.year);
    const matchesMajor =
      !e.audience_majors ||
      (profile.major ? e.audience_majors.includes(profile.major) : false);
    if (e.category === "major_specific") return matchesMajor;
    return matchesYear;
  }).slice(0, 3);

  return (
    <main className="page">
      <h1>Your matches</h1>
      <p className="subtitle">
        Based on your answers, here's where you're most likely to find your people.
        {profile.major && <> Showing extra weight to orgs and events relevant to <strong>{profile.major}</strong>.</>}
        {profile.background && profile.background.length > 0 && (
          <> Also weighting cultural and identity-based orgs relevant to what you shared.</>
        )}
        {profile.intellectualInterests && profile.intellectualInterests.length > 0 && (
          <> Also weighting orgs related to your academic interests.</>
        )}
      </p>

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
          />
        ))}
      </div>

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

      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <Link href="/clubs" className="btn btn-outline">Browse full directory</Link>
        <Link href="/quiz" className="btn btn-outline">Retake quiz</Link>
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
}) {
  return (
    <div className="card" style={highlight ? { borderColor: "var(--accent)" } : undefined}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{org.name}</h3>
        <span className="match-score">{score}%</span>
      </div>
      <span className="pill">{org.category}</span>
      <p style={{ marginTop: 10, marginBottom: 6, color: "var(--ink-soft)" }}>{org.description}</p>
      <p style={{ margin: 0, fontSize: 14, fontStyle: "italic" }}>{explanation}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => onVote("up")}
          aria-pressed={vote === "up"}
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: 13,
            background: vote === "up" ? "var(--accent)" : "transparent",
            color: vote === "up" ? "var(--bg)" : "var(--ink)",
            border: `1.5px solid ${vote === "up" ? "var(--accent)" : "var(--border)"}`,
          }}
        >
          Interested
        </button>
        <button
          type="button"
          onClick={() => onVote("down")}
          aria-pressed={vote === "down"}
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: 13,
            background: vote === "down" ? "var(--ink-soft)" : "transparent",
            color: vote === "down" ? "var(--bg)" : "var(--ink)",
            border: `1.5px solid ${vote === "down" ? "var(--ink-soft)" : "var(--border)"}`,
          }}
        >
          Not for me
        </button>
      </div>

      <button
        type="button"
        className={`compare-toggle ${comparing ? "active" : ""}`}
        onClick={onToggleCompare}
        disabled={compareDisabled}
        aria-pressed={comparing}
      >
        {comparing ? "✓ Added to comparison" : compareDisabled ? "Compare (max 3 reached)" : "+ Add to comparison"}
      </button>
    </div>
  );
}
