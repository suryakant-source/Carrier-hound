# Original User Request

## 2026-09-15T11:05:13Z

Build a single-page, top-tier, emotionally powerful and mature apology/reconciliation website dedicated to Sadhna. The visual theme is "Floating Lanterns & Golden Embers" rendered in Three.js (WebGL) with warm, rising embers and soft depth of field, paired with elegant typography, a sincere and vulnerable personal letter, a memory card photo gallery, and a pre-filled WhatsApp/SMS reconciliation button. Frontend ONLY — no backend, no database, no forms.

Working directory: c:/Users/ASUS/Documents/antigravity/clever-galileo/sadhna-apology
Integrity mode: development

## Requirements

### R1. Emotional Architecture & Letter Flow
A handcrafted, narrative-driven experience dedicated specifically to Sadhna:
- Opening: Address Sadhna directly with a quiet, honest, and personal opening line that establishes deep sincerity.
- Specific Accountability: Acknowledge mistakes candidly and distinctly (e.g., reacting defensively during friction, failing to listen with patience, letting ego cloud communication, taking moments for granted) without making excuses or shifting blame.
- Perspective Shift & Growth: Articulate genuine personal realizations during the time apart — learning emotional restraint, valuing her presence, and understanding what real consistency and care require.
- Gracious Closing: Unconditionally respect her autonomy, making it crystal clear that the decision, pace, and boundaries are 100% hers, with zero guilt-tripping, drama, or pressure.

### R2. "Floating Lanterns & Golden Embers" Three.js (WebGL) Atmosphere
An ambient, bespoke 3D WebGL background:
- Interactive particle and lighting system simulating golden embers and lanterns gently rising into an atmospheric twilight sky.
- Responsive camera drift and particle reaction to mouse movement, scroll position, and touch dragging.
- Optimized 60fps render loop with efficient geometry and shader/material pooling.
- Mobile-first responsiveness and a graceful visual fallback (CSS ambient gradients/vignette) if WebGL is disabled or unsupported.
- Subtle, optional ambient audio player with tasteful controls (mute/unmute toggle) respecting browser autoplay policies.

### R3. Memory Moments & Direct Response Action
- A curated memory gallery/cards section for 3–5 meaningful photos or moments, styled with warmth, soft shadows, and respectful restraint.
- A "Reach out when you're ready" action button that opens WhatsApp or SMS with a thoughtful, low-pressure pre-filled message (e.g. `https://wa.me/?text=...`), with no backend storage, form endpoints, or data logging.

### R4. Static Frontend Architecture & Clean Code
- 100% client-side HTML5, CSS3, ES6+ JavaScript, and Three.js (via CDN or bundled local script).
- Zero external build tool lock-in (or self-contained static build) deployable directly to static hosts like Vercel, Netlify, or GitHub Pages.
- Clean directory layout and well-commented, readable code.

## Verification Mechanism

### Programmatic Automated Check
A standalone Node.js verification script (or test runner) inside the project directory must verify:
1. WebGL scene initializes without errors and runs a continuous requestAnimationFrame loop.
2. Layout renders cleanly across viewport sizes (mobile 375x667, tablet 768x1024, desktop 1440x900) without horizontal scroll overflow.
3. Audio toggle correctly manages audio context and updates UI mute state.
4. Response action button forms a valid, URL-encoded WhatsApp/SMS link.
5. All placeholder tokens (`[FILL]`, `TODO`, `Lorem ipsum`) are eliminated in favor of genuine, mature copy.
6. Zero unhandled JavaScript console errors or syntax exceptions.

## Acceptance Criteria

### Visual & Interactive Polish
- [ ] Three.js scene maintains steady 60fps on modern desktop and mobile browsers.
- [ ] Embody the "Floating Lanterns & Golden Embers" aesthetic with deep twilight tones, warm amber glow, and delicate depth.
- [ ] Fluid responsive layout with zero horizontal overflow across 360px to 1920px viewports.

### Emotional Tone & Sincerity
- [ ] Dedication explicitly addresses Sadhna with mature, vulnerable, and respectful language.
- [ ] Mistakes are owned with radical accountability; zero deflection or guilt-tripping.
- [ ] The conclusion honors her complete autonomy and asks for nothing with pressure.

### Verification & Delivery
- [ ] Verification script executes and exits with exit code 0.
- [ ] Code is organized, linted, and ready for deployment.
