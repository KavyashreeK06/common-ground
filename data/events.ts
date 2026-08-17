import { CampusEvent } from "../types";

// Sourced from Columbia's own traditions page and campus life coverage.
// Note: Orgo Night / Primal Scream is deliberately omitted -- the marching
// band that ran it was disbanded in 2020 and the tradition is no longer active.
export const COLUMBIA_EVENTS: CampusEvent[] = [
  {
    id: "convocation",
    university_id: "columbia",
    name: "Convocation",
    category: "year_specific",
    description:
      "New students gather with faculty and staff on Low Plaza the Sunday before classes begin, marking the formal start of the academic year.",
    timing: "Sunday before classes begin (fall)",
    audience_years: ["freshman"],
  },
  {
    id: "nsop-activities-day",
    university_id: "columbia",
    name: "NSOP Activities Day",
    category: "year_specific",
    description:
      "Over 350 student groups table on Low Library Plaza during New Student Orientation Program week -- the single best way to see the breadth of campus organizations in one afternoon.",
    timing: "During orientation week (late August)",
    audience_years: ["freshman"],
  },
  {
    id: "homecoming",
    university_id: "columbia",
    name: "Homecoming",
    category: "school_tradition",
    description:
      "Thousands of alumni return to Morningside Heights for a weekend of festivities at the Baker Athletics Complex, culminating in a football game against an Ivy League rival.",
    timing: "Every October",
  },
  {
    id: "night-market",
    university_id: "columbia",
    name: "Night Market",
    category: "cultural",
    description:
      "The Chinese Students Club transforms Low Steps into a night market with food, lights, and performances celebrating East and Southeast Asian cultures.",
    timing: "Fall semester",
  },
  {
    id: "bacchanal",
    university_id: "columbia",
    name: "Bacchanal",
    category: "school_tradition",
    description:
      "Columbia's annual spring music festival -- a day-long outdoor concert to blow off steam before finals, opened by a student performer.",
    timing: "Spring semester",
  },
  {
    id: "tree-lighting",
    university_id: "columbia",
    name: "Tree Lighting Ceremony",
    category: "school_tradition",
    description:
      "Campus turns into a winter scene as the tree on College Walk is lit, a more formal ceremonial counterpart to Columbia's louder traditions.",
    timing: "December",
  },
  {
    id: "morningside-lights",
    university_id: "columbia",
    name: "Morningside Lights",
    category: "arts",
    description:
      "An outdoor lantern procession featuring dozens of lanterns built by the Morningside community during a week of free public workshops, co-produced by the Columbia Arts Initiative and Miller Theatre.",
    timing: "Fall semester",
  },
  {
    id: "varsity-show",
    university_id: "columbia",
    name: "Varsity Show",
    category: "arts",
    description:
      "A student-written and performed musical satirizing Columbia life, running continuously since 1894 -- one of the university's longest-standing traditions.",
    timing: "Spring semester",
  },
  {
    id: "class-day",
    university_id: "columbia",
    name: "Class Day",
    category: "year_specific",
    description:
      "Columbia College's own graduation ceremony, held the day before university-wide Commencement -- a more intimate send-off for the graduating class.",
    timing: "Day before Commencement (May)",
    audience_years: ["senior"],
  },
];

// Major/department-specific events aren't published in a single central
// directory the way traditions are -- they live on individual department
// pages and mailing lists. These are realistic placeholders using common
// Columbia department/career-fair patterns; swap in real dates once you
// pull them from each department's own events page.
export const TEMPLATE_MAJOR_EVENTS: CampusEvent[] = [
  {
    id: "engineering-career-fair",
    university_id: "columbia",
    name: "SEAS Career Fair",
    category: "major_specific",
    description: "Columbia Engineering's career fair connecting students with tech, engineering, and finance employers.",
    timing: "Early fall and early spring",
    audience_majors: ["Computer Science", "Engineering"],
  },
  {
    id: "econ-majors-night",
    university_id: "columbia",
    name: "Economics Majors Night",
    category: "major_specific",
    description: "Department mixer for declared and prospective economics majors with faculty and alumni panels.",
    timing: "Fall semester",
    audience_majors: ["Economics"],
  },
  {
    id: "premed-info-session",
    university_id: "columbia",
    name: "Pre-Med Advising Info Session",
    category: "major_specific",
    description: "Overview of the pre-med track, MCAT timeline, and application process, run by Columbia's pre-professional advising office.",
    timing: "Beginning of each semester",
    audience_majors: ["Biology", "Neuroscience", "Chemistry"],
  },
];

export const ALL_COLUMBIA_EVENTS: CampusEvent[] = [...COLUMBIA_EVENTS, ...TEMPLATE_MAJOR_EVENTS];
