import json
import os

SEED_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "columbia_orgs_seed.json")

CATEGORY_TEMPLATES = {
    "Academic": "{name} connects Columbia students interested in this field through talks, projects, and shared academic community.",
    "Athletics": "{name} is a Columbia recreational or club sports team, open to students across experience levels.",
    "Cultural": "{name} builds community and celebrates shared culture among Columbia students.",
    "Fraternity and Sorority Life": "{name} is a chapter within Columbia's fraternity and sorority community.",
    "Identity-Based": "{name} provides community and support for Columbia students who share this identity or experience.",
    "Media and Publications": "{name} is a Columbia student-run publication or media outlet.",
    "Musical": "{name} is a Columbia student musical ensemble.",
    "Performing Arts": "{name} is a Columbia student performing arts group.",
    "Politics, Activism and Advocacy": "{name} organizes Columbia students around political engagement and advocacy.",
    "Pre-Professional": "{name} connects Columbia students pursuing this field with career resources, networking, and skill-building.",
    "Religious/Spiritual": "{name} is a Columbia community for students practicing or exploring this faith or spiritual tradition.",
    "Service": "{name} organizes Columbia students around volunteer service and community impact.",
    "Special Interest": "{name} is a casual Columbia community built around a shared hobby or interest.",
    "Student Government and Advisory Boards": "{name} is part of Columbia's student government and governance structure.",
}
FALLBACK_TEMPLATE = "{name} is a Columbia student organization. A fuller description hasn't been submitted yet."

with open(SEED_PATH) as f:
    data = json.load(f)

filled = 0
for org in data["orgs"]:
    if not org.get("description", "").strip():
        template = CATEGORY_TEMPLATES.get(org["category"], FALLBACK_TEMPLATE)
        org["description"] = template.format(name=org["name"])
        filled += 1

with open(SEED_PATH, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Filled {filled} descriptions")
