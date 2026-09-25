# Technical Specification & Survey Report: "Floating Lanterns & Golden Embers" WebGL Atmosphere

**Author**: `survey_explorer_2` (WebGL, Three.js, Shader & Interactive Rendering Specialist)  
**Date**: 2026-09-15  
**Target Path**: `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/survey_explorer_2/handoff.md`  
**Parent Orchestrator**: `58e197d8-eec0-4690-bb61-26a3dc4373a8`  

---

## 1. Observation

Direct observations from the project workspace, authoritative specifications, and environment inspection:

1. **Authoritative Project Mandate**:
   - In `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/ORIGINAL_REQUEST.md`:
     - Lines 5-8: *"Build a single-page, top-tier, emotionally powerful and mature apology/reconciliation website dedicated to Sadhna. The visual theme is 'Floating Lanterns & Golden Embers' rendered in Three.js (WebGL) with warm, rising embers and soft depth of field... Working directory: c:/Users/ASUS/Documents/antigravity/clever-galileo/sadhna-apology. Integrity mode: development."*
     - Lines 19-25 (Requirement R2): *"Interactive particle and lighting system simulating golden embers and lanterns gently rising into an atmospheric twilight sky. Responsive camera drift and particle reaction to mouse movement, scroll position, and touch dragging. Optimized 60fps render loop with efficient geometry and shader/material pooling. Mobile-first responsiveness and a graceful visual fallback (CSS ambient gradients/vignette) if WebGL is disabled or unsupported."*
     - Lines 31-34 (Requirement R4): *"100% client-side HTML5, CSS3, ES6+ JavaScript, and Three.js (via CDN or bundled local script). Zero external build tool lock-in (or self-contained static build) deployable directly to static hosts like Vercel, Netlify, or GitHub Pages."*
     - Lines 39-46 (Verification Mechanism): Automated headless/browser checks requiring WebGL scene initialization without errors, requestAnimationFrame loop running, clean layout across 375px to 1440px viewports without horizontal scroll overflow, and zero unhandled console errors.
     - Lines 50-52: *"Three.js scene maintains steady 60fps on modern desktop and mobile browsers. Embody the 'Floating Lanterns & Golden Embers' aesthetic with deep twilight tones, warm amber glow, and delicate depth."*

2. **Orchestrator Strategic Plan**:
   - In `c:/Users/ASUS/Documents/antigravity/clever-galileo/.agents/orchestrator/plan.md`:
     - Lines 9-10: Assigned *Explorer 2: Three.js Visual Atmosphere, Shader/Particle Design, Camera Drift & CSS Fallbacks (R2)*.
     - Line 17: Scheduled for *Milestone 2: Three.js "Floating Lanterns & Golden Embers" Engine + WebGL Fallback + Audio Toggle*.

3. **Runtime & Hardware Constraints**:
   - Target devices range from high-density mobile screens (iPhone, Android with `devicePixelRatio = 3.0+`) to desktop workstations.
   - Node.js runtime is installed at `C:\Users\ASUS\AppData\Roaming\npm\node.exe` for programmatic verification.
   - The final artifact must be self-contained in `c:/Users/ASUS/Documents/antigravity/clever-galileo/sadhna-apology` and operate without complex Node build server requirements.

---

## 2. Logic Chain

From the observed requirements and constraints, the technical design unfolds in a strict, deductive chain of reasoning:

### Step 2.1: Emotional Atmosphere & Colorimetry
- *Premise (from R1 & R2)*: The site is an intimate, heartfelt dedication to Sadhna. The visual environment must set a reverent, tranquil, contemplative mood. Excessive motion, harsh flash, or chaotic particle explosions would undermine emotional authenticity.
- *Deduction*:
  1. The background must feature a dark, nocturnal twilight sky gradient (`#060913` at zenith descending to `#181b34` and `#2b1b2f` at horizon) that keeps the letter text perfectly legible (high contrast against warm ivory copy `#fdfbf7`).
  2. The horizon must exhibit a soft, warm amber glow (`#ffaa33` with 15–20% opacity) suggesting distant rising lanterns beyond the horizon.
  3. A subtle vignette must darken the viewport periphery (`0.35` to `0.45` falloff) to naturally frame the central letter card.

