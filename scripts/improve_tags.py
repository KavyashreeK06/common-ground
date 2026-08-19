import json
import re

SEED_PATH = "data/columbia_orgs_seed.json"

AUTO_TAGGED_CATEGORIES = {
    "Academic", "Athletics", "Cultural", "Fraternity and Sorority Life",
    "Identity-Based", "Media and Publications", "Musical", "Performing Arts",
    "Politics, Activism and Advocacy", "Pre-Professional", "Religious/Spiritual",
    "Service", "Special Interest", "Student Government and Advisory Boards",
}

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

KEYWORD_NUDGES = [
    (re.compile(r"\bvarsity\b", re.I), {"competitive": 2, "structure": 1}),
    (re.compile(r"\b(tournament|league)\b", re.I), {"competitive": -1, "structure": -2, "group_size": 2}),
    (re.compile(r"\(club\)", re.I), {"competitive": -1, "structure": -1}),
    (re.compile(r"\b(hiking|climbing|yoga|running|road runners|triathlon|cycling)\b", re.I), {"physical": 1, "competitive": -2, "structure": -1}),
    (re.compile(r"\b(dance|ballet|troupe|raas|bhangra|wushu|lion dance|swing)\b", re.I), {"physical": 3, "public": 1}),
    (re.compile(r"\b(a cappella|choir|orchestra|band|pops|ensemble|singers?)\b", re.I), {"public": 1, "creative": 1}),
    (re.compile(r"\b(theatre|theater|sketch|improv|comedy|players?|drama)\b", re.I), {"public": 2, "creative": 1}),
    (re.compile(r"\b(debate|model (congress|un)|mock trial|quiz bowl)\b", re.I), {"competitive": 3, "public": 2, "physical": -2}),
    (re.compile(r"\bhonor(ary|s)?\b|\bfellow(ship)?\b", re.I), {"career": 1, "novelty": -1, "group_size": -1}),
    (re.compile(r"\b(consulting|finance|investment|banking|entrepreneur|venture|marketing)\b", re.I), {"career": 1, "competitive": 1}),
    (re.compile(r"\b(engineering|technical|technology|computing|coding|robotics|hackathon)\b", re.I), {"career": 1, "creative": 1}),
    (re.compile(r"\b(tutoring|tutor|mentor(ing|ship)?|volunteer|outreach|habitat|red cross)\b", re.I), {"cause": 1}),
    (re.compile(r"\b(peer|advocat\w*|awareness)\b", re.I), {"cause": 1}),
    (re.compile(r"\b(journal|review|newspaper|magazine|gazette)\b", re.I), {"creative": -1, "career": 1}),
    (re.compile(r"\b(radio|film|records?|yearbook)\b", re.I), {"creative": 2}),
    (re.compile(r"\b(chess|poker|gaming|minecraft|smash bros|sci-?fi|science fiction)\b", re.I), {"novelty": 1, "competitive": 1}),
    (re.compile(r"\b(culinary|gourmand|bartending|vegan)\b", re.I), {"novelty": 1, "group_size": -1}),
    (re.compile(r"\bheritage month|awareness month\b", re.I), {"public": 2, "cause": 1}),
    (re.compile(r"\b(professional|engineering)\b.*\b(fraternity|sorority)\b|\b(fraternity|sorority)\b.*\b(professional|engineering)\b", re.I), {"career": 2, "public": -1}),
    (re.compile(r"\b(council|senate|assembly|board)\b", re.I), {"structure": 1, "group_size": 1}),
]


def clamp(v):
    return max(0, min(10, v))


CASUAL_ATHLETICS_MARKERS = re.compile(r"\b(tournament|league)\b|\(club\)", re.I)


def build_improved_tags(category, name):
    base = dict(CATEGORY_DEFAULTS[category])
    for pattern, deltas in KEYWORD_NUDGES:
        if pattern.search(name):
            for axis, d in deltas.items():
                base[axis] = clamp(base[axis] + d)
    if category == "Athletics" and not CASUAL_ATHLETICS_MARKERS.search(name):
        base["competitive"] = clamp(base["competitive"] + 2)
        base["structure"] = clamp(base["structure"] + 1)
    return base


with open(SEED_PATH) as f:
    data = json.load(f)

changed = 0
for org in data["orgs"]:
    if org["category"] in AUTO_TAGGED_CATEGORIES:
        old_tags = org["tags"]
        new_tags = build_improved_tags(org["category"], org["name"])
        if new_tags != old_tags:
            changed += 1
        org["tags"] = new_tags

UPDATE_NOTE = (
    " UPDATE: auto-tagged orgs (the 464 from the bulk directory import) had their tags "
    "recomputed with keyword-based nudges layered on top of category defaults (see "
    "scripts/improve_tags.py) -- e.g. 'Varsity' pushes competitive up, 'A Cappella' pushes "
    "public/creative up. This meaningfully differentiates orgs within the same category that "
    "were previously identical, though it's still a heuristic, not individually reasoned tagging."
)
if UPDATE_NOTE.strip() not in data.get("note", ""):
    data["note"] = data.get("note", "") + UPDATE_NOTE

with open(SEED_PATH, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Recomputed tags for {changed} orgs (out of {sum(1 for o in data['orgs'] if o['category'] in AUTO_TAGGED_CATEGORIES)} auto-tagged orgs)")
