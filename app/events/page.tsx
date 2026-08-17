"use client";

import { useMemo, useState } from "react";
import { ALL_COLUMBIA_EVENTS } from "../../data/events";
import { EventCategory, STUDENT_YEARS, StudentYear } from "../../types";

const CATEGORY_LABELS: Record<EventCategory, string> = {
  school_tradition: "School tradition",
  year_specific: "Year-specific",
  major_specific: "Major-specific",
  cultural: "Cultural",
  arts: "Arts",
  athletics: "Athletics",
};

export default function EventsPage() {
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [year, setYear] = useState<StudentYear | "all">("all");

  const filtered = useMemo(() => {
    return ALL_COLUMBIA_EVENTS.filter((e) => {
      const matchesCategory = category === "all" || e.category === category;
      const matchesYear = year === "all" || !e.audience_years || e.audience_years.includes(year);
      return matchesCategory && matchesYear;
    });
  }, [category, year]);

  return (
    <main className="page">
      <h1>Event directory</h1>
      <p className="subtitle">
        School-wide traditions, plus events specific to your year or major.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value as EventCategory | "all")}>
          <option value="all">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value as StudentYear | "all")}>
          <option value="all">All years</option>
          {STUDENT_YEARS.map((y) => (
            <option key={y} value={y}>{y[0].toUpperCase() + y.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-2">
        {filtered.map((e) => (
          <div key={e.id} className="card">
            <span className="pill pill-terracotta">{CATEGORY_LABELS[e.category]}</span>
            <h3 style={{ marginTop: 10 }}>{e.name}</h3>
            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "var(--terracotta)" }}>{e.timing}</p>
            <p style={{ margin: 0, color: "var(--ink-soft)" }}>{e.description}</p>
            {e.audience_majors && (
              <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-soft)" }}>
                Relevant majors: {e.audience_majors.join(", ")}
              </p>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p>No events match those filters.</p>}
      </div>
    </main>
  );
}
