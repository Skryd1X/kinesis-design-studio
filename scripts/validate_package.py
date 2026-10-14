#!/usr/bin/env python3
"""Validate the single skill, authored links and attributed source integrity."""
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def validate(root=ROOT):
    errors = []
    skill = root / 'skills/kinesis-design-studio'
    active = [p for p in root.rglob('SKILL.md') if 'node_modules' not in p.parts]
    if active != [skill / 'SKILL.md']:
        errors.append('Exactly one discoverable SKILL.md is required')
    content = (skill / 'SKILL.md').read_text(encoding='utf-8')
    if not re.match(r'\A---\nname: kinesis-design-studio\ndescription: .+\n', content):
        errors.append('Invalid portable frontmatter')
    if 'author: "Skryd1X"' not in content:
        errors.append('Author metadata missing')
    for path in root.rglob('*'):
        if any(x in {'node_modules', '.git', '__pycache__'} for x in path.parts):
            continue
        if path.is_symlink():
            errors.append(f'Symlink not distributable: {path.relative_to(root)}')
        if path.is_file() and path.suffix == '.md' and 'upstream' not in path.parts:
            text = path.read_text(encoding='utf-8')
            if re.search(r'[\u0400-\u04ff\u4e00-\u9fff]', text):
                errors.append(f'Original package documentation must be English: {path.relative_to(root)}')
            for target in re.findall(r'\]\(([^)]+)\)', text):
                if '://' in target or target.startswith('#'):
                    continue
                resolved = (path.parent / target.split('#')[0]).resolve()
                if not resolved.is_relative_to(root.resolve()) or not resolved.exists():
                    errors.append(f'Broken original link: {path.relative_to(root)} -> {target}')
    lock = json.loads((skill / 'sources.lock.json').read_text(encoding='utf-8'))
    if len(lock['sources']) != 15:
        errors.append('Expected all 15 selected source repositories')
    for source in lock['sources']:
        if not re.fullmatch(r'[a-f0-9]{40}', source['commit']):
            errors.append(f"Missing immutable source commit: {source['repository']}")
        if source['mode'] == 'bundled-reference':
            for item in source['files']:
                file = skill / item['bundle_path']
                if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != item['sha256']:
                    errors.append(f"Source integrity mismatch: {item['bundle_path']}")
            if not source['license_files']:
                errors.append(f"Source license missing: {source['repository']}")
    catalog = json.loads((skill / 'assets/device-catalog.json').read_text())
    if len(catalog['devices']) < 200:
        errors.append('Device descriptor snapshot unexpectedly incomplete')
    for manifest in (root / '.claude-plugin').glob('*.json'):
        json.loads(manifest.read_text())
    plugin = json.loads((root / '.claude-plugin/plugin.json').read_text())
    if plugin.get('name') != skill.name or plugin.get('author', {}).get('name') != 'Skryd1X':
        errors.append('Plugin identity mismatch')
    return errors


if __name__ == '__main__':
    failures = validate()
    for failure in failures:
        print('FAIL: ' + failure)
    print('Package validation passed' if not failures else 'Package validation failed')
    raise SystemExit(bool(failures))
