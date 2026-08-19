export const AXES = [
  "structure",
  "competitive",
  "public",
  "group_size",
  "career",
  "physical",
  "creative",
  "cause",
  "novelty",
  "identity",
] as const;

export type Axis = (typeof AXES)[number];

export type AxisVector = Record<Axis, number>;

export interface University {
  id: string;
  name: string;
  domain: string;
}

export interface Org {
  id: string;
  university_id: string;
  name: string;
  category: string;
  secondaryCategories?: string[];
  description: string;
  contact_url?: string | null;
  tags: AxisVector;
}

export interface QuizAnswerOption {
  label: string;
  deltas: Partial<Record<Axis, number>>;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizAnswerOption[];
  audience_years?: StudentYear[];
}

export interface MatchResult {
  org: Org;
  score: number;
}

export const STUDENT_YEARS = ["freshman", "sophomore", "junior", "senior"] as const;
export type StudentYear = (typeof STUDENT_YEARS)[number];

export const GOAL_TAGS = [
  "make_close_friends",
  "build_resume",
  "explore_interests",
  "find_identity_community",
  "give_back",
  "stay_active",
  "creative_outlet",
  "leadership_experience",
] as const;
export type GoalTag = (typeof GOAL_TAGS)[number];

export interface StudentProfile {
  year: StudentYear;
  vector: AxisVector;
  goals: GoalTag[];
  major?: string;
  background?: string[];
  intellectualInterests?: string[];
  isInternational?: boolean;
  postGradInterests?: string[];
  religiousTraditions?: string[];
  causes?: string[];
  name?: string;
  universityId?: string;
}

export type EventCategory =
  | "school_tradition"
  | "year_specific"
  | "major_specific"
  | "cultural"
  | "arts"
  | "athletics";

export interface CampusEvent {
  id: string;
  university_id: string;
  name: string;
  category: EventCategory;
  description: string;
  timing: string;
  audience_years?: StudentYear[];
  audience_majors?: string[];
  link?: string | null;
}
