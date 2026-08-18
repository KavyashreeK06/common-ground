"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Org } from "../../../../types";
import { fetchOrgs, submitOrgEdit, fetchOrgUpvoteCounts } from "../../../../lib/data";
import { getCurrentUser } from "../../../../lib/auth";
import { describeOrgForComparison } from "../../../../lib/matching";
import { UNIVERSITIES } from "../../../../data/universities";

const MAX_COMPARE = 3;

export default function ClubsPage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);

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
    const set = new Set(orgs.map((o) => o.category));
    return ["all", ...Array.from(set).sort()];
  }, [orgs]);

  const filtered = useMemo(() => {
    return orgs.filter((o) => {
      const matchesQuery = o.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || o.category === category;
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
        <p className="subtitle">Loading clubs...</p>
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

          <div className="grid grid-2">
            {filtered.map((o) => (
              <ClubCard
                key={o.id}
                org={o}
                comparing={compareIds.includes(o.id)}
                compareDisabled={compareIds.length >= MAX_COMPARE && !compareIds.includes(o.id)}
                onToggleCompare={() => toggleCompare(o.id)}
                upvotes={upvoteCounts[o.id] ?? 0}
                user={user}
              />
            ))}
          </div>
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
  comparing,
  compareDisabled,
  onToggleCompare,
  upvotes,
  user,
}: {
  org: Org;
  comparing: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  upvotes: number;
  user: User | null;
}) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(org.description);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState(user?.email ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      <h3>{org.name}</h3>
      <span className="pill">{org.category}</span>
      {upvotes > 0 && (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--terracotta)", fontWeight: 600 }}>
          {upvotes} {upvotes === 1 ? "student" : "students"} marked this as a fit
        </p>
      )}
      {org.description && (
        <p style={{ marginTop: 10, marginBottom: 0, color: "var(--ink-soft)" }}>{org.description}</p>
      )}

      <div style={{ display: "flex", gap: 16, marginTop: 12, alignItems: "center" }}>
        <button
          type="button"
          className={`compare-toggle ${comparing ? "active" : ""}`}
          onClick={onToggleCompare}
          disabled={compareDisabled}
          aria-pressed={comparing}
        >
          {comparing ? "✓ Added to comparison" : compareDisabled ? "Compare (max 3)" : "+ Compare"}
        </button>
        {status !== "success" && (
          <button
            type="button"
            className="compare-toggle"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Cancel" : "Suggest an edit"}
          </button>
        )}
      </div>

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
