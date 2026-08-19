import { Bookmark } from "lucide-react";

export function SaveButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this org"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        color: saved ? "var(--accent)" : "var(--ink-soft)",
        flexShrink: 0,
      }}
    >
      <Bookmark size={18} strokeWidth={2} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
