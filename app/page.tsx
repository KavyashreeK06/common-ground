"use client";

import Link from "next/link";
import { UNIVERSITIES } from "../data/universities";
import { SchoolFlag } from "../components/SchoolFlag";

export default function HomePage() {
  return (
    <main className="page">
      <h1>Welcome to Common Ground</h1>
      <p className="subtitle">
        We help you find your people -- clubs, communities, and events that actually fit
        who you are, matched specifically to your school.
      </p>

      <h2>Choose your school</h2>
        <div className="grid grid-schools">
        {UNIVERSITIES.map((u) => (
          <Link key={u.id} href={`/school/${u.id}`} className="year-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <SchoolFlag color={u.color} accentColor={u.accentColor} size={16} />
              <span className="year-card-label">{u.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <h2>How it works</h2>
      <div className="grid grid-4">
        <div className="card">
          <span className="year-card-numeral">01</span>
          <h3 style={{ marginTop: 6 }}>Pick your school</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            Every match is specific to your campus -- real clubs, real events.
          </p>
        </div>
        <div className="card">
          <span className="year-card-numeral">02</span>
          <h3 style={{ marginTop: 6 }}>Take a short quiz</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            A few minutes on how you actually want to spend your time.
          </p>
        </div>
        <div className="card">
          <span className="year-card-numeral">03</span>
          <h3 style={{ marginTop: 6 }}>Meet your matches</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            See the clubs most likely to feel like home, and why.
          </p>
        </div>
      </div>
    </main>
  );
}
