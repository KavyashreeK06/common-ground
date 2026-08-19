export function SchoolFlag({
  color,
  accentColor,
  size = 24,
}: {
  color: string;
  accentColor?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 50 70"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <line x1="8" y1="8" x2="8" y2="65" stroke="var(--ink-soft)" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 8 L42 16 L8 24 Z" fill={color} stroke={accentColor ?? color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
