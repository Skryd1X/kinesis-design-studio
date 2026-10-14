# Application platforms

Web/desktop browsers: support mouse, touch, keyboard, theme and motion preferences, reflow/zoom, responsive navigation and complete interaction states. Verify actual browser engines and embedding environment.

Native iOS/Android: apply platform typography, navigation, touch targets, safe areas/insets, keyboard avoidance, dynamic text, accessibility focus and reduced-motion conventions. Use actual simulator/device evidence; browser viewport testing does not validate native components. Impeccable's platform references are a supporting source, not a substitute for current Apple/Material documentation.

Electron/Tauri/desktop shells: account for resizing, short-height windows, OS titlebar regions, keyboard accelerators, platform font/render differences, scaling and multiple displays. Test both minimum supported size and intended desktop sizes.

Foldables/dual-screen: verify resizing/continuity and layout changes using supported tools; plain viewport profiles approximate available widths but cannot prove hinge segmentation or hardware behavior. TV/kiosk/watch/AR should be explicitly scoped and tested using their actual focus/input/spatial conventions.
