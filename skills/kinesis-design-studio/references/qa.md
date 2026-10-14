# Internal design and motion QA

## Evidence plan

Specify revision, routes/states, screen profiles, browser engines, themes, motion preferences, content stress and performance device class. Build small scenario actions with stable selectors and expected outcomes. Prepare synthetic data; avoid live purchases/messages or other irreversible actions during testing.

Mandatory layers: semantic/keyboard checks; responsive geometry; cascade/style contracts; pointer/focus reachability; motion sampling and playback; performance telemetry; visual craft review; normal product functions. No one layer substitutes for another.

## Automated probes

Use audit-ui.cjs for deterministic contract checks, unexpected horizontal overflow, bounding-box clipping, hit testing, required content reachability, parent-relative alignment, style expectations, scenario actions, console/page errors, screenshots and RAF/observer telemetry. Use data-design-critical for explicit primary actions, data-design-decoration for effects, and data-design-motion for motion subjects where adding test annotations is appropriate. Annotations assist testing and must not change the user-facing design.

The hit probe samples several points, not every pixel; tiny or complex occlusions may need manual inspection. DOM bounding rectangles are not a renderer's visible-pixel mask. Shadow DOM, canvas, native UI and cross-origin frames need targeted adapters. Automated overflow discovery is a candidate list; classify intentional scroll regions rather than suppressing the whole page.

Use CSS-property contracts to identify secondary overrides. Include hover/focus/loading variants. Pseudo-elements and transforms can hide the apparent versus actual target; inspect recorded interactions. A working center-point click does not establish adequate touch area or keyboard usability.

## Motion and performance review

Capture video and start/mid/end frames with motion enabled. Define specific direction, endpoint and continuity contracts for animated subjects. Measure observable values, long tasks, LoAF where supported, layout shift and frame intervals. Distinguish idle stability from active animation. For WebGL, gather renderer/GPU diagnostics and inspect animation playback with actual target hardware. Headless RAF can detect a deliberate main-thread stall but cannot certify GPU smoothness.

Test reduced motion separately; essential content and actions must remain available. Validate interruption/reversal/repeated inputs, exit cleanup, scroll responsiveness and no invisible input interception. For native applications run equivalent layout/interaction checks using platform tooling.

## Visual critique

Inspect screenshots at native scale: composition, focal point, typography, baseline rhythm, crop quality, palette, surfaces, component states, consistency and originality relative to the chosen brief. Review the whole flow and page, not just the hero. Inspect motion in playback for pacing and perceived jank. An agent that cannot view screenshots/video must report that layer blocked.

## Repair loop

Record reproducible defects, severity, affected profiles/state, evidence, root cause and regression. Fix batches, rerun affected checks, then repeat the broad final pass. Keep rejected/failed runs. Resolve blocking/major defects before claiming acceptance. Document minor residuals with owner/next action. Stop a branch only at an explicit access/resource boundary or when repeated attempts produce no meaningful new evidence; do not silently relabel failures as success.
