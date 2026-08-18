export interface BelongingSection {
  slug: string;
  title: string;
  intro: string;
  body: string[];
}

export const BELONGING_INTRO = {
  title: "What belonging looks like here",
  body: "Belonging doesn't look the same for everyone, and it rarely happens all at once. For some students it's a single club that becomes a second home. For others it's a slower accumulation of small, familiar faces across a dining hall, a hallway, a group chat. There's no one right pace, and no single club or event that guarantees it. What follows are a few different starting points, depending on where you're coming from.",
};
export const BELONGING_SECTIONS: BelongingSection[] = [
  {
    slug: "first-year",
    title: "If you're just starting out",
    intro: "The first few weeks can feel like everyone else already found their people.",
    body: [
      "They usually haven't. Most of what looks like an already-formed friend group in week two is actually two people who met during move-in, plus whoever they happened to sit near at a dining hall table. The appearance of belonging moves faster than the real thing.",
      "The most reliable path in early weeks isn't finding the one perfect club -- it's showing up more than once to a few different things. A single event tells you almost nothing about whether a group is a fit. Going back a second and third time is what actually reveals it, and it's also usually what the people already in the group notice and respond to.",
      "It's normal for this to take a full semester, sometimes longer. Belonging that arrives in week one is rare enough that it's not a fair benchmark for how things are supposed to go.",
    ],
  },
  {
    slug: "quiet-or-introverted",
    title: "If large groups drain you rather than energize you",
    intro: "Belonging doesn't require being the person who talks to everyone.",
    body: [
      "A lot of campus programming defaults to big, loud, high-energy formats, because those are the easiest to advertise and the easiest to photograph. That doesn't mean they're the only real way in.",
      "Smaller, purpose-built groups -- a research lab, a niche hobby club, a small workshop-style org -- often build faster and deeper familiarity than a large general org does, simply because there are fewer people to get to know and more repeated contact with each of them.",
      "It's worth being honest with yourself about which kind of group size actually lets you show up as yourself, rather than defaulting to whichever org has the biggest table at an activities fair.",
    ],
  },
  {
    slug: "identity-and-community",
    title: "If you're looking for people who share your background",
    intro: "Identity-based communities exist because shared background can shortcut a lot of the usual getting-to-know-you distance.",
    body: [
      "There's a real difference between a group organized around a shared activity and one organized around a shared identity or background. Both are valid ways to build community, and they meet different needs -- one gives you people who like what you like, the other gives you people who understand things about your life you might not have to explain.",
      "Many students end up in both kinds of groups at once, and that's not redundant -- it's two different, complementary forms of belonging, not a backup plan for each other.",
      "If an identity-based community doesn't feel like the right fit on the first try, that doesn't mean the concept doesn't apply to you. Communities organized around broad identity categories can vary a lot from chapter to chapter, org to org -- it's worth trying more than one if the first doesn't click.",
    ],
  },
  {
    slug: "transfer-or-later-arrival",
    title: "If you're arriving after your first year, as a transfer or otherwise",
    intro: "Most of campus's onboarding infrastructure is built around students arriving in year one.",
    body: [
      "That's a real structural gap, not a reflection of anything about you. Clubs that recruit heavily during first-year orientation may not repeat that same outreach in later years, which means walking in cold sophomore or junior year can genuinely take more initiative.",
      "The advantage: by the time you're looking, you usually already know more about what you actually want out of a group than most first-years do at the same stage. That clarity is worth something -- it's often faster to find the right fit later with a clear sense of what you're looking for than to find it early without one.",
      "Don't discount reaching out to a club leader directly and asking whether they take new members outside the usual recruiting window. Most do; they just don't always advertise it.",
    ],
  },
  {
    slug: "international-students",
    title: "If you're coming from outside the US",
    intro: "Belonging here often means building two kinds of community at once, not choosing between them.",
    body: [
      "Orientation week usually includes some programming aimed specifically at international students -- it's worth going even if the rest of orientation feels US-centric, since it's often where you'll meet other students navigating the same adjustment at the same time.",
      "It's common to feel pulled between a home-country/cultural community and the wider campus -- these aren't competing options. Many international students end up deeply involved in a country- or region-specific org while also building friendships through classes, dorms, or unrelated hobby clubs. Both are real belonging, not a consolation version of it.",
      "Practical adjustment (banking, visas, healthcare, first winter) can eat a lot of early-semester energy that domestic students don't have to spend the same way. If community-building feels slower at first, that's a reasonable and common reason, not a sign you're doing something wrong.",
    ],
  },
  {
    slug: "upperclassmen",
    title: "If you're further along and re-evaluating your community",
    intro: "It's common for the group that felt right freshman year to feel less right by junior or senior year.",
    body: [
      "That's not a sign anything went wrong. People's needs shift -- what felt exciting as a way to meet people early on can start to feel more like an obligation once you already have a friend group and are looking for something else, like depth in a specific interest, or leadership experience, or just less time commitment.",
      "It's fine to scale back from something that no longer fits, and it's fine to go looking for something new later than everyone else seems to have settled in. There's no cutoff after which starting a new club is too late.",
    ],
  },
  {
    slug: "greek-life",
    title: "If you're considering Greek life",
    intro: "Fraternities and sororities are one of the most visible forms of campus community, and also one of the most polarizing.",
    body: [
      "The appeal is real and specific: an immediate social network, often housing, a built-in structure to your week, and an alumni network that can matter well past graduation. The trade-offs are just as real -- a real time commitment, dues that can be a genuine financial factor, and a chapter culture that varies enormously from house to house even within the same national organization.",
      "Recruitment is designed to compress a lot of judgment into a short window, which makes it easy to decide based on which house felt most impressive rather than which one actually fits how you want to spend your time. Going to events at more than one house, and asking current members pointed questions rather than just the pitch, tends to reveal more than the recruitment events themselves are built to show.",
      "It's worth asking directly about cost -- national dues, chapter dues, housing, formal-wear expectations -- before committing, since the full financial picture isn't always volunteered upfront. Many chapters have need-based support available, but you generally have to ask.",
      "Chapter culture around new-member expectations is also worth understanding before you commit, not after -- see the next article on hazing for what to actually look for and ask about.",
    ],
  },
  {
    slug: "hazing",
    title: "Understanding hazing and how to stay safe",
    intro: "Hazing remains a real risk in some Greek life, athletics, and club cultures, even though it's against both New York State law and university policy.",
    body: [
      "Hazing generally means any activity expected of a new or prospective member that humiliates, degrades, physically endangers, or is otherwise abusive, regardless of whether the person being hazed appears to consent to it. Willingness to participate doesn't make an activity not hazing -- social pressure and the desire to belong are exactly what makes hazing effective, which is part of why it's treated seriously as a safety issue rather than a personal choice.",
      "A few patterns are worth treating as warning signs: being told to keep new-member activities secret from family, staff, or people outside the group; activities scheduled very late at night or involving sleep deprivation; being told some version of \"everyone who came before you went through this\"; and any sense that opting out of a specific activity would carry real social consequences within the group.",
      "Most universities have reporting channels for hazing concerns, including through campus safety and the office responsible for student conduct -- for the current, accurate reporting process at your school, check its official student life or student conduct pages directly, since exact office names and contact channels can change.",
      "Reporting a concern doesn't have to mean getting anyone in serious trouble by itself -- many reporting channels allow for informational reports, and organizations found responsible typically face a process rather than an automatic worst-case outcome. The goal of these channels is to prevent harm, not to punish curiosity about whether something is okay.",
    ],
  },
  {
    slug: "pre-professional-clubs",
    title: "Navigating pre-professional club culture",
    intro: "Pre-professional clubs -- consulting, finance, business, engineering societies -- can be some of the most competitive and most rewarding communities on campus, depending on how you approach them.",
    body: [
      "The appeal is straightforward: structured mentorship, recruiting pipelines into specific industries, case competitions, and a resume line that reads clearly to employers. For students who know roughly what field they're headed toward, that structure can be genuinely valuable.",
      "The application process for many of these clubs is itself competitive -- multiple rounds, case interviews, sometimes lower acceptance rates than the university's own admissions. Not getting in on a first try is common and doesn't reflect your overall capability or fit here; plenty of students who didn't get into their first-choice club built strong outcomes through other paths.",
      "It's worth being realistic about the actual weekly time commitment before joining, since some of these clubs expect a meaningful number of hours on top of coursework. Career services and academic advising can offer some of the same networking and resume-building value without the same time cost, and are worth exploring alongside or instead of a club, depending on what you're actually looking for.",
    ],
  },
  {
    slug: "university-resources",
    title: "Resources most students don't find until they need them",
    intro: "Most universities have a lot of institutional support infrastructure that isn't always obvious until you're already looking for it under stress.",
    body: [
      "Broadly, this includes academic advising and your class dean's office, counseling and psychological services, financial aid (including emergency funding for unexpected situations), disability and accessibility services, and an ombuds-type office for informal conflict resolution outside of formal complaint processes. Career services also extends well beyond pre-professional clubs, with advising available regardless of what you're majoring in.",
      "It's worth spending ten minutes finding these offices while things are calm, rather than for the first time while something is urgent -- knowing a resource exists and roughly how to reach it removes one layer of friction from an already stressful moment.",
      "Exact office names, structures, and contact points can shift year to year, so for current, accurate details it's worth checking your school's official student life or dean's office pages directly rather than relying on secondhand information.",
    ],
  },
  {
    slug: "mental-health-and-wellness",
    title: "Taking care of yourself while you're building community",
    intro: "The pressure to find your people quickly can itself become a source of stress, on top of everything else a semester asks of you.",
    body: [
      "Not having found a settled community yet -- in week three, or even by the end of a first semester -- doesn't reflect a personal failure. The pacing described throughout these articles is normal, even when it doesn't feel that way in the moment.",
      "It's worth protecting some unstructured downtime even while you're actively trying to build community, rather than treating every free hour as a networking opportunity. Belonging tends to build better on a foundation of actually being okay day to day, not the other way around.",
      "Your school's counseling and psychological services are typically available to any enrolled student, not just students in visible crisis -- for current contact information and what to expect from an initial appointment, it's worth checking your school's counseling center pages directly.",
    ],
  },
];

export function recommendSection(profile: {
  year: string;
  isInternational?: boolean;
  background?: string[];
  goals?: string[];
  postGradInterests?: string[];
  vector: { group_size: number; public: number; identity: number };
}): string {
  if (profile.isInternational === true) return "international-students";
  if (profile.year === "junior" || profile.year === "senior") return "upperclassmen";
  if (
    (profile.background && profile.background.length > 0) ||
    (profile.goals && profile.goals.includes("find_identity_community")) ||
    profile.vector.identity >= 7
  ) {
    return "identity-and-community";
  }
  if (
    (profile.goals && profile.goals.includes("build_resume")) ||
    (profile.postGradInterests && profile.postGradInterests.length > 0)
  ) {
    return "pre-professional-clubs";
  }
  if (profile.vector.group_size <= 4 || profile.vector.public <= 4) {
    return "quiet-or-introverted";
  }
  if (profile.year === "freshman") return "first-year";
  return "transfer-or-later-arrival";
}
