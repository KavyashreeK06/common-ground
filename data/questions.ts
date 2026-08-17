import { QuizQuestion } from "../types";

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "It's a free Friday night. You'd rather...",
    options: [
      { label: "Rehearse or practice for something you've committed to", deltas: { structure: 2, group_size: -1 } },
      { label: "Go to a casual meetup with no agenda", deltas: { structure: -2, novelty: 1 } },
      { label: "Work on a personal project alone or with 1-2 people", deltas: { group_size: -3, career: 1 } },
      { label: "Go to an event or show as an audience member", deltas: { public: 1, novelty: 1 } },
    ],
  },
  {
    id: "q2",
    text: "When working toward a goal, you prefer...",
    options: [
      { label: "Clear rankings or competition to push you", deltas: { competitive: 3 } },
      { label: "A shared goal everyone works toward together", deltas: { competitive: -3 } },
      { label: "Setting your own pace, no external pressure", deltas: { structure: -2, competitive: -1 } },
    ],
  },
  {
    id: "q3",
    text: "Pick a room you'd walk into and feel most at ease:",
    options: [
      { label: "A rehearsal space with people warming up", deltas: { public: 2, group_size: 1 } },
      { label: "A quiet room with a small group deep in discussion", deltas: { group_size: -2, physical: -2 } },
      { label: "A gym or field mid-practice", deltas: { physical: 3 } },
      { label: "A workshop with people building or making something", deltas: { creative: 2, physical: 1 } },
    ],
  },
  {
    id: "q4",
    text: "What pulls you into a new group faster?",
    options: [
      { label: "Shared background, identity, or culture", deltas: { identity: 3 } },
      { label: "Shared interest in a specific activity or skill", deltas: { identity: -3 } },
      { label: "A clear mission or cause you believe in", deltas: { cause: 3 } },
    ],
  },
  {
    id: "q5",
    text: "How do you like to spend your energy in a group?",
    options: [
      { label: "Performing or presenting in front of others", deltas: { public: 3 } },
      { label: "Building something that speaks for itself", deltas: { public: -2, creative: 1 } },
      { label: "Organizing or coordinating behind the scenes", deltas: { public: -3 } },
    ],
  },
  {
    id: "q6",
    text: "A club meeting runs long because of passionate debate. You're...",
    options: [
      { label: "Energized -- this is why you joined", deltas: { physical: -2, cause: 1 } },
      { label: "Fine with it occasionally, but prefer efficient meetings", deltas: { structure: 1 } },
      { label: "Would rather be doing than discussing", deltas: { physical: 2, cause: -1 } },
    ],
  },
  {
    id: "q7",
    text: "Which future headline about you sounds best?",
    options: [
      { label: "\"Led team to national competition\"", deltas: { competitive: 3, career: 1 } },
      { label: "\"Started a mutual aid initiative on campus\"", deltas: { cause: 3 } },
      { label: "\"Performed lead role in campus production\"", deltas: { public: 3, creative: 2 } },
      { label: "\"Built a technical project used by hundreds of people\"", deltas: { creative: -3, career: 2 } },
    ],
  },
  {
    id: "q8",
    text: "Your ideal club size:",
    options: [
      { label: "Huge -- always something happening", deltas: { group_size: 3 } },
      { label: "Small enough that everyone knows your name", deltas: { group_size: -3 } },
    ],
  },
  {
    id: "q9",
    text: "How much does resume or career relevance factor into what clubs you join?",
    options: [
      { label: "A lot -- I want relevant experience", deltas: { career: 3 } },
      { label: "Some, but not the main reason", deltas: {} },
      { label: "Not at all, purely for enjoyment", deltas: { career: -3 } },
    ],
  },
  {
    id: "q10",
    text: "You just discovered a new hobby. You'd rather...",
    options: [
      { label: "Go all-in and get really good at it", deltas: { novelty: -2 } },
      { label: "Try it a few times, then move to the next thing", deltas: { novelty: 3 } },
    ],
  },
  {
    id: "q11",
    text: "Pick the vibe:",
    options: [
      { label: "Structured practice", deltas: { structure: 3 } },
      { label: "Casual drop-in", deltas: { structure: -3 } },
    ],
  },
  {
    id: "q12",
    text: "What matters more in a community?",
    options: [
      { label: "People who get where I come from", deltas: { identity: 3 } },
      { label: "People who love what I love", deltas: { identity: -3 } },
    ],
  },
  {
    id: "q13",
    text: "What makes you stick with something new you've joined?",
    options: [
      { label: "The people start to feel like family", deltas: { group_size: -2, identity: 2 } },
      { label: "I can feel myself leveling up at something", deltas: { novelty: -2, career: 2 } },
      { label: "It stays low-pressure and fun", deltas: { structure: -2, competitive: -2 } },
      { label: "I feel like I'm contributing to something bigger", deltas: { cause: 2 } },
    ],
  },
  {
    id: "q14",
    text: "When you disagree with the group's plan, you...",
    options: [
      { label: "Push hard to change it -- I have strong opinions", deltas: { competitive: 2, cause: 1 } },
      { label: "Go with the flow, it's not worth the friction", deltas: { competitive: -2 } },
      { label: "Ask a lot of questions before deciding what to think", deltas: { physical: -1 } },
    ],
  },
  {
    id: "q15",
    text: "A club fair booth catches your eye because...",
    options: [
      { label: "It has the most energetic crowd around it", deltas: { group_size: 2, public: 2 } },
      { label: "It's quiet, low-key, feels approachable", deltas: { group_size: -2, public: -2 } },
      { label: "The flyer lists impressive alumni or career outcomes", deltas: { career: 2 } },
    ],
  },
  {
    id: "q16",
    text: "Your ideal weekend project looks like...",
    options: [
      { label: "Building or fixing something with my hands", deltas: { physical: 2 } },
      { label: "Writing, painting, or composing something", deltas: { creative: 2 } },
      { label: "Reading deeply into a topic that fascinates me", deltas: { physical: -2, novelty: -1 } },
    ],
  },
  {
    id: "q17",
    text: "Your friend group affectionately calls you...",
    options: [
      { label: "The organizer", deltas: { structure: 2 } },
      { label: "The wildcard", deltas: { structure: -2, novelty: 2 } },
      { label: "The mentor", deltas: { cause: 1, career: 1 } },
    ],
  },
  {
    id: "q18",
    text: "When it comes to trying new clubs, you...",
    options: [
      { label: "Go all in on one and become a regular fast", deltas: { novelty: -2 } },
      { label: "Like sampling a few before committing", deltas: { novelty: 2 } },
    ],
  },
  {
    id: "q19",
    text: "A club's social post that makes you want to join is...",
    options: [
      { label: "Behind-the-scenes bloopers and inside jokes", deltas: { public: -1, creative: 1 } },
      { label: "A big competition win", deltas: { competitive: 2, public: 1 } },
      { label: "A community impact highlight", deltas: { cause: 2 } },
    ],
  },
  {
    id: "q20",
    text: "If your club got written up in the school paper, you'd want the headline to be about...",
    options: [
      { label: "A record-breaking competition result", deltas: { competitive: 2 } },
      { label: "A heartfelt community impact story", deltas: { cause: 2 } },
      { label: "A wildly creative showcase", deltas: { creative: 2 } },
      { label: "A packed house at every single meeting", deltas: { group_size: 2 } },
    ],
  },
];
