export interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  color: string;
  accentColor?: string;
}

export const UNIVERSITIES: UniversityOption[] = [
  { id: "columbia", name: "Columbia University", shortName: "Columbia", domain: "columbia.edu", color: "#B9D9EB", accentColor: "#1D4F91" },
  { id: "nyu", name: "New York University", shortName: "NYU", domain: "nyu.edu", color: "#57068C" },
];

export const DEFAULT_UNIVERSITY_ID = "columbia";
