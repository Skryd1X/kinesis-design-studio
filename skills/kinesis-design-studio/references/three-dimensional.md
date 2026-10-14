# 3D, WebGL and asset workflows

Decide whether 3D serves the product. Use an interactive subject, meaningful camera story, material/light quality and coherent integration with typography and UI. Do not place a generic spinning primitive behind every hero. Preserve useful content and controls if WebGL is unavailable or slow.

Set budgets for geometry, texture memory, downloads, draw calls, lights/shadows, postprocessing and pixel ratio based on target device classes. Use GLTF/GLB pipelines, instancing/LOD and compressed assets when supported. Establish color-management and exposure expectations, readable silhouettes and camera framing across aspect ratios. Dispose renderer resources on unmount and pause offscreen/background rendering.

Animation needs time-based updates, stable delta handling after tab suspension, correct interpolation and one render-loop owner. Bound DPR on constrained hardware; measure quality/performance tiers and context loss/recovery. Test touch/camera controls without stealing normal page scrolling, unless a dedicated interaction is explicitly designed.

For Blender, preserve the user's scene and work in a separate file/collection when possible. Do not reset a live scene automatically because an upstream recipe recommends it. Build through reproducible stages: reference/calibration, silhouette/blockout, materials, lighting, topology/UV where needed, rig/animation, export and reimport. Validate actual renders against reference camera and intended display size. Save source scene plus GLB/other requested exports and record inferred dimensions.

Use the extracted Blender and MengTo reference material on demand. CloudAI-X was inspected, but its files are reference-only because redistribution permission was not established. Consult [official Three.js documentation](https://threejs.org/docs/) for API compatibility. If Blender/MCP/GPU tools are unavailable, implement available UI work and retain the asset/render branch as blocked; do not invent a delivered model.
