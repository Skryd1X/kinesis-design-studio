# Responsive and screen coverage

Layout responds to the CSS viewport and available space, not a device marketing name or raw physical resolution. The package bundles 207 Playwright descriptors from the verified runtime snapshot plus generic viewports and generated intermediate widths. This is a maintained representative catalog, not an inventory of every device ever made.

Run representative devices routinely and exhaustive catalog/breakpoint sweeps for the final broad pass when resources permit. Include phone portrait/landscape, tablet, small laptop, desktop, ultrawide, high-DPI and short-height windows. Add foldable inner/outer-like widths and resize transitions; real hinges/segments require device or platform emulation beyond an ordinary viewport.

Extract actual project breakpoints. Test each at width-1, width, width+1 and sweep intermediate widths. Include 320 CSS px reflow and narrow stress sizes. Verify true browser zoom at 200% and reflow conditions up to 400% on representative desktop widths; viewport reduction alone is not true zoom. Test large native text settings with platform tools. CSS text-size stress is a useful probe, not OS text scaling evidence.

Alignment is contractual: centered hero, left-aligned body, aligned baselines, matched container gutters, evenly distributed actions or intentional asymmetry. Do not recenter everything. Define parent-relative center/edge tolerances and compare at each layout variant. Mobile art direction may rearrange hierarchy while preserving tasks and content.

Check all routes and important states. Open menus/dialogs, populate long text, show validation and asynchronous errors, scroll through the entire page, and verify sticky/fixed controls at start/middle/end. A primary action may be below the fold if intentionally reachable; essential navigation and overlay actions must not be stranded outside the visible region.

Test safe-area CSS, dynamic viewport units, URL-bar changes, keyboard opening and landscape short height on real target devices when required. Check touch inputs and hover:none behavior. Keep focus and pointer hit targets within the currently intended layer; overlays must not cover them unexpectedly. Include RTL and long translations when the product supports them.

Responsive acceptance needs screenshots, geometry/hit-test evidence and ordinary functional paths. A browser descriptor does not emulate actual GPU, CPU, browser UI, keyboard or thermal behavior. Report the exact profiles and unavailable physical-device checks.
