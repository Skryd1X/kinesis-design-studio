# Quality ledger and release gate

Use quality-gate.py with a JSON ledger recording revision, scope, evidence layers, passes, checks and defects. This helper checks declared consistency; it does not open the evidence or establish its truth.

Required check categories: layout, style, interaction, accessibility, motion, performance and visual. Every check has id, category, status (passed/failed/blocked/not-applicable), evidence references, and profile/state context. Not-applicable requires a reason; it is invalid for layout/style/interaction/accessibility/visual on a working UI deliverable. No failed/blocked required check passes closure. Motion/performance exclusions must be justified by the actual deliverable, never by removing tests after failure.

Each defect has id, severity (blocking/major/minor), status (open/fixed-unverified/verified/residual), evidence and description. Verified defects need validation. Minor residuals need reason and owner. Blocking/major residuals fail the quality gate. At least two passes (initial review and post-build/repair verification) need method and evidence. Do not claim an independent review merely by rerunning the same command.

The agent must inspect evidence separately and report measured environment, screen/state coverage, unsupported checks and real-device boundaries. A declared gate pass is not a universal no-bugs guarantee, accessibility certificate, or proof of smooth motion on every physical device. Exit code 0: declared acceptance; 1: incomplete; 2: malformed ledger.