### Step 2.2: Golden Embers Particle Architecture (Single-Draw-Call GPU Simulation)
- *Premise (from R2)*: 60fps performance on mobile and desktop requires avoiding CPU-bound loops and CPU-to-GPU buffer uploads.
- *Deduction*:
  1. If particle positions are updated via CPU `Float32Array` every frame, 1,500 particles require mutating 4,500 floats and calling `attributes.position.needsUpdate = true`, consuming valuable main-thread CPU cycles and bus bandwidth.
  2. Therefore, the ember system must use `THREE.Points` with a custom `THREE.ShaderMaterial` where **particle motion is 100% computed on the GPU vertex shader**.
  3. The vertex shader takes `uniform float uTime` and offsets `currentY = mod(initialY + uTime * aSpeed, heightRange) + yMin`. Horizontal turbulence is evaluated via divergence-free harmonic trigonometric functions (`sin`/`cos` curl approximations).
  4. Fragment shader calculates an analytic exponential radial glow (`exp(-dist * 6.0)`) with an intense white-gold core (`#fff8e1`), an amber body (`#ffb300`), and a burnt-gold halo (`#ff6f00`).
  5. The entire ember field of 1,500 particles consumes **exactly 1 draw call** and **0 bytes of CPU-to-GPU memory transfer per frame**.

### Step 2.3: Floating Lanterns (Low-Poly Instanced Mesh & Subsurface Glow)
- *Premise (from R2)*: Lanterns must float gracefully, sway naturally, and emit a warm internal glow, without crushing mobile GPUs with multiple real-time point lights.
- *Deduction*:
  1. Real-time dynamic lights in WebGL: having 20+ `THREE.PointLight` instances causes catastrophic shader compilation and fragment overhead.
  2. Instead, lanterns must be rendered using `THREE.InstancedMesh` (20–30 instances) with a custom translucent `ShaderMaterial`.
  3. The lantern geometry is an 8-sided faceted tapered cylinder (`CylinderGeometry(0.7, 0.55, 1.25, 8, 3, true)`) totaling only 80 triangles per lantern, giving a handcrafted paper lantern aesthetic.
  4. The shader computes internal flame illumination analytically using the fragment's model-space distance from the lower candle position `vec3(0.0, -0.3, 0.0)` combined with a Fresnel rim term (`pow(1.0 - abs(dot(vNormal, vViewDir)), 1.5)`).
  5. Motion dynamics are modeled as coupled harmonic oscillators (pendulum sway with distinct pitch and roll frequencies: $\theta_x = A_x \sin(\omega_1 t + \phi_1)$, $\theta_z = A_z \cos(\omega_2 t + \phi_2)$) driven by a pre-allocated matrix update loop taking `< 0.05ms` per frame.
  6. The lantern system consumes **exactly 2 draw calls** (1 for lantern bodies, 1 for bottom collar rings).

### Step 2.4: Interactive Camera, Parallax & Scroll Integration
- *Premise (from R2)*: The camera must react to mouse movement, touch drag, and letter scroll position, maintaining fluid responsiveness without jitter.
- *Deduction*:
  1. Direct assignment of mouse coordinates to camera produces jarring, robotic movements. We must use exponential smoothing (frame-rate independent lerp): $\Delta = (1 - e^{-\lambda \cdot dt})$ where $\lambda \approx 3.5$.
  2. Scroll integration: As Sadhna scrolls through the letter, the camera position steadily elevates along the Y-axis (`camera.position.y = baseCameraY + scrollProgress * 10.0`). The perspective elevates from an intimate grounded view to an expansive sky view as the letter moves toward peaceful closure.
  3. Touch events must be registered with `{ passive: true }` to guarantee unhindered native scrolling performance.

### Step 2.5: Zero-Allocation Render Loop & DPR Clamping
- *Premise (from R2 & Verification Criteria)*: Steady 60fps with zero GC stutter on Retina/OLED mobile screens.
- *Deduction*:
  1. Unrestricted `window.devicePixelRatio` on modern smartphones (often 3.0 to 4.0) multiplies fragment shading by 9x to 16x.
  2. We must strictly enforce: `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));`.
  3. In the render loop, zero objects (`Vector3`, `Matrix4`, `Quaternion`) are instantiated. Pre-allocated module-scoped scratch variables are reused indefinitely.
  4. When the browser tab is inactive (`document.hidden`), the `requestAnimationFrame` loop is suspended to conserve battery and CPU resources.

