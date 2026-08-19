import Link from "next/link";
import { notFound } from "next/navigation";
import { STUDENT_YEARS, StudentYear } from "../../../types";
import { UNIVERSITIES } from "../../../data/universities";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ schoolId: u.id }));
}

const YEAR_LABELS: Record<StudentYear, string> = {
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
};

export default function SchoolHomePage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);
  if (!school) notFound();

  return (
    <main className="page">
      <Link href="/" style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← Choose a different school
      </Link>

      <h1 style={{ marginTop: 16 }}>Find your people at {school.shortName}</h1>
      <p className="subtitle">
        A short quiz matches you to student organizations based on how you actually
        want to spend your time -- not just what category they fall under.
      </p>

      <h2>What year are you?</h2>
      <div className="grid grid-4">
        {STUDENT_YEARS.map((y) => (
          <Link key={y} href={`/quiz?year=${y}&school=${school.id}`} className="year-card">
            <span className="year-card-label">{YEAR_LABELS[y]}</span>
          </Link>
        ))}
      </div>

      <h2>Or explore first</h2>
      <div className="grid grid-4">
        <Link href={`/school/${school.id}/belonging`} className="card" style={{ textDecoration: "none" }}>
          <h3>What belonging looks like here</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            A few different starting points, depending on where you're coming from.
          </p>
        </Link>
        <Link href={`/school/${school.id}/clubs`} className="card" style={{ textDecoration: "none" }}>
          <h3>Browse the full club directory</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            Organizations across academics, arts, athletics, culture, and more.
          </p>
        </Link>
        <Link href={`/school/${school.id}/events`} className="card" style={{ textDecoration: "none" }}>
          <h3>See what's coming up</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            School traditions and events specific to your year or major.
          </p>
        </Link>
        <Link href={`/school/${school.id}/explore`} className="card" style={{ textDecoration: "none" }}>
          <h3>Explore by feel</h3>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            Skip the quiz -- drag sliders directly and see matches update live.
          </p>
        </Link>
      </div>
    </main>
  );
}
