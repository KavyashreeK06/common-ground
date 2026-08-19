import {
  BookOpen, Trophy, Globe, Home, Heart, Newspaper, Music, Drama,
  Megaphone, Briefcase, Sparkles, HeartHandshake, Puzzle, Landmark, Layers,
  LucideIcon,
} from "lucide-react";

const EXACT_MATCH: Record<string, LucideIcon> = {
  "Academic": BookOpen,
  "Athletics": Trophy,
  "Cultural": Globe,
  "Fraternity and Sorority Life": Home,
  "Identity-Based": Heart,
  "Media and Publications": Newspaper,
  "Musical": Music,
  "Performing Arts": Drama,
  "Politics, Activism and Advocacy": Megaphone,
  "Pre-Professional": Briefcase,
  "Religious/Spiritual": Sparkles,
  "Service": HeartHandshake,
  "Special Interest": Puzzle,
  "Student Government and Advisory Boards": Landmark,
};

const KEYWORD_FALLBACKS: [RegExp, LucideIcon][] = [
  [/academic/i, BookOpen],
  [/athlet|sport|recreational/i, Trophy],
  [/cultural|affinity/i, Globe],
  [/professional/i, Briefcase],
  [/arts|performing/i, Drama],
  [/advocacy/i, Megaphone],
  [/hobby/i, Puzzle],
  [/service/i, HeartHandshake],
];

export function getCategoryIcon(category: string): LucideIcon {
  if (EXACT_MATCH[category]) return EXACT_MATCH[category];
  for (const [pattern, icon] of KEYWORD_FALLBACKS) {
    if (pattern.test(category)) return icon;
  }
  return Layers;
}

export function CategoryIcon({ category, size = 13 }: { category: string; size?: number }) {
  const Icon = getCategoryIcon(category);
  return <Icon size={size} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />;
}
