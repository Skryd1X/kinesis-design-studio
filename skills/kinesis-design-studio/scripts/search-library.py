#!/usr/bin/env python3
"""Search the bundled reference library locally without executing upstream code."""
import argparse
import csv
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "references" / "upstream"


def search(query: str, limit: int = 8, kind: str = "all") -> list[dict]:
    words = set(re.findall(r"[a-z0-9]+", query.lower()))
    if not words:
        return []
    results = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in {".md", ".csv"}:
            continue
        if kind == "styles" and path.name != "styles.csv":
            continue
        if path.name.lower().startswith(("license", "notice")):
            continue
        if path.suffix == ".csv":
            with path.open(encoding="utf-8-sig", newline="") as source:
                for row in csv.DictReader(source):
                    haystack = " ".join(str(value) for value in row.values() if value).lower()
                    score = sum(word in haystack for word in words)
                    if score:
                        results.append({"score": score, "source": str(path.relative_to(ROOT)), "row": row})
        else:
            content = path.read_text(encoding="utf-8-sig")
            haystack = content.lower()
            score = sum(word in haystack for word in words)
            if score:
                relevant = [line for line in content.splitlines() if any(word in line.lower() for word in words)]
                results.append({"score": score, "source": str(path.relative_to(ROOT)), "excerpt": "\n".join(relevant[:8])[:1800]})
    return sorted(results, key=lambda item: (-item["score"], item["source"]))[:limit]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query")
    parser.add_argument("--limit", type=int, default=8)
    parser.add_argument("--kind", choices=("all", "styles"), default="all")
    args = parser.parse_args()
    if not 1 <= args.limit <= 50:
        parser.error("limit must be between 1 and 50")
    print(json.dumps(search(args.query, args.limit, args.kind), ensure_ascii=True, indent=2))