### Step 2.6: WebGL Context Management & Pure CSS Visual Fallback
- *Premise (from R2)*: Mobile devices frequently lose WebGL contexts during app switching or thermal throttling. In addition, some environments or restrictive browsers disable WebGL.
- *Deduction*:
  1. The engine must feature-detect WebGL support before instantiating Three.js.
  2. The canvas must listen for `webglcontextlost` (calling `event.preventDefault()` to allow restoration) and `webglcontextrestored`.
  3. A dedicated CSS fallback layer (`#atmosphere-fallback`) must be styled with rich multi-stop radial gradients and 20+ hardware-accelerated CSS keyframe floating embers (`transform: translate3d(...)` on GPU compositor layers).
  4. If WebGL fails or context is lost, the fallback layer smoothly cross-fades in, ensuring the emotional beauty of the site is never compromised.

---

## 3. Detailed Technical Architecture Specification

### 3.1 Color Palette & Sky Gradient Specification

```
+-------------------------------------------------------------------------+
| ZENITH: Deepest Nocturnal Slate (#060913 / rgb(6, 9, 19))              |
|                                                                         |
| UPPER ATMOSPHERE: Nocturnal Prussian Blue (#0d1527 / rgb(13, 21, 39))  |
|                                                                         |
| MID HORIZON: Atmospheric Twilight Violet (#181b34 / rgb(24, 27, 52))   |
|                                                                         |
| LOW HORIZON: Warm Amber Luminescence (#2b1b2f bleeding into #4a2c20)   |
+-------------------------------------------------------------------------+
       ^                         ^                         ^
  [Rising Embers]       [Floating Lanterns]       [Soft Fog Exp2]
  #fff8e1 -> #ffb300    Translucent Parchment      0x0a0f1d (density 0.015)
  -> #ff6f00            #ffe8b3 with Warm Flame
```

- **Canvas Placement**:
  ```css
  #webgl-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none; /* Let all mouse/touch events pass to letter text and interactive cards */
  }
  ```

### 3.2 Golden Embers Shader & Particle System

#### Particle Configuration Parameters
| Parameter | Desktop Value | Mobile Value | Unit / Format | Description |
| :--- | :--- | :--- | :--- | :--- |
| `count` | 1,400 | 600 | Integer | Total active ember particles |
| `boundsX` | `[-22.0, 22.0]` | `[-14.0, 14.0]` | World units | Horizontal dispersion volume |
| `boundsY` | `[-14.0, 26.0]` | `[-14.0, 26.0]` | World units | Vertical recycling boundaries |
| `boundsZ` | `[-35.0, 8.0]` | `[-28.0, 6.0]` | World units | Depth distribution |
| `speedRange`| `[0.35, 1.1]` | `[0.35, 1.1]` | Units / sec | Upward drift velocity |
| `sizeRange` | `[2.5, 7.5]` | `[2.0, 6.0]` | Pixels (base) | Base size attenuated by perspective |
| `flickerFreq`| `[1.8, 5.2]` | `[1.8, 5.2]` | Radians / sec | Sine flicker modulation rate |

#### Complete GLSL Vertex Shader (`emberVertexShader`)
```glsl
uniform float uTime;
uniform float uSize;
uniform float uScroll;
uniform vec2 uMouse;

attribute float aSize;
attribute float aSpeed;
attribute vec3 aOffset;
attribute vec2 aFlicker; // x: frequency, y: phase

varying vec2 vFlicker;
varying float vDepth;

void main() {
  vFlicker = aFlicker;
  
  // 1. Vertical cyclic drift with zero CPU updates
  float yMin = -14.0;
  float yMax = 26.0;
  float height = yMax - yMin;
  float currentY = mod(position.y + uTime * aSpeed, height) + yMin;
  
  // 2. Harmonic pseudo-curl turbulence (divergence-free wave approximation)
  float t = uTime * 0.45;
  float waveX = sin(currentY * 0.22 + t + aOffset.x) * cos(position.z * 0.28 + aOffset.y) * 0.9;
  float waveZ = cos(currentY * 0.18 + t * 0.75 + aOffset.z) * sin(position.x * 0.22 + aOffset.x) * 0.8;
  
  // 3. Subtle mouse interactive displacement
  vec2 mouseDisplacement = uMouse * (1.0 - smoothstep(0.0, 30.0, -position.z)) * 1.8;
  
  vec3 transformed = vec3(
    position.x + waveX + mouseDisplacement.x,
    currentY + uScroll * 4.0,
    position.z + waveZ + mouseDisplacement.y * 0.5
  );
  
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // 4. Perspective size attenuation
  vDepth = -mvPosition.z;
  gl_PointSize = aSize * uSize * (160.0 / vDepth);
  gl_PointSize = clamp(gl_PointSize, 1.0, 64.0);
}
```

