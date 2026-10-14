# UI implementation and CSS isolation

Preserve the existing stack and component API. Use semantic HTML/native controls, explicit labels, keyboard operation, focus states, error messaging and deterministic state transitions. Centralize tokens and component variants; avoid separate raw values for the same semantic role.

Document CSS layer order (reset/base/theme/components/utilities/overrides as appropriate). Scope decorative effects to their component, separate styling ownership from layout ownership, and inspect actual computed styles when selectors conflict. Prefer a predictable cascade over escalating !important specificity. Third-party resets, themes, icon CSS, nested selectors and media rules can override primary controls.

For important controls define contract assertions for display, visibility, color/background, typography, padding/min-size and expected position. Assert tokens only when stable and intentional; compare normalized computed values rather than source spelling. Check normal/hover/focus/active/disabled/loading states in every relevant theme. The page may look correct while the click target is covered or displaced.

Layer backgrounds and canvases separately from content. Decorative layers should usually have pointer-events:none and be hidden from assistive technology. Only real interactive canvases receive pointer input, with keyboard/touch alternatives. Inspect stacking contexts introduced by transforms, filters, opacity, isolation and positioned ancestors. A large z-index cannot escape the wrong context.

Never solve real layout defects with blanket overflow:hidden on html/body or with global scale reductions. Intentional clipped decoration can be excluded locally; required text, navigation and actions must remain reachable. Add meaningful exclusions with a reason to the QA contract, not broad selector suppressions.

Reserve image/video dimensions, load fonts predictably, preserve text reflow, handle long translations and dynamic validation, and avoid hydration-dependent content disappearance. Test route changes and third-party widgets against your CSS contract. Validate the actual product flow after visual changes.
