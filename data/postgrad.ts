export const POSTGRAD_TAGS = [
  "Pre-med",
  "Pre-law",
  "Grad school / further academic study",
  "Heading straight into industry",
  "Not decided yet",
] as const;

export const POSTGRAD_ORG_KEYWORDS: Record<string, string[]> = {
  "Pre-med": ["pre-medical", "premed", "medical", "amsa", "charles drew", "health"],
  "Pre-law": ["pre-law", "law", "debate", "model congress", "mock trial", "policy"],
  "Grad school / further academic study": ["academic"],
  "Heading straight into industry": ["pre-professional"],
  "Not decided yet": [],
};
