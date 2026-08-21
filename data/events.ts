import { CampusEvent } from "../types";

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
    id: "international-orientation",
    university_id: "columbia",
    name: "International Student Orientation",
    category: "year_specific",
    description:
      "NSOP includes programming specifically for incoming international students, covering visa/immigration logistics and connecting new arrivals with each other early. Exact scheduling and format can shift year to year -- check the current NSOP calendar for specifics.",
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

export const TEMPLATE_MAJOR_EVENTS: CampusEvent[] = [
  {
    id: "engineering-career-fair",
    university_id: "columbia",
    name: "SEAS Career Fair",
    category: "major_specific",
    description: "Columbia Engineering's career fair connecting students with tech, engineering, and finance employers.",
    timing: "Early fall and early spring",
    audience_majors: [
      "Computer Science", "Computer Engineering", "Electrical Engineering",
      "Mechanical Engineering", "Civil Engineering", "Chemical Engineering",
      "Biomedical Engineering", "Industrial Engineering and Operations Research",
      "Applied Physics", "Applied Mathematics",
    ],
  },
  {
    id: "econ-majors-night",
    university_id: "columbia",
    name: "Economics Majors Night",
    category: "major_specific",
    description: "Department mixer for declared and prospective economics majors with faculty and alumni panels.",
    timing: "Fall semester",
    audience_majors: ["Economics", "Economics-Mathematics", "Financial Economics"],
  },
  {
    id: "premed-info-session",
    university_id: "columbia",
    name: "Pre-Med Advising Info Session",
    category: "major_specific",
    description: "Overview of the pre-med track, MCAT timeline, and application process, run by Columbia's pre-professional advising office.",
    timing: "Beginning of each semester",
    audience_majors: ["Biology", "Neuroscience and Behavior", "Chemistry", "Environmental Biology"],
  },
  {
    id: "humanities-majors-showcase",
    university_id: "columbia",
    name: "Humanities Majors Showcase",
    category: "major_specific",
    description: "Faculty and current majors talk through what a humanities major actually looks like day-to-day, plus career paths alumni have taken.",
    timing: "Fall semester",
    audience_majors: ["English", "Creative Writing", "Comparative Literature", "History", "Philosophy", "Classics", "Art History"],
  },
  {
    id: "polisci-careers-panel",
    university_id: "columbia",
    name: "Political Science Careers Panel",
    category: "major_specific",
    description: "Alumni panel on paths from a political science degree into law, policy, journalism, and public service.",
    timing: "Spring semester",
    audience_majors: ["Political Science", "Sociology", "Urban Studies"],
  },
];

export const COLUMBIA_HERITAGE_MONTH_EVENTS: CampusEvent[] = [
  {
    id: "asian-pacific-american-heritage-month",
    university_id: "columbia",
    name: "Asian Pacific American Heritage Month",
    category: "cultural",
    description:
      "A month of programming celebrating Asian and Pacific Islander American heritage, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "April",
  },
  {
    id: "black-history-month",
    university_id: "columbia",
    name: "Black History Month",
    category: "cultural",
    description:
      "A month of programming celebrating Black history and culture, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "February",
  },
  {
    id: "latinx-heritage-month",
    university_id: "columbia",
    name: "Latinx Heritage Month",
    category: "cultural",
    description:
      "A month of programming celebrating Latinx heritage and culture, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "September to October",
  },
  {
    id: "native-american-heritage-month",
    university_id: "columbia",
    name: "Native American Heritage Month",
    category: "cultural",
    description:
      "A month of programming celebrating Native American history and culture, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "November",
  },
  {
    id: "queer-awareness-month",
    university_id: "columbia",
    name: "Queer Awareness Month (QuAM)",
    category: "cultural",
    description:
      "A month of programming celebrating queer identity and community, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "April",
  },
  {
    id: "womens-history-month",
    university_id: "columbia",
    name: "Women's History Month",
    category: "cultural",
    description:
      "A month of programming celebrating women's history and achievements, hosted by Columbia Undergraduate Student Life alongside student cultural groups.",
    timing: "March",
  },
];

