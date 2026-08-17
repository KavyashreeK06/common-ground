import { BELONGING_INTRO, BELONGING_SECTIONS } from "../../content/belonging";

export default function BelongingPage() {
  return (
    <main className="page">
      <h1>{BELONGING_INTRO.title}</h1>
      <p className="subtitle">{BELONGING_INTRO.body}</p>

      {BELONGING_SECTIONS.map((section) => (
        <section key={section.slug} className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>{section.title}</h2>
          <p style={{ color: "var(--ink-soft)", fontWeight: 600, marginTop: 0 }}>{section.intro}</p>
          {section.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