#### Complete GLSL Fragment Shader (`emberFragmentShader`)
```glsl
precision mediump float;

uniform float uTime;
uniform vec3 uColorCore;  // vec3(1.0, 0.97, 0.88) -> #fff8e1
uniform vec3 uColorHalo;  // vec3(1.0, 0.62, 0.05) -> #ff9e0d
uniform vec3 uColorEdge;  // vec3(0.95, 0.35, 0.02) -> #f25905

varying vec2 vFlicker;
varying float vDepth;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  
  // Exponential radial falloff for intense luminous core
  float coreGlow = exp(-dist * 7.0);
  float auraGlow = smoothstep(0.5, 0.05, dist);
  
  // Organic harmonic flicker
  float flicker = 0.78 + 0.22 * sin(uTime * vFlicker.x + vFlicker.y);
  
  // Atmospheric distance attenuation (emulating depth of field soft fade)
  float depthFade = smoothstep(40.0, 10.0, vDepth);
  
  // Tri-color radial blend: white core -> gold body -> amber edge
  vec3 color = mix(uColorHalo, uColorCore, coreGlow);
  color = mix(uColorEdge, color, auraGlow);
  
  float alpha = auraGlow * flicker * depthFade * 0.85;
  gl_FragColor = vec4(color, alpha);
}
```

### 3.3 Floating Lanterns: Geometry, Translucency & Motion

#### Lantern Procedural Geometry & Instancing
- **Geometry Construction**:
  ```js
  // Octagonal faceted cylinder for handcrafted paper texture
  const lanternBodyGeo = new THREE.CylinderGeometry(0.7, 0.52, 1.25, 8, 3, true);
  
  // Base bamboo/wood collar
  const lanternRingGeo = new THREE.TorusGeometry(0.53, 0.035, 4, 8);
  lanternRingGeo.rotateX(Math.PI / 2);
  lanternRingGeo.translate(0, -0.62, 0);
  
  // Pre-instantiated InstancedMeshes
  const lanternCount = isMobile ? 16 : 26;
  const lanternMesh = new THREE.InstancedMesh(lanternBodyGeo, lanternPaperMaterial, lanternCount);
  const ringMesh = new THREE.InstancedMesh(lanternRingGeo, lanternRingMaterial, lanternCount);
  ```

#### Lantern Subsurface Paper Translucency Shader
```glsl
// Vertex Shader snippet
varying vec3 vNormalWorld;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
  vLocalPos = position;
  vec4 worldPos = instanceMatrix * vec4(position, 1.0);
  vNormalWorld = normalize((instanceMatrix * vec4(normal, 0.0)).xyz);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}

// Fragment Shader snippet
uniform float uTime;
varying vec3 vNormalWorld;
varying vec3 vViewDir;
varying vec3 vLocalPos;

void main() {
  // Distance from internal candle flame (placed at y = -0.35 inside lantern)
  vec3 candlePos = vec3(0.0, -0.35, 0.0);
  float distToFlame = length(vLocalPos - candlePos);
  float flameIntensity = 1.0 / (1.0 + 3.2 * distToFlame * distToFlame);
  
  // Paper rim translucency (Fresnel transmission)
  float rim = 1.0 - max(0.0, dot(vNormalWorld, vViewDir));
  float translucency = mix(flameIntensity, flameIntensity * 1.35, pow(rim, 1.4));
  
  // Warm color ramp: amber gold (#ff941a) to creamy parchment (#ffe599)
  vec3 bottomColor = vec3(1.0, 0.58, 0.1);
  vec3 topColor = vec3(1.0, 0.9, 0.6);
  vec3 paperBase = mix(bottomColor, topColor, smoothstep(-0.6, 0.6, vLocalPos.y));
  
  // Subtle flame breathing
  float flamePulse = 0.94 + 0.06 * sin(uTime * 3.2 + vLocalPos.y * 2.0);
  
  vec3 finalColor = paperBase * translucency * flamePulse * 1.25;
  gl_FragColor = vec4(finalColor, 0.92);
}
```

