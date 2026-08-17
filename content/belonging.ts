export interface BelongingSection {
  slug: string;
  title: string;
  intro: string;
  body: string[]; // paragraphs
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
    slug: "upperclassmen",
    title: "If you're further along and re-evaluating your community",
    intro: "It's common for the group that felt right freshman year to feel less right by junior or senior year.",
    body: [
      "That's not a sign anything went wrong. People's needs shift -- what felt exciting as a way to meet people early on can start to feel more like an obligation once you already have a friend group and are looking for something else, like depth in a specific interest, or leadership experience, or just less time commitment.",
      "It's fine to scale back from something that no longer fits, and it's fine to go looking for something new later than everyone else seems to have settled in. There's no cutoff after which starting a new club is too late.",
    ],
  },
];
