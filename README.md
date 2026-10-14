# Kinesis Design Studio

**Created by Skryd1X.** One portable English-language Agent Skill for premium UI, distinctive art direction, purposeful motion, responsive engineering, 3D and product-video workflows with internal verification and repair.

The skill first discovers the project and offers meaningful style choices. It builds the selected visual world, then checks actual layout, interactions, style contracts and animation evidence. Defects lead to repair and another verification pass. The active workflow is English; attributed upstream reference snapshots retain their original language.

## Included

- One active SKILL.md, with domain playbooks loaded on demand.
- Extracted knowledge from 12 licensed upstream repositories with original license/notice files, immutable snapshot IDs and file hashes.
- Three additional inspected sources recorded as link-only because redistribution permission was not established from their repository files.
- UI/UX Pro Max local style/palette/type/UX/stack data and our own searchable reference tool.
- Style choice including Quiet Luxury / Couture, High-Tech / Cinematic, Editorial, Minimal Product and other directions.
- A 207-device Playwright descriptor snapshot plus generic sizes, breakpoint neighbors and width sweeps.
- Executable browser QA for responsive geometry, pointer obstruction, style overrides, alignment, scenario states, motion contracts and main-thread timing evidence.
- A quality ledger gate, unit/browser regression tests, and a safe local installer.

This package does not bundle third-party renderers, models, fonts, audio, paid services or an autonomous background process. Headless/emulated tests do not prove every physical device or GPU is smooth. Native layouts, true zoom, accessibility and visual/video craft require their own evidence.

## Install the skill

From a reviewed clone or this unpacked repository:

```text
python scripts/install.py --agent both --user
python scripts/install.py --agent codex --project /path/to/application
python scripts/install.py --agent claude --project /path/to/application
```

The installer copies the complete skill to .agents/skills/kinesis-design-studio for Codex and .claude/skills/kinesis-design-studio for Claude Code. It refuses to overwrite an existing installation. Reload/restart discovery if needed. It does not install browser tools or alter your application's dependencies.

Codex: `Use $kinesis-design-studio to offer design directions, build my interface with exceptional motion, and verify and repair layout, interaction and animation defects.`

Claude Code direct install: `/kinesis-design-studio Build this interface, let me choose the design direction, and test and repair the responsive layout and motion.`

The included Claude marketplace can be installed locally with `/plugin marketplace add /absolute/path/to/kinesis-design-studio` then `/plugin install kinesis-design-studio@kinesis-design-studio-marketplace`. A plugin invocation is `/kinesis-design-studio:kinesis-design-studio`.

## Install from GitHub

Repository: https://github.com/Skryd1X/kinesis-design-studio

Codex with skill-installer:

```text
$skill-installer install https://github.com/Skryd1X/kinesis-design-studio/tree/main/skills/kinesis-design-studio
```

Claude Code marketplace:

```text
/plugin marketplace add Skryd1X/kinesis-design-studio
/plugin install kinesis-design-studio@kinesis-design-studio-marketplace
```

After marketplace installation, invoke `/kinesis-design-studio:kinesis-design-studio`. A direct folder installation uses `/kinesis-design-studio`.

Local installer alternative for both clients:

```text
git clone https://github.com/Skryd1X/kinesis-design-studio.git
cd kinesis-design-studio
python scripts/install.py --agent both --user
```

## Optional browser tooling

From this repository root, use an existing reviewed Playwright installation or provision the pinned local dependency:

```text
npm ci
npx playwright install chromium
node skills/kinesis-design-studio/scripts/profiles.cjs --tier full --breakpoints 640,768,1024 --output profiles.json
node skills/kinesis-design-studio/scripts/audit-ui.cjs --config /absolute/path/to/qa-config.json
```

Copy and adapt skills/kinesis-design-studio/assets/qa-config.example.json. Add real route/state selectors, allowed origins, primary controls and motion contracts. For Firefox/WebKit, provision those browsers and request them explicitly. Never use a screenshot-only check as motion acceptance.

## Validation

```text
python scripts/validate_package.py
python -m unittest discover -s tests -p "test_*.py" -v
npm test
npm run test:browser
```

See VALIDATION.md for actual executed checks, detected/repaired fixture defects and limitations. Source snapshots are knowledge references, not permission to run upstream installation scripts or silently grant capabilities.

## Licenses and attribution

Original work: MIT, Copyright (c) 2026 Skryd1X. Bundled references keep their original MIT/Apache-2.0 or per-file terms. See THIRD_PARTY_NOTICES.md and the skill's sources.lock.json. Do not remove upstream authorship or describe this compilation as entirely invented by its creator. Source projects do not endorse Kinesis.