#### Coupled Harmonic Oscillator Sway Dynamics
In the render loop, update each instance's transformation without GC:
```js
// Reused scratch objects allocated once outside the loop
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _matrix = new THREE.Matrix4();

for (let i = 0; i < lanternCount; i++) {
  const data = lanternData[i];
  
  // 1. Upward float & recycling
  data.y += data.speed * dt;
  if (data.y > 24.0) {
    data.y = -16.0;
    data.x = (Math.random() - 0.5) * 36.0;
    data.z = -8.0 - Math.random() * 32.0;
  }
  
  // 2. Pendulum Sway (Pitch around X, Roll around Z, slow Yaw around Y)
  const time = clockTime + data.phase;
  const pitch = Math.sin(time * 0.85) * 0.055 + Math.cos(time * 0.32) * 0.025;
  const roll = Math.cos(time * 0.72) * 0.055 + Math.sin(time * 0.41) * 0.020;
  data.yaw += dt * 0.04;
  
  // 3. Buoyancy bobbing
  const bob = Math.sin(time * 1.2) * 0.12;
  
  _pos.set(data.x, data.y + bob + scrollElevation, data.z);
  _euler.set(pitch, data.yaw, roll);
  _quat.setFromEuler(_euler);
  _scale.setScalar(data.scale);
  
  _matrix.compose(_pos, _quat, _scale);
  lanternMesh.setMatrixAt(i, _matrix);
  ringMesh.setMatrixAt(i, _matrix);
}
lanternMesh.instanceMatrix.needsUpdate = true;
ringMesh.instanceMatrix.needsUpdate = true;
```

---

### 3.4 Camera Dynamics, Parallax & Scroll Coupling

```
User Action           Mathematical Model                          Visual Effect
---------------------------------------------------------------------------------------------------------
Mouse Move / Touch   current += (target - current) * (1 - e^-3.5dt)  Smooth cinematic parallax drift
Scroll Down Letter   camera.y = base.y + scrollProgress * 11.0     Camera elevates from ground to twilight
Scroll Velocity      driftSpeed *= (1.0 + |vScroll| * 1.2)         Embers & lanterns gently lift with words
Orientation (Mobile) gamma/beta clamped to [-25deg, 25deg]         Natural physical gyroscopic depth
```

- **Scroll Tracking Implementation**:
  ```js
  let scrollProgress = 0;
  let targetScrollY = 0;
  let smoothScrollY = 0;
  
  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollY = scrollMax > 0 ? (window.pageYOffset || document.documentElement.scrollTop) / scrollMax : 0;
  }, { passive: true });
  ```

---

### 3.5 Performance Architecture (Rock-Solid 60fps)

1. **Draw Call Budget**:
   - Background Embers (`THREE.Points`): **1 draw call**.
   - Lantern Bodies (`THREE.InstancedMesh`): **1 draw call**.
   - Lantern Collars (`THREE.InstancedMesh`): **1 draw call**.
   - **Total Scene Draw Calls**: **3**. (Budget limit: 15. Utilization: 20%).

2. **Vertex & Geometry Allocation**:
   - Embers: 1,400 vertices (point primitives).
   - Lanterns: 26 instances * 80 triangles = 2,080 triangles.
   - Total scene triangles: ~3,500 triangles.
   - Fits effortlessly within mobile vertex cache and low-power GPU rasterizers.

3. **Pixel Ratio & Viewport Optimization**:
   ```js
   const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
   renderer.setPixelRatio(dpr);
   renderer.setSize(window.innerWidth, window.innerHeight);
   ```

4. **Zero Per-Frame Heap Allocation**:
   - Strict audit rule: No `new` keywords in `requestAnimationFrame` loop.
   - All vectors, matrices, and quaternions instantiated once at initialization.

5. **Tab Inactivity Throttling**:
   ```js
   document.addEventListener('visibilitychange', () => {
     if (document.hidden) {
       isRendering = false;
       cancelAnimationFrame(animFrameId);
     } else {
       lastTime = performance.now();
       isRendering = true;
       animFrameId = requestAnimationFrame(renderLoop);
     }
   });
   ```

---

### 3.6 WebGL Context Management & Pure CSS Fallback

