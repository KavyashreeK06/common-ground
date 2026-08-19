"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UNIVERSITIES } from "../../../../data/universities";
import { fetchOrgs } from "../../../../lib/data";
import { rankOrgs } from "../../../../lib/matching";
import { CategoryIcon } from "../../../../components/CategoryIcon";
import { SaveButton } from "../../../../components/SaveButton";
import { useSavedOrgs } from "../../../../lib/useSavedOrgs";
import { LoadingSpinner } from "../../../../components/Loading";
import { AXES, AxisVector, Org } from "../../../../types";
import { Award } from "lucide-react";

const AXIS_LABELS: Record<string, [string, string]> = {
  structure: ["Spontaneous", "Structured"],
  competitive: ["Collaborative", "Competitive"],
  public: ["Behind-the-scenes", "Public-facing"],
  group_size: ["Small & intimate", "Large group"],
  career: ["Purely social", "Career-oriented"],
  physical: ["Cerebral", "Physical / active"],
  creative: ["Analytical", "Creative"],
  cause: ["Craft-driven", "Cause-driven"],
  novelty: ["Deep specialization", "Novelty-seeking"],
  identity: ["Interest-based", "Identity-based"],
};

function neutralVector(): AxisVector {
  return Object.fromEntries(AXES.map((a) => [a, 5])) as AxisVector;
}

export default function ExplorePage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);
  const { savedIds, toggleSave } = useSavedOrgs(params.schoolId);

  const [vector, setVector] = useState<AxisVector>(neutralVector());
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!school) return;
    fetchOrgs(school.id).then(({ orgs }) => {
      setOrgs(orgs);
      setLoading(false);
    });
  }, [school]);

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

  const matches = loading ? [] : rankOrgs(vector, orgs, undefined, 8);

  return (
    <main className="page">
      <Link href={`/school/${school.id}`} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← Back to {school.shortName}
      </Link>

      <h1 style={{ marginTop: 16 }}>Explore by feel</h1>
      <p className="subtitle">
        Skip the quiz -- drag these sliders directly and watch matches update live. Same 10 axes,
        same matching engine, just in your hands.
      </p>

      <div className="grid grid-2" style={{ alignItems: "start", gap: 32 }}>
        <div>
          {AXES.map((axis) => (
            <div key={axis} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-soft)", marginBottom: 6 }}>
                <span>{AXIS_LABELS[axis][0]}</span>
                <span>{AXIS_LABELS[axis][1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={vector[axis]}
                onChange={(e) => setVector((prev) => ({ ...prev, [axis]: Number(e.target.value) }))}
                className="axis-slider"
              />
            </div>
          ))}
          <button type="button" className="btn-outline" onClick={() => setVector(neutralVector())}>
            Reset to neutral
          </button>
        </div>

        <div>
          <h2 style={{ marginTop: 0 }}>Live matches</h2>
          {loading ? (
            <LoadingSpinner label="Loading orgs..." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {matches.map((m) => (
                <div key={m.org.id} className="card" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
                  <span className="match-score" style={{ width: 44, height: 44 }}>
                    <Award size={12} strokeWidth={2} aria-hidden="true" />
                    <span style={{ fontSize: 11 }}>{m.score}%</span>
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>{m.org.name}</h3>
                    <span className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <CategoryIcon category={m.org.category} size={11} />
                      {m.org.category}
                    </span>
                  </div>
                  <SaveButton saved={savedIds.has(m.org.id)} onToggle={() => toggleSave(m.org.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
