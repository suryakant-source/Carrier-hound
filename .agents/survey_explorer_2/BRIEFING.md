# BRIEFING — 2026-09-15T11:19:00Z

## Mission
Map out and design the complete technical specification for the "Floating Lanterns & Golden Embers" Three.js (WebGL) visual atmosphere.

## 🔒 My Identity
- Archetype: explorer
- Roles: WebGL, Three.js, shaders, particle systems, interactive rendering performance specialist
- Working directory: c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/survey_explorer_2
- Original parent: 58e197d8-eec0-4690-bb61-26a3dc4373a8
- Milestone: Visual Atmosphere & Three.js Architecture Specification

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Scope limited to survey and architecture design for "Floating Lanterns & Golden Embers" WebGL atmosphere
- Maintain zero per-frame allocations, 60fps budget, robust WebGL context handling, and pure CSS fallback

## Current Parent
- Conversation ID: 58e197d8-eec0-4690-bb61-26a3dc4373a8
- Updated: 2026-09-15T11:19:00Z

## Investigation State
- **Explored paths**:
  - `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/ORIGINAL_REQUEST.md` (R1, R2, R4 & Verification requirements)
  - `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/orchestrator/plan.md`
  - WebGL performance models, GLSL shader architecture, harmonic oscillator sway dynamics, CSS fallback
- **Key findings**:
  - Embers particle system: 1,400 desktop / 600 mobile `THREE.Points` simulated 100% on GPU vertex shader (0 CPU buffer writes, exactly 1 draw call).
  - Lanterns: 26 instances using `THREE.InstancedMesh` with octagonal low-poly faceted cylinders (80 triangles/lantern) and subsurface paper translucency shader with internal candle distance calculation (2 draw calls total).
  - Total scene draw calls: exactly 3. Triangles: ~3,500.
  - Interactive camera: exponential smoothing (`decay = 3.5`), elevation with letter scroll progression (`scrollProgress * 11.0`).
  - DPR capping: `Math.min(window.devicePixelRatio, 2.0)`.
  - Zero heap allocations in render loop (pre-allocated scratch vectors/matrices).
  - WebGL context loss handling and pure GPU-composited CSS keyframe fallback.
- **Unexplored areas**: None within survey scope. Ready for handoff.

## Key Decisions Made
- Chose in-shader analytic glow over multi-pass post-processing (`EffectComposer`) to preserve 60fps on mobile.
- Formulated single-draw-call GPU vertex shader cyclic wrap and divergence-free curl turbulence for embers.
- Designed pure CSS keyframe fallback with radial gradients and floating ember elements.

## Artifact Index
- `DISPATCH.md` — Incoming task prompt log
- `progress.md` — Liveness heartbeat and milestone tracker
- `handoff.md` — Complete 5-component technical specification report
