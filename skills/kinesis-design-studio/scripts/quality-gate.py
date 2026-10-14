#!/usr/bin/env python3
"""Check declared quality-ledger consistency, without certifying the artifact."""
import argparse
import json
from pathlib import Path
import sys

CATEGORIES = {"layout", "style", "interaction", "accessibility", "motion", "performance", "visual"}


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def evidence(value):
    return isinstance(value, list) and bool(value) and all(nonempty(item) for item in value)


def evaluate(data):
    errors, blockers = [], []
    if not isinstance(data, dict):
        return ["Ledger must be an object"], []
    if type(data.get("schema_version")) is not int or data["schema_version"] != 1:
        errors.append("schema_version must be integer 1")
    for field in ("scope", "revision"):
        if not nonempty(data.get(field)):
            errors.append(f"Missing {field}")
    groups = {}
    for group in ("checks", "defects", "passes"):
        value = data.get(group)
        if not isinstance(value, list) or not all(isinstance(item, dict) for item in value):
            errors.append(f"{group} must be an array of objects")
            groups[group] = []
            continue
        groups[group] = value
        ids = set()
        for item in value:
            identifier = item.get("id")
            if not nonempty(identifier) or identifier in ids:
                errors.append(f"Invalid/duplicate {group} id")
            else:
                ids.add(identifier)
    observed = set()
    for check in groups["checks"]:
        category, status = check.get("category"), check.get("status")
        if not isinstance(category, str) or category not in CATEGORIES:
            errors.append("Invalid check category")
            continue
        observed.add(category)
        if status not in ("passed", "failed", "blocked", "not-applicable"):
            errors.append("Invalid check status")
        if status == "passed" and (not evidence(check.get("evidence")) or not nonempty(check.get("context"))):
            errors.append(f"Passed {category} needs evidence and profile/state context")
        if status in ("failed", "blocked"):
            blockers.append(f"{check.get('id')}: {status}")
        if status == "not-applicable":
            if not nonempty(check.get("reason")):
                errors.append("Exclusion needs a reason")
            if category not in {"motion", "performance"}:
                blockers.append(f"Required {category} cannot be excluded")
    for category in sorted(CATEGORIES - observed):
        blockers.append(f"No {category} check recorded")
    for defect in groups["defects"]:
        severity, status = defect.get("severity"), defect.get("status")
        if severity not in ("blocking", "major", "minor") or status not in ("open", "fixed-unverified", "verified", "residual"):
            errors.append("Invalid defect severity/status")
        if not evidence(defect.get("evidence")) or not nonempty(defect.get("description")):
            errors.append("Defect needs description and evidence")
        if status == "verified" and not evidence(defect.get("validation")):
            errors.append("Verified defect needs validation")
        if status in ("open", "fixed-unverified") or (status == "residual" and severity != "minor"):
            blockers.append(f"Unresolved defect: {defect.get('id')}")
        if status == "residual" and (not nonempty(defect.get("reason")) or not nonempty(defect.get("owner"))):
            errors.append("Residual defect needs a reason and owner")
    if len(groups["passes"]) < 2:
        blockers.append("Initial and final verification passes are required")
    for item in groups["passes"]:
        if not nonempty(item.get("method")) or not evidence(item.get("evidence")):
            errors.append("Pass needs method and evidence")
    return errors, blockers


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate JSON key: {key}")
        result[key] = value
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ledger", type=Path)
    args = parser.parse_args()
    try:
        if args.ledger.stat().st_size > 10 * 1024 * 1024:
            raise ValueError("Ledger exceeds the 10 MiB limit")
        data = json.loads(args.ledger.read_text(encoding="utf-8-sig"), object_pairs_hook=unique_object)
        errors, blockers = evaluate(data)
    except (OSError, ValueError, RecursionError) as error:
        print(f"INVALID: {error}", file=sys.stderr)
        raise SystemExit(2)
    if errors:
        print("INVALID: " + "; ".join(errors))
        raise SystemExit(2)
    if blockers:
        print("INCOMPLETE: " + "; ".join(blockers))
        raise SystemExit(1)
    print("DECLARED QUALITY GATE PASSED. Evidence truth and sufficiency still require review.")
