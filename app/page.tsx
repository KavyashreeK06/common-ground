"use client";

import Link from "next/link";
import { STUDENT_YEARS, StudentYear } from "../types";

const YEAR_LABELS: Record<StudentYear, string> = {
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
};

export default function HomePage() {
  return (
    <main className="page">
      <h1>Find your people at Columbia</h1>
      <p className="subtitle">
        A short quiz matches you to student organizations based on how you actually
        want to spend your time -- not just what category they fall under.
      </p>

      <h2>What year are you?</h2>
      <div className="grid grid-4">
        {STUDENT_YEARS.map((y) => (
          <Link key={y} href={`/quiz?year=${y}`} className="year-card">
            <span className="year-card-label">{YEAR_LABELS[y]}</span>
          </Link>
        ))}
      </div>

      <h2>Or explore first</h2>
      <div className="grid grid-2">
        <Link href="/belonging" className="card" style={{ textDecoration: "none" }}>
          <h3>What belonging looks like here</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            A few different starting points, depending on where you're coming from.
          </p>
        </Link>
        <Link href="/clubs" className="card" style={{ textDecoration: "none" }}>
          <h3>Browse the full club directory</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            495 organizations across academics, arts, athletics, culture, and more.
          </p>
        </Link>
      </div>
    </main>
  );
}
