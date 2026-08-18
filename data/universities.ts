export interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
}

export const UNIVERSITIES: UniversityOption[] = [
  { id: "columbia", name: "Columbia University", shortName: "Columbia" },
  { id: "nyu", name: "New York University", shortName: "NYU" },
];

export const DEFAULT_UNIVERSITY_ID = "columbia";
