# Executable tools

The skill ships its own small tools. Python helpers require Python 3.10+, standard library only. Browser QA needs Node 20+ and Playwright. Use an existing approved installation or install the pinned repository dependency with npm ci, then provision the required browsers. This does not require a model API key. Do not silently install tooling inside the user's application or change its lockfile.

Run paths relative to this skill directory:

```text
python scripts/search-library.py "quiet luxury" --limit 8
node scripts/profiles.cjs --tier full --breakpoints 640,768,1024 --output profiles.json
node scripts/audit-ui.cjs --config /absolute/path/to/qa-config.json
python scripts/quality-gate.py /absolute/path/to/quality-ledger.json
```

See assets/qa-config.example.json for the contract shape. Use full device descriptors from the installed Playwright version when available; the bundled 207-descriptor snapshot supports offline planning and reproducibility. refresh-device-catalog.cjs regenerates it from the installed version; record changed version/date rather than assuming every new device is included.

The example p95 frame interval budget is a starting point for a 60 Hz browser test, not a universal product threshold. Calibrate real-device budgets and input-response checks for the actual refresh rate and target hardware. Helper fixture thresholds deliberately detect injected defects and do not establish a production performance budget.

The runner accepts explicitly permitted origins and only executes actions listed in the configuration. Remote application testing needs an explicitly authorized target and synthetic state. Screenshots/video can contain private content; keep evidence local and do not commit it automatically. Fresh output directories prevent mixing old evidence with a new run.

Audit annotations: data-design-critical marks primary controls; data-design-decoration marks decorative layers that must not intercept input; data-design-motion marks subjects to sample. Add explicit contracts for alignment, CSS values, content visibility, state actions and motion bounds. No annotation can replace product-specific expected behavior.

The automated probe cannot verify every aesthetic decision, physical device, WebGL scene, native component, true zoom, assistive technology or every CSS occlusion. Supplement it with screenshot/video review, accessibility checks and appropriate platform tests. Never report missing dependency/browser support as a passed check.
