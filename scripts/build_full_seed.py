import json
import re

RAW_PATH = "/home/claude/scratch/raw_directory.txt"
EXISTING_SEED_PATH = "/home/claude/campus-connections/data/columbia_orgs_seed.json"
OUT_PATH = "/home/claude/campus-connections/data/columbia_orgs_seed.json"

CATEGORY_HEADERS = [
    "Academic", "Athletics", "Cultural", "Fraternity and Sorority Life",
    "Identity-Based", "Media and Publications", "Musical", "Performing Arts",
    "Politics, Activism and Advocacy", "Pre-Professional", "Religious/Spiritual",
    "Service", "Special Interest", "Student Government and Advisory Boards",
]

AXES = ["structure", "competitive", "public", "group_size", "career",
        "physical", "creative", "cause", "novelty", "identity"]

# Category-level DEFAULT vectors. These are intentionally moderate/central on
# axes a category doesn't strongly determine, and pushed on axes it clearly does.
# Convention: higher = more of the trait (see types/index.ts AXES comment).
CATEGORY_DEFAULTS = {
    "Academic":                         {"structure": 6, "competitive": 4, "public": 3, "group_size": 4, "career": 6, "physical": 0, "creative": 2, "cause": 2, "novelty": 3, "identity": 1},
    "Athletics":                        {"structure": 7, "competitive": 7, "public": 5, "group_size": 5, "career": 0, "physical": 9, "creative": 0, "cause": 0, "novelty": 2, "identity": 1},
    "Cultural":                         {"structure": 4, "competitive": 1, "public": 5, "group_size": 6, "career": 1, "physical": 1, "creative": 3, "cause": 3, "novelty": 2, "identity": 9},
    "Fraternity and Sorority Life":     {"structure": 6, "competitive": 2, "public": 5, "group_size": 8, "career": 2, "physical": 2, "creative": 2, "cause": 2, "novelty": 2, "identity": 6},
    "Identity-Based":                   {"structure": 3, "competitive": 1, "public": 3, "group_size": 4, "career": 1, "physical": 0, "creative": 2, "cause": 5, "novelty": 1, "identity": 9},
    "Media and Publications":           {"structure": 5, "competitive": 1, "public": 4, "group_size": 3, "career": 3, "physical": 0, "creative": 7, "cause": 2, "novelty": 3, "identity": 1},
    "Musical":                          {"structure": 7, "competitive": 2, "public": 7, "group_size": 4, "career": 1, "physical": 2, "creative": 8, "cause": 0, "novelty": 1, "identity": 2},
    "Performing Arts":                  {"structure": 7, "competitive": 3, "public": 8, "group_size": 5, "career": 1, "physical": 5, "creative": 8, "cause": 0, "novelty": 1, "identity": 2},
    "Politics, Activism and Advocacy":  {"structure": 5, "competitive": 1, "public": 5, "group_size": 4, "career": 2, "physical": 0, "creative": 2, "cause": 8, "novelty": 2, "identity": 3},
    "Pre-Professional":                 {"structure": 6, "competitive": 4, "public": 3, "group_size": 5, "career": 8, "physical": 0, "creative": 2, "cause": 1, "novelty": 2, "identity": 1},
    "Religious/Spiritual":              {"structure": 5, "competitive": 0, "public": 3, "group_size": 5, "career": 0, "physical": 0, "creative": 1, "cause": 4, "novelty": 1, "identity": 6},
    "Service":                          {"structure": 5, "competitive": 0, "public": 2, "group_size": 4, "career": 2, "physical": 1, "creative": 1, "cause": 8, "novelty": 2, "identity": 2},
    "Special Interest":                 {"structure": 3, "competitive": 2, "public": 2, "group_size": 4, "career": 1, "physical": 1, "creative": 4, "cause": 1, "novelty": 6, "identity": 1},
    "Student Government and Advisory Boards": {"structure": 8, "competitive": 2, "public": 5, "group_size": 6, "career": 4, "physical": 0, "creative": 1, "cause": 3, "novelty": 1, "identity": 1},
}

# Small keyword-based nudges applied on top of category defaults, so orgs
# with obvious signals in their name aren't stuck at the category baseline.
KEYWORD_NUDGES = [
    (re.compile(r"\b(varsity|team)\b", re.I), {"competitive": +2, "structure": +1}),
    (re.compile(r"\b(tournament|league)\b", re.I), {"competitive": +1, "structure": -1, "group_size": +1}),
    (re.compile(r"\b(club)\b", re.I), {"structure": -1}),
    (re.compile(r"\bdance|ballet|troupe|dance team\b", re.I), {"physical": +3}),
    (re.compile(r"\ba cappella|choir|orchestra|band|pops|ensemble\b", re.I), {"public": +1}),
    (re.compile(r"\bfellow|honor|honorary\b", re.I), {"career": +1, "novelty": -1}),
    (re.compile(r"\bpre-med|pre-law|premed|prelaw|medical\b", re.I), {"career": +2}),
    (re.compile(r"\bpeer|tutor|mentor|advocat|outreach\b", re.I), {"cause": +1}),
    (re.compile(r"\bhackathon|robotics|coding|computing|coders?\b", re.I), {"creative": -1, "career": +1}),
]

def clamp(v):
    return max(0, min(10, v))

def build_tags(category: str, name: str) -> dict:
    base = dict(CATEGORY_DEFAULTS[category])
    for pattern, deltas in KEYWORD_NUDGES:
        if pattern.search(name):
            for axis, d in deltas.items():
                base[axis] = clamp(base[axis] + d)
    return base

def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s

# --- Parse the raw pasted directory ---
with open(RAW_PATH) as f:
    lines = [ln.strip() for ln in f.readlines()]

parsed = {}  # category -> list of org names
current_cat = None
for ln in lines:
    if not ln:
        continue
    if ln in CATEGORY_HEADERS:
        current_cat = ln
        parsed[current_cat] = []
        continue
    if current_cat:
        parsed[current_cat].append(ln)

total_parsed = sum(len(v) for v in parsed.values())
print(f"Parsed {total_parsed} org names across {len(parsed)} categories")

# --- Load existing hand-tagged orgs (keep their tags, avoid re-adding) ---
with open(EXISTING_SEED_PATH) as f:
    existing = json.load(f)

existing_names_lower = {o["name"].lower().strip() for o in existing["orgs"]}
merged_orgs = list(existing["orgs"])  # start with what's already hand-tagged

added, skipped = 0, 0
for category, names in parsed.items():
    for name in names:
        if name.lower().strip() in existing_names_lower:
            skipped += 1
            continue
        merged_orgs.append({
            "name": name,
            "category": category,
            "description": "",  # not provided by the directory; fill in if you want richer blurbs
            "tags": build_tags(category, name),
        })
        existing_names_lower.add(name.lower().strip())
        added += 1

print(f"Added {added} new orgs, skipped {skipped} already-tagged duplicates")
print(f"Total orgs in merged dataset: {len(merged_orgs)}")

existing["orgs"] = merged_orgs
existing["note"] = (
    "Org names sourced from Columbia's official student-group directory "
    "(undergrad.admissions.columbia.edu/life/here/clubs/listings), pasted in full. "
    "The ~30 orgs from the original hand-picked batch have individually-reasoned tags. "
    "All other orgs (the bulk of this file) were tagged automatically using "
    "category-level default vectors plus light keyword nudges (see "
    "scripts/build_full_seed.py) -- treat these as a reasonable v1, not precise "
    "per-org judgments. Refine by hand for any org that ends up in your top demo matches."
)

with open(OUT_PATH, "w") as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print(f"Wrote {OUT_PATH}")