export const ALL_COLUMBIA_EVENTS: CampusEvent[] = [...COLUMBIA_EVENTS, ...TEMPLATE_MAJOR_EVENTS, ...COLUMBIA_HERITAGE_MONTH_EVENTS];

export const NYU_EVENTS: CampusEvent[] = [
  {
    id: "nyu-welcome-week",
    university_id: "nyu",
    name: "Welcome Week",
    category: "year_specific",
    description:
      "A week of orientation programming at the start of the year, including a ferry party and other events designed to help new students meet each other early.",
    timing: "Start of fall semester",
    audience_years: ["freshman"],
  },
  {
    id: "nyu-strawberry-festival",
    university_id: "nyu",
    name: "Strawberry Festival",
    category: "school_tradition",
    description:
      "NYU Program Board's annual arts and music festival on West 3rd Street -- a 35+ year tradition featuring live music, local vendors, games, and a famously enormous strawberry shortcake.",
    timing: "Beginning of May",
  },
  {
    id: "nyu-violet-100",
    university_id: "nyu",
    name: "Violet 100 (V100)",
    category: "school_tradition",
    description:
      "A week of marquee campus-wide events and discounted entertainment perks, including access to Skirball Center performances and exclusive ticket deals through ScholasTix.",
    timing: "Varies by year -- check current NYU events calendar",
  },
  {
    id: "nyu-flurry",
    university_id: "nyu",
    name: "Flurry",
    category: "school_tradition",
    description:
      "An ice skating event at the Central Park rink, hosted by the Inter-Residence Hall Council -- one of NYU's most popular winter traditions.",
    timing: "Winter",
  },
  {
    id: "nyu-reads",
    university_id: "nyu",
    name: "NYU Reads",
    category: "school_tradition",
    description:
      "A university-wide community reading program -- one book is chosen each year for the whole university to read, discuss, and build community around.",
    timing: "Ongoing through the academic year",
  },
];

export const ALL_NYU_EVENTS: CampusEvent[] = NYU_EVENTS;

export const CORNELL_EVENTS: CampusEvent[] = [
  {
    id: "cornell-weeks-of-welcome",
    university_id: "cornell",
    name: "Weeks of Welcome",
    category: "year_specific",
    description:
      "A run of orientation-adjacent programming from move-in through the first weeks of classes, including the Big Red Welcome Fest, the First-Year Festival, and New Student Convocation.",
    timing: "Late August through early September",
    audience_years: ["freshman"],
  },
  {
    id: "cornell-dragon-day",
    university_id: "cornell",
    name: "Dragon Day",
    category: "school_tradition",
    description:
      "First-year architecture students spend weeks building a giant dragon, then parade it from Rand Hall to the Arts Quad -- some years engineering students build a phoenix to symbolically face off against it. One of Cornell's oldest traditions, dating back to the early 1900s.",
    timing: "The Friday before spring break",
  },
  {
    id: "cornell-slope-day",
    university_id: "cornell",
    name: "Slope Day",
    category: "school_tradition",
    description:
      "A massive outdoor concert and carnival on Libe Slope marking the last day of classes -- live music, food, games, and the unofficial start of summer. Traces back over a century to an early-1900s tradition called Spring Day.",
    timing: "The day after the last day of spring classes (early-to-mid May)",
  },
  {
    id: "cornell-homecoming",
    university_id: "cornell",
    name: "Homecoming Spirit Week",
    category: "school_tradition",
    description:
      "A week of campus-pride events leading into Homecoming Weekend -- daily giveaways, a chalk challenge, movies on the Arts Quad, and a Friday-night concert -- capped by the football game and a drone-and-laser light show at Schoellkopf Field.",
    timing: "Late September into early October",
  },
  {
    id: "cornell-clubfest",
    university_id: "cornell",
    name: "ClubFest",
    category: "year_specific",
    description:
      "An in-person fair each semester for exploring Cornell's 1,000+ student organizations -- meet current members, sign up, or promote your own group.",
    timing: "Start of each semester",
    audience_years: ["freshman"],
  },
  {
    id: "cornell-senior-days",
    university_id: "cornell",
    name: "Senior Days",
    category: "year_specific",
    description:
      "A week of events for graduating students in the run-up to Commencement -- sunset lake cruises, canoeing on Beebe Lake, clocktower climbs, and comedy shows.",
    timing: "The week before Commencement",
    audience_years: ["senior"],
  },
];