#### WebGL Feature Detection & Context Lifecycle Hooks
```js
function initAtmosphere(container) {
  if (!isWebGLSupported()) {
    activateCSSFallback(container);
    return;
  }
  
  const canvas = document.createElement('canvas');
  canvas.id = 'webgl-canvas';
  container.appendChild(canvas);
  
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault(); // Informs driver to attempt recovery
    cancelAnimationFrame(animFrameId);
    activateCSSFallback(container, true);
  }, false);
  
  canvas.addEventListener('webglcontextrestored', () => {
    deactivateCSSFallback(container);
    reinitializeThreeScene();
  }, false);
  
  // Proceed with Three.js initialization...
}
```

#### Pure CSS Visual Fallback
If WebGL is unavailable or disabled, the application seamlessly activates this zero-JS GPU-composited CSS fallback:

```html
<div id="atmosphere-fallback" class="atmosphere-fallback" aria-hidden="true">
  <div class="sky-gradient"></div>
  <div class="horizon-glow"></div>
  <!-- 20 lightweight CSS animated ember spans -->
  <span class="css-ember" style="--x: 12vw; --dur: 11s; --delay: -2s; --size: 4px; --drift: 25px;"></span>
  <span class="css-ember" style="--x: 28vw; --dur: 15s; --delay: -7s; --size: 6px; --drift: -30px;"></span>
  <span class="css-ember" style="--x: 45vw; --dur: 13s; --delay: -4s; --size: 3px; --drift: 15px;"></span>
  <span class="css-ember" style="--x: 62vw; --dur: 18s; --delay: -11s; --size: 5px; --drift: -20px;"></span>
  <span class="css-ember" style="--x: 78vw; --dur: 14s; --delay: -5s; --size: 4px; --drift: 35px;"></span>
  <span class="css-ember" style="--x: 91vw; --dur: 16s; --delay: -9s; --size: 3px; --drift: -15px;"></span>
  <!-- Stylized CSS Lantern Silhouettes -->
  <div class="css-lantern" style="--left: 18vw; --bottom: 25vh; --scale: 0.8; --dur: 7s;"></div>
  <div class="css-lantern" style="--left: 75vw; --bottom: 40vh; --scale: 0.6; --dur: 9s;"></div>
</div>
```

```css
.atmosphere-fallback {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #191b35 0%, #0d1224 45%, #060913 100%);
}

.horizon-glow {
  position: absolute;
  bottom: -15vh;
  left: 15%;
  width: 70%;
  height: 50vh;
  background: radial-gradient(ellipse, rgba(255, 170, 51, 0.22) 0%, rgba(255, 120, 0, 0.05) 55%, transparent 75%);
  filter: blur(50px);
  animation: pulseHorizon 7s ease-in-out infinite alternate;
}

@keyframes pulseHorizon {
  0% { opacity: 0.7; transform: scaleY(0.95); }
  100% { opacity: 1.0; transform: scaleY(1.08); }
}

.css-ember {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle, #fff8e1 20%, #ffaa00 70%, transparent 100%);
  box-shadow: 0 0 8px 2px rgba(255, 170, 0, 0.6);
  animation: floatEmber var(--dur) linear infinite;
  animation-delay: var(--delay);
}

@keyframes floatEmber {
  0% {
    transform: translate3d(var(--x), 105vh, 0) scale(0.6);
    opacity: 0;
  }
  15% { opacity: 0.85; }
  85% { opacity: 0.7; }
  100% {
    transform: translate3d(calc(var(--x) + var(--drift)), -5vh, 0) scale(1.1);
    opacity: 0;
  }
}

.css-lantern {
  position: absolute;
  left: var(--left);
  bottom: var(--bottom);
  width: 32px;
  height: 48px;
  transform: scale(var(--scale));
  border-radius: 6px 6px 12px 12px;
  background: linear-gradient(to bottom, #ffe082 0%, #ff8f00 80%, #b26a00 100%);
  box-shadow: 0 0 35px 10px rgba(255, 160, 0, 0.45);
  animation: lanternFloat var(--dur) ease-in-out infinite alternate;
}

@keyframes lanternFloat {
  0% { transform: scale(var(--scale)) translateY(0) rotate(-2deg); }
  100% { transform: scale(var(--scale)) translateY(-25px) rotate(2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .css-ember, .css-lantern, .horizon-glow {
    animation: none !important;
  }
}
```

