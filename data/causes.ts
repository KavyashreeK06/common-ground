export const CAUSE_TAGS = [
  "Environment / sustainability",
  "Racial justice / equity",
  "Gender equity",
  "Immigration / refugee rights",
  "Mental health awareness",
  "Poverty / economic justice",
  "Disability rights & access",
  "Animal welfare",
  "Global health",
  "Education access",
  "Civic engagement / voting",
  "None of the above",
] as const;

export const CAUSE_ORG_KEYWORDS: Record<string, string[]> = {
  "Environment / sustainability": [
    "earth", "environment", "sustainability", "climate", "green", "sunrise movement",
  ],
  "Racial justice / equity": [
    "racial justice", "black student", "students of color", "naacp", "black in",
  ],
  "Gender equity": ["feminist", "women's network", "gender equality", "gender equity", "steminist"],
  "Immigration / refugee rights": ["immigration", "refugee", "undocumented"],
  "Mental health awareness": ["mental health", "active minds", "wellness"],
  "Poverty / economic justice": ["poverty", "economic justice", "homeless"],
  "Disability rights & access": ["disability", "accessibility"],
  "Animal welfare": ["animal rights", "animal welfare"],
  "Global health": ["global health", "public health", "unicef"],
  "Education access": ["literacy", "tutoring", "education access", "petey greene"],
  "Civic engagement / voting": ["civic engagement", "voting", "student government", "public policy"],
  "None of the above": [],
};
