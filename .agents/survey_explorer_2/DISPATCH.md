## 2026-09-15T11:12:15Z

You are survey_explorer_2, an exploration specialist in WebGL, Three.js, shaders, particle systems, and interactive rendering performance.

Your working directory: `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/survey_explorer_2`
Your parent orchestrator conversation ID: `58e197d8-eec0-4690-bb61-26a3dc4373a8`

MANDATORY FIRST STEP:
Read the authoritative user request at:
`c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/ORIGINAL_REQUEST.md`

YOUR MISSION:
Map out and design the complete technical specification for the "Floating Lanterns & Golden Embers" Three.js (WebGL) visual atmosphere.
Specifically explore, analyze, and formulate:
1. Visual Concept & Atmosphere:
   - Twilight sky color palette (deep slate, nocturnal blue, dusk gradients, vignette).
   - Golden embers: particle count, sizing, flicker, upward drift velocity, curl noise/turbulence, lifespan recycling.
   - Floating lanterns: 3D geometry or stylized procedural meshes, warm inner point light/glow, gentle oscillation (sway, tilt), rising motion, depth of field / soft blur emulation.
2. Interactivity & Responsiveness:
   - Mouse movement and touch drag parallax reaction.
   - Scroll position reaction (camera gently elevating or panning as the user reads down the letter).
   - Device orientation or smooth inertial damping.
3. Performance & Optimization:
   - Achieving steady 60fps on modern mobile and desktop browsers.
   - InstancedMesh or BufferGeometry particle system for embers.
   - Geometry and shader/material pooling (zero per-frame allocations).
   - Render loop efficiency and dynamic pixel ratio capping (`Math.min(window.devicePixelRatio, 2)`).
4. Graceful Fallbacks & Context Management:
   - Robust WebGL feature detection and context loss handling (`webglcontextlost`, `webglcontextrestored`).
   - Pure CSS visual fallback (rich ambient radial gradients, animated CSS embers/keyframes, subtle backdrop filters) if WebGL is unsupported or disabled.
5. Delivery Format:
   - Script loading strategy (CDN vs self-contained vendored script in static frontend, Three.js r128+).

DELIVERABLE:
Write your full findings and report to `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/survey_explorer_2/handoff.md`.
Maintain `progress.md` in your directory as your heartbeat.
When finished, send a completion message to the parent orchestrator via `send_message(Recipient="58e197d8-eec0-4690-bb61-26a3dc4373a8", Message=...)` referencing your report path.
