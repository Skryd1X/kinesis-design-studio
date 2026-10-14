# Motion craft and engineering

## Define the motion before implementing it

Specify the purpose of each animation: feedback, orientation, continuity, attention, spatial storytelling or brand expression. Define subject, trigger, start/end states, duration, easing/spring, stagger, interruption/reversal, geometry invariants and reduced-motion equivalent. A primary action should stay responsive during the sequence. Strong art direction does not require constant movement.

Use anticipation and follow-through where they improve comprehension. Coordinate primary movement and supporting reaction; add ambient movement only when the narrative and budget justify it. A mechanical delay on every element is not choreography. High-frequency task UI needs restraint; cinematic marketing surfaces can sustain more expressive sequences.

Start with role-specific timing ranges, then validate perception: immediate press/hover acknowledgement roughly 80-180 ms; common state transitions 150-350 ms; larger spatial transitions 300-600 ms; cinematic reveals may run longer while input remains usable. These are project starting points, not universal pass/fail criteria. Avoid motion that makes repeated work feel slow.

## Technical ownership

Assign one system per transform/opacity/layout property. Do not let CSS hover, GSAP, React layout animation and pointer-follow scripts overwrite the same transform. Compose through wrapper layers or explicit transform ownership. Reuse timelines/quick setters, scope selectors, clean up listeners, observers, RAF and animation contexts on unmount. Test repeated mounting and breakpoint changes for duplication.

Prefer compositor-friendly transforms and opacity where suitable. Some size/layout changes are legitimate; implement and measure them instead of universally banning them. Blur, filters, masks and large composited layers can be expensive; profile on the target. Use will-change selectively and remove it after transient work. Batch geometry reads/writes and avoid per-frame DOM creation.

GSAP: use contextual lifecycle cleanup, matchMedia for breakpoint and reduced-motion changes, refresh scroll geometry after font/image layout settles, and verify pin spacing and disposal. Scroll state should preserve user control; native scrolling is the default. Use Motion/WAAPI/CSS for appropriate component lifecycles; do not introduce a second engine for a trivial effect.

## Mandatory failure cases

Test interruption halfway through, reversal, rapid repeated clicks, resize/orientation during animation, route-away/remount, slow assets, background-tab return and reduced motion. Verify endpoints, cancellation and state consistency. Loading indicators must not flash on fast actions or trap a failed operation. Exit animations must not leave an invisible hit-testable layer.

Check a moving subject at start, midpoint and end, then in playback: no unintended teleportation, velocity spikes, oscillation at rest, duplicated timelines, flicker, scroll discontinuity, clipping, pointer-trail lag or displaced click target. An intentional jump/cut must be declared as such, not hidden in a generic exception.

## Performance evidence

Declare target refresh/device class and budgets. 60 Hz provides about 16.7 ms between frames, 120 Hz about 8.3 ms; RAF timing on a headless machine is not physical display verification. Collect frame-interval distribution and long-task evidence, record warm/cold load separately, test interaction during motion, and inspect a recording. Browser LoAF availability varies; report unsupported observers explicitly.

Reduce draw calls, overdraw, pixel ratio, texture/geometry budgets or shader complexity before sacrificing useful interaction. Provide quality tiers and static/reduced-motion fallback. Compare baseline and final runs in the same environment; expensive animations must not prevent navigation, focus, reading or action.
