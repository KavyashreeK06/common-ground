"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Org } from "../../../../types";
import { fetchOrgs, submitOrgEdit, fetchOrgUpvoteCounts } from "../../../../lib/data";
import { getCurrentUser } from "../../../../lib/auth";
import { describeOrgForComparison, findSimilarOrgs } from "../../../../lib/matching";
import { CategoryIcon } from "../../../../components/CategoryIcon";
import { UNIVERSITIES } from "../../../../data/universities";
import { Check, Plus, SearchX, Pencil, Shuffle } from "lucide-react";
import { LoadingSpinner } from "../../../../components/Loading";
import { SaveButton } from "../../../../components/SaveButton";
import { useSavedOrgs } from "../../../../lib/useSavedOrgs";

const MAX_COMPARE = 3;

export default function ClubsPage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);
  const { savedIds, toggleSave, signedIn } = useSavedOrgs(params.schoolId);

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [dataSource, setDataSource] = useState<"supabase" | "local" | null>(null);
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (!school) return;
    Promise.all([fetchOrgs(school.id), fetchOrgUpvoteCounts(), getCurrentUser()]).then(
      ([{ orgs, source }, counts, currentUser]) => {
        setOrgs(orgs);
        setDataSource(source);
        setUpvoteCounts(counts);
        setUser(currentUser);
        setLoading(false);
      }
    );
  }, [school]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    orgs.forEach((o) => {
      set.add(o.category);
      (o.secondaryCategories ?? []).forEach((c) => set.add(c));
    });
    return ["all", ...Array.from(set).sort()];
  }, [orgs]);

  const filtered = useMemo(() => {
    return orgs.filter((o) => {
      const matchesQuery = o.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        category === "all" ||
        o.category === category ||
        (o.secondaryCategories ?? []).includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [orgs, query, category]);

  function toggleCompare(orgId: string) {
    setCompareIds((prev) => {
      if (prev.includes(orgId)) return prev.filter((id) => id !== orgId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, orgId];
    });
  }

  const compareOrgs = compareIds
    .map((id) => orgs.find((o) => o.id === id))
    .filter((o): o is Org => Boolean(o));

  if (!school) {
    return (
      <main className="page">
        <h1>Unknown school</h1>
        <p className="subtitle">
          We don't recognize that school. <Link href="/" style={{ color: "var(--accent)" }}>Choose a school →</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <Link href={`/school/${school.id}`} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← Back to {school.shortName}
      </Link>

      <h1 style={{ marginTop: 16 }}>{school.shortName} club directory</h1>
      <p className="subtitle">
        Search, filter, or select up to {MAX_COMPARE} to compare side by side.
        {dataSource === "local" && (
          <span style={{ display: "block", fontSize: 13, color: "var(--terracotta)", marginTop: 4 }}>
            Showing bundled data -- couldn't reach the live database.
          </span>
        )}
      </p>

      {loading ? (
        <LoadingSpinner label="Loading clubs..." />
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="Search clubs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
              ))}
            </select>
          </div>

          {compareOrgs.length >= 2 && (
            <>
              <h2>Comparing {compareOrgs.length} clubs</h2>
              <div className="compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th></th>
                      {compareOrgs.map((o) => (
                        <th key={o.id}>{o.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Category</td>
                      {compareOrgs.map((o) => (
                        <td key={o.id}>{o.category}</td>
                      ))}
                    </tr>
                    {describeOrgForComparison(compareOrgs[0]).map((attr, i) => (
                      <tr key={attr.label}>
                        <td>{attr.label}</td>
                        {compareOrgs.map((o) => (
                          <td key={o.id}>{describeOrgForComparison(o)[i].value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{orgs.length} organizations -- {filtered.length} shown</p>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <SearchX size={28} strokeWidth={1.5} aria-hidden="true" />
              <p style={{ margin: 0, fontWeight: 600 }}>No clubs match that search</p>
              <p style={{ margin: 0, fontSize: 14 }}>Try a different keyword or clear the category filter.</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {filtered.map((o) => (
                <ClubCard
                  key={o.id}
                  org={o}
                  allOrgs={orgs}
                  comparing={compareIds.includes(o.id)}
                  compareDisabled={compareIds.length >= MAX_COMPARE && !compareIds.includes(o.id)}
                  onToggleCompare={() => toggleCompare(o.id)}
                  upvotes={upvoteCounts[o.id] ?? 0}
                  user={user}
                  saved={savedIds.has(o.id)}
                  onToggleSave={() => toggleSave(o.id)}
                  signedIn={signedIn}
                />
              ))}
            </div>
          )}
        </>
      )}

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

function ClubCard({
  org,
  allOrgs,
  comparing,
  compareDisabled,
  onToggleCompare,
  upvotes,
  user,
  saved,
  onToggleSave,
  signedIn,
}: {
  org: Org;
  allOrgs: Org[];
  comparing: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  upvotes: number;
  user: User | null;
  saved: boolean;
  onToggleSave: () => void;
  signedIn: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(org.description);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState(user?.email ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSimilar, setShowSimilar] = useState(false);

  async function handleSubmit() {
    if (!description.trim()) return;
    setStatus("submitting");
    try {
      await submitOrgEdit({
        orgId: org.id,
        orgName: org.name,
        proposedDescription: description.trim(),
        submitterNote: note.trim() || undefined,
        submitterContact: contact.trim() || undefined,
        userId: user?.id ?? null,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong submitting this.");
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0 }}>{org.name}</h3>
        {signedIn && <SaveButton saved={saved} onToggle={onToggleSave} />}
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
      {org.description && (
        <p style={{ marginTop: 10, marginBottom: 0, color: "var(--ink-soft)" }}>{org.description}</p>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
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
            "Compare (max 3)"
          ) : (
            <>
              <Plus size={14} strokeWidth={2} aria-hidden="true" /> Compare
            </>
          )}
        </button>
        {status !== "success" && (
          <button
            type="button"
            className="compare-toggle"
            onClick={() => setEditing((v) => !v)}
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            {editing ? (
              "Cancel"
            ) : (
              <>
                <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Suggest an edit
              </>
            )}
          </button>
        )}
        <button
          type="button"
          className="compare-toggle"
          onClick={() => setShowSimilar((v) => !v)}
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <Shuffle size={13} strokeWidth={2} aria-hidden="true" />
          {showSimilar ? "Hide similar clubs" : "View similar clubs"}
        </button>
      </div>

      {showSimilar && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 8px" }}>
            Clubs with a similar personality profile:
          </p>
          {findSimilarOrgs(org, allOrgs, 4).map((r) => (
            <div key={r.org.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0" }}>
              <span>{r.org.name}</span>
              <span style={{ color: "var(--ink-soft)" }}>{r.score}% similar</span>
            </div>
          ))}
        </div>
      )}

      {editing && status !== "success" && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Are you part of this org? Suggest a better description:
          </label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: 8, resize: "vertical" }}
          />
          <input
            className="input"
            placeholder="Anything else we should know? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            className="input"
            placeholder="Your email, if you'd like a follow-up (optional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          {user && (
            <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 8px" }}>
              Submitting as signed-in user ({user.email}) -- this helps us prioritize review.
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "submitting" || !description.trim()}
          >
            {status === "submitting" ? "Submitting..." : "Submit"}
          </button>
          {status === "error" && (
            <p style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 8, marginBottom: 0 }}>
              {errorMsg}
            </p>
          )}
        </div>
      )}

      {status === "success" && (
        <p style={{ marginTop: 12, fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
          Thanks -- submitted for review.
        </p>
      )}
    </div>
  );
}
