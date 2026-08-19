"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UNIVERSITIES } from "../../../../data/universities";
import { fetchOrgs } from "../../../../lib/data";
import { useSavedOrgs } from "../../../../lib/useSavedOrgs";
import { CategoryIcon } from "../../../../components/CategoryIcon";
import { SaveButton } from "../../../../components/SaveButton";
import { LoadingSpinner } from "../../../../components/Loading";
import { Org } from "../../../../types";
import { BookmarkX } from "lucide-react";

export default function SavedPage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);
  const { savedIds, toggleSave, loaded: savedLoaded } = useSavedOrgs(params.schoolId);

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);

  useEffect(() => {
    if (!school) return;
    fetchOrgs(school.id).then(({ orgs }) => {
      setOrgs(orgs);
      setOrgsLoading(false);
    });
  }, [school]);

  const savedOrgs = useMemo(() => orgs.filter((o) => savedIds.has(o.id)), [orgs, savedIds]);

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

  const loading = orgsLoading || !savedLoaded;

  return (
    <main className="page">
      <Link href={`/school/${school.id}`} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← Back to {school.shortName}
      </Link>

      <h1 style={{ marginTop: 16 }}>Saved organizations</h1>
      <p className="subtitle">
        Clubs you've bookmarked to revisit.{savedLoaded && savedIds.size > 0 ? ` ${savedIds.size} saved.` : ""}
      </p>

      {loading ? (
        <LoadingSpinner label="Loading your saved orgs..." />
      ) : savedOrgs.length === 0 ? (
        <div className="empty-state">
          <BookmarkX size={28} strokeWidth={1.5} aria-hidden="true" />
          <p style={{ margin: 0, fontWeight: 600 }}>Nothing saved yet</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Tap the bookmark icon on any club to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {savedOrgs.map((org) => (
            <div key={org.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3>{org.name}</h3>
                <SaveButton saved onToggle={() => toggleSave(org.id)} />
              </div>
              <span className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <CategoryIcon category={org.category} />
                {org.category}
              </span>
              {org.description && (
                <p style={{ marginTop: 10, marginBottom: 0, color: "var(--ink-soft)" }}>{org.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
