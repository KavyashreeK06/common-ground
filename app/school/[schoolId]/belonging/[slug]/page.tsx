import Link from "next/link";
import { notFound } from "next/navigation";
import { BELONGING_SECTIONS } from "../../../../../content/belonging";
import { UNIVERSITIES } from "../../../../../data/universities";

export function generateStaticParams() {
  const params: { schoolId: string; slug: string }[] = [];
  for (const u of UNIVERSITIES) {
    for (const s of BELONGING_SECTIONS) {
      params.push({ schoolId: u.id, slug: s.slug });
    }
  }
  return params;
}

export default function BelongingArticlePage({ params }: { params: { schoolId: string; slug: string } }) {
  const school = UNIVERSITIES.find((u) => u.id === params.schoolId);
  if (!school) notFound();

  const index = BELONGING_SECTIONS.findIndex((s) => s.slug === params.slug);
  if (index === -1) notFound();

  const article = BELONGING_SECTIONS[index];
  const prev = index > 0 ? BELONGING_SECTIONS[index - 1] : null;
  const next = index < BELONGING_SECTIONS.length - 1 ? BELONGING_SECTIONS[index + 1] : null;

  return (
    <main className="page">
      <Link href={`/school/${school.id}/belonging`} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>
        ← All articles
      </Link>

      <h1 style={{ marginTop: 16 }}>{article.title}</h1>
      <p className="subtitle" style={{ fontWeight: 600 }}>{article.intro}</p>

      {article.body.map((para, i) => (
        <p key={i}>{para}</p>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        {prev ? (
          <Link href={`/school/${school.id}/belonging/${prev.slug}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, maxWidth: "45%" }}>
            ← {prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/school/${school.id}/belonging/${next.slug}`} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, textAlign: "right", maxWidth: "45%" }}>
            {next.title} →
          </Link>
        )}
      </div>
    </main>
  );
}
