"""
PowerHouse Tracker – Game-plan Generator
Reads docs/gap-analysis.md (table), produces GAMEPLAN.md
"""

import re, datetime, textwrap, pathlib, json

GAP_FILE = pathlib.Path("docs/gap-analysis.md")
OUT_FILE = pathlib.Path("GAMEPLAN.md")

def parse_gap_table(md):
    rows = []
    in_table = False
    for line in md.splitlines():
        if line.startswith("| Area"):
            in_table = True
            continue
        if in_table and line.startswith("|"):
            cols = [c.strip() for c in line.strip("| \n").split("|")]
            if len(cols) >= 5 and not cols[0].startswith("---"):
                # Remove markdown formatting from feature name
                feature_name = cols[0].strip("*").strip()
                if feature_name and feature_name != "Area / Feature":
                    rows.append({
                        "feature": feature_name,
                        "current": cols[1],
                        "target":  cols[2],
                        "priority": cols[3],
                        "effort":  cols[4]
                    })
        elif in_table and not line.startswith("|"):
            break
    return rows

def build_gameplan(rows):
    today = datetime.date.today()
    phase_weeks = {"HIGH": 2, "MED": 3, "LOW": 4}
    timeline = []
    week_cursor = 0
    for r in rows:
        weeks = phase_weeks.get(r["priority"].upper(), 2)
        timeline.append({
            "feature": r["feature"],
            "start": today + datetime.timedelta(weeks=week_cursor),
            "end":   today + datetime.timedelta(weeks=week_cursor + weeks),
            "notes": r["target"]
        })
        week_cursor += weeks
    return timeline

def render(plan):
    lines = ["# PowerHouse Tracker – Development Game-plan",
             f"_Generated: {datetime.date.today().isoformat()}_\n"]
    for item in plan:
        lines.append(f"### {item['feature']}")
        lines.append(f"* [TIME] **{item['start']} → {item['end']}**")
        lines.append(f"* [GOAL] {item['notes']}\n")
    return "\n".join(lines)

def main():
    md = GAP_FILE.read_text(encoding='utf-8')
    rows = parse_gap_table(md)
    plan = build_gameplan(rows)
    OUT_FILE.write_text(render(plan), encoding='utf-8')
    print(f"✅ GAMEPLAN.md created with {len(plan)} items")

if __name__ == "__main__":
    main()