---

### 3.7 Delivery Format & Script Vendoring

- **Vendoring Recommendation**:
  - Store Three.js r128 (minified, ~590KB uncompressed, ~150KB gzip) at `sadhna-apology/js/vendor/three.min.js`.
  - Include CDN fallback in HTML:
    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
      if (typeof THREE === 'undefined') {
        document.write('<script src="js/vendor/three.min.js"><\/script>');
      }
    </script>
    ```
- **Atmosphere Engine Module Interface**:
  Expose a clean lifecycle contract `AtmosphereEngine` in `js/atmosphere.js`:
  ```js
  const AtmosphereEngine = {
    init(containerElement),
    updateScroll(progressRatio),
    setQuality(qualityMode), // 'high', 'low', 'css-fallback'
    pause(),
    resume(),
    destroy()
  };
  ```

---

## 4. Caveats

1. **Post-Processing Passes on Mobile**:
   - `EffectComposer` with multi-pass bloom (`UnrealBloomPass`) or Depth-of-Field (`BokehPass`) renders to intermediate WebGL framebuffers. On mobile GPUs (Mali, Adreno), this often causes bandwidth saturation and drops frame rates to 30–45fps.
   - *Design Stance*: We explicitly choose **in-shader analytic bloom & depth softening** in the ember and lantern fragment shaders. This achieves an authentic optical glow at **zero extra render passes**, guaranteeing 60fps everywhere.
2. **DeviceOrientation iOS Permissions**:
   - iOS 13+ requires explicit user interaction to trigger `DeviceOrientationEvent.requestPermission()`.
   - *Design Stance*: Do not force a permission modal that interrupts Sadhna's emotional reading flow. Mouse and touch drag parallax are active immediately; gyroscope is treated as a progressive enhancement only if already granted.
3. **Headless Node.js Verification**:
   - Standard headless Node.js test runners lack native WebGL contexts unless paired with `mock-browser` or `headless-gl` (`gl` package).
   - *Verification Stance*: The automated verification script must test scene lifecycle exports, shader string validity, mathematical formulas, and fallback activation without requiring a physical GPU driver.

---

## 5. Conclusion

1. The "Floating Lanterns & Golden Embers" visual atmosphere can be executed with breathtaking emotional fidelity and rock-solid 60fps stability using:
   - Deep nocturnal twilight sky gradient with horizon luminescence and radial vignette.
   - Single-draw-call, GPU-animated golden ember particle system (1,400 desktop / 600 mobile particles).
   - Low-poly octagonal sky lanterns using `THREE.InstancedMesh` with subsurface scattering paper shaders (2 draw calls).
   - Total scene draw calls capped at **3**, total triangle count under **3,500**.
2. Parallax and scroll coupling elevate the camera as Sadhna reads the letter, creating an uplifting symbolic ascent without layout jitter.
3. A complete, standalone pure CSS fallback guarantees that even if WebGL is disabled or context is lost, the website retains its warm, contemplative beauty.
4. Downstream implementers (Worker, Reviewers) have all exact formulas, shader sources, and architecture contracts needed for immediate implementation.

---

## 6. Verification Method

To independently verify this specification and its downstream implementation:

1. **Draw Call & Performance Audit**:
   - In browser DevTools Console (or Spector.js):
     ```js
     console.log(renderer.info.render.calls); // Must equal exactly 3 (embers + lanterns + rings)
     console.log(renderer.info.render.triangles); // Must be < 4000
     ```
2. **Context Loss & Recovery Verification**:
   - Execute in browser console:
     ```js
     const ext = renderer.getContext().getExtension('WEBGL_lose_context');
     ext.loseContext(); // Verify CSS fallback immediately engages without errors
     setTimeout(() => ext.restoreContext(), 1500); // Verify Three.js reinitializes cleanly
     ```
3. **60fps Frame Budget Verification**:
   - Run Chrome DevTools Performance profile for 10 seconds of active scrolling:
     - No frame exceeding 16.6ms.
     - Zero Garbage Collection major spikes (confirming zero per-frame object instantiation).
4. **Automated Headless Test Run**:
   - In Node.js:
     ```bash
     node tests/verify-atmosphere.js
     ```
   - Must exit with code 0, verifying shader compilation syntax, instance matrix calculations, and CSS fallback selectors.
