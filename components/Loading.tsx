import { Loader2 } from "lucide-react";

export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-soft)" }}>
      <Loader2 size={16} strokeWidth={2} className="spin" aria-hidden="true" />
      {label}
    </span>
  );
}

export function LoadingPage({ label = "Loading..." }: { label?: string }) {
  return (
    <main className="page">
      <LoadingSpinner label={label} />
    </main>
  );
}
