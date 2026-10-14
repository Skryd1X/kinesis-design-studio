# Validation evidence

These are synthetic fixture results, not an audit of a user application or an independent model-quality benchmark.

- injected-defects.json: deliberately inserted occlusion, CSS override, alignment drift, animation discontinuity and main-thread stall were detected.
- narrow-defect.json: a deliberately oversized layout was detected at 320 CSS px.
- motion-42-runs.json: 14 screen/breakpoint profiles x 3 preference variants, with two states per run, passed the repaired fixture contracts.
- screen-matrix-300-runs.json: all 300 generated Chromium-emulated profiles passed layout/hit/style probes. This run does not measure motion on all 300 profiles.
- cross-browser-motion.json: Firefox/WebKit phone and desktop motion checks passed (4 runs).
- cross-browser-keyboard.json: separate Firefox/WebKit keyboard activation and motion checks passed (4 runs).
- motion-lab.webm and motion-samples.json: real recorded synthetic fixture motion and sampling data.
- motion-contact-sheet.png: sampled recorded-video frames; this is not a substitute for full-speed physical-device playback.
- desktop.png, mobile.png and desktop-dark.png: rendered fixture views, not proof that the agent creates award-winning designs.

The fixture is reproducible with tests/browser-regression.cjs. Reports retain the original local temporary evidence-directory names; selected screenshots/recordings are copied alongside this README. Full raw captures remain in the local work directory and are not bundled.
