"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BELONGING_INTRO, BELONGING_SECTIONS, recommendSection } from "../../../../content/belonging";
import { loadProfile } from "../../../../lib/storage";
import { fetchProfileFromCloud } from "../../../../lib/data";
import { getCurrentUser } from "../../../../lib/auth";
import { UNIVERSITIES } from "../../../../data/universities";
import { StudentProfile } from "../../../../types";
import { Sparkles } from "lucide-react";

export default function BelongingIndexPage({ params }: { params: { schoolId: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const localProfile = loadProfile();
      const user = await getCurrentUser();
      let finalProfile = localProfile;
      if (user) {
        const cloudProfile = await fetchProfileFromCloud(user.id);
        if (cloudProfile) finalProfile = cloudProfile;
      }
      setProfile(finalProfile);
      setLoaded(true);
    }
    load();
  }, []);

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

  const recommendedSlug = profile ? recommendSection(profile) : null;
  const recommended = recommendedSlug ? BELONGING_SECTIONS.find((s) => s.slug === recommendedSlug) : null;
  const applicableSections = BELONGING_SECTIONS.filter(
    (s) => !s.universityIds || s.universityIds.includes(school.id)
  );

  return (
    <main className="page">
      <Link href={`/school/${school.id}`} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← Back to {school.shortName}
      </Link>

      <h1 style={{ marginTop: 16 }}>{BELONGING_INTRO.title}</h1>
      <p className="subtitle">{BELONGING_INTRO.body}</p>

      {loaded && !profile && (
        <div className="card" style={{ marginBottom: 24, borderColor: "var(--accent)" }}>
          <p style={{ margin: 0 }}>
            Take the quiz and we'll point you to the article most relevant to you.{" "}
            <Link href={`/quiz?school=${school.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>Take the quiz →</Link>
          </p>
        </div>
      )}

      {recommended && (
        <>
                    <span className="pill pill-terracotta" style={{ marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
            Recommended for you
          </span>
          <Link
            href={`/school/${school.id}/belonging/${recommended.slug}`}
            className="card"
            style={{ display: "block", marginBottom: 32, borderColor: "var(--accent)", textDecoration: "none", color: "var(--ink)" }}
          >
            <h2 style={{ marginTop: 0 }}>{recommended.title}</h2>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{recommended.intro}</p>
          </Link>
        </>
      )}

      <h2>All articles</h2>
      <div className="grid grid-2">
        {applicableSections.map((section) => (
          <Link
            key={section.slug}
            href={`/school/${school.id}/belonging/${section.slug}`}
            className="card"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            <h3>{section.title}</h3>
            <p style={{ margin: 0, color: "var(--ink-soft)" }}>{section.intro}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