export const ALL_CORNELL_EVENTS: CampusEvent[] = CORNELL_EVENTS;

export const PENN_EVENTS: CampusEvent[] = [
  {
    id: "penn-convocation",
    university_id: "penn",
    name: "Convocation",
    category: "year_specific",
    description:
      "The formal welcome ceremony for each incoming class, dating back to 1910 -- the first time the whole class gathers together, with Hey Day in junior year and Commencement in senior year marking the same class's next two milestones.",
    timing: "Start of freshman year, during NSO",
    audience_years: ["freshman"],
  },
  {
    id: "penn-hey-day",
    university_id: "penn",
    name: "Hey Day",
    category: "year_specific",
    description:
      "A tradition dating back to 1916 marking the official passage from junior to senior year. Juniors wear matching red shirts and boater hats, carry canes, gather for a picnic on High Rise Field, then march down Locust Walk behind the Penn Band to College Green, where the University President formally declares them seniors.",
    timing: "Near the end of spring semester, junior year",
    audience_years: ["junior"],
  },
  {
    id: "penn-u-night",
    university_id: "penn",
    name: "U-Night",
    category: "year_specific",
    description:
      "A newer tradition (started in 2019) marking the midpoint of the undergraduate journey -- free food, music, and raffles on High Rise Field, followed by a lantern-lighting ceremony celebrating class unity.",
    timing: "Late April, sophomore year",
    audience_years: ["sophomore"],
  },
  {
    id: "penn-spring-fling",
    university_id: "penn",
    name: "Spring Fling",
    category: "school_tradition",
    description:
      "An annual end-of-spring-semester festival running since the early 1970s, now held at Penn Park -- a concert with a major headliner (past acts include Chance the Rapper, Metro Boomin, and Flo Rida) alongside carnival games and food.",
    timing: "April, the weekend before the last week of spring classes",
  },
  {
    id: "penn-relays",
    university_id: "penn",
    name: "Penn Relays",
    category: "athletics",
    description:
      "The oldest and largest track and field competition in the United States, hosted at Franklin Field since 1895. Over three days, more than 15,000 athletes compete in 300+ events, drawing crowds upward of 100,000 -- Usain Bolt and Jesse Owens both once raced here.",
    timing: "The last full week of April",
  },
  {
    id: "penn-homecoming-toast",
    university_id: "penn",
    name: "Homecoming and the Toast Toss",
    category: "school_tradition",
    description:
      "Penn's homecoming football game carries a genuinely odd 50-year-old tradition: fans throw pieces of toast onto Franklin Field after the third quarter, a workaround dating back to a since-lifted alcohol ban that once stopped students from literally toasting to the University with a drink.",
    timing: "Fall, homecoming weekend",
  },
];

export const ALL_PENN_EVENTS: CampusEvent[] = PENN_EVENTS;

// Lookup used by pages that need "this university's events" without caring
// which school it is -- add a new university's event array here and it's
// automatically wired in everywhere this lookup is used.
export const EVENTS_BY_UNIVERSITY: Record<string, CampusEvent[]> = {
  columbia: ALL_COLUMBIA_EVENTS,
  nyu: ALL_NYU_EVENTS,
  cornell: ALL_CORNELL_EVENTS,
  penn: ALL_PENN_EVENTS,
};