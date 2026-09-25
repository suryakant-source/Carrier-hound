/**
 * FOR SADHNA — Atmospheric Three.js WebGL Experience & Interactive Audio
 * Visual Theme: Floating Lanterns & Golden Embers
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. Three.js Scene, Camera, and Renderer Setup
     ========================================================================== */
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js or Canvas not available. Using CSS fallback.');
    return;
  }

  let scene, camera, renderer;
  let lanterns = [];
  let embersParticles, embersGeometry, embersPositions, embersVelocities;
  const EMBER_COUNT = 450;
  const LANTERN_COUNT = 32;

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let scrollY = 0;

  function initThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090e, 0.0035);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 100);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2238, 1.2);
    scene.add(ambientLight);

    const goldenMoonLight = new THREE.DirectionalLight(0xffe2a4, 1.0);
    goldenMoonLight.position.set(20, 100, 50);
    scene.add(goldenMoonLight);

    createFloatingLanterns();
    createRisingEmbers();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ==========================================================================
     2. Bespoke 3D Floating Lanterns
     ========================================================================== */
  function createLanternTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 240, 200, 1)');
    grad.addColorStop(0.35, 'rgba(246, 192, 101, 0.85)');
    grad.addColorStop(0.8, 'rgba(230, 126, 58, 0.4)');
    grad.addColorStop(1, 'rgba(180, 80, 30, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function createFloatingLanterns() {
    const lanternGeo = new THREE.CylinderGeometry(2.2, 1.8, 4.5, 8, 1, true);
    const lanternTexture = createLanternTexture();

    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffd17a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    const glowMat = new THREE.SpriteMaterial({
      map: lanternTexture,
      color: 0xffb74d,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95
    });

    for (let i = 0; i < LANTERN_COUNT; i++) {
      const lanternGroup = new THREE.Group();

      const mesh = new THREE.Mesh(lanternGeo, lanternMat);
      lanternGroup.add(mesh);

      // Inner glowing core
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.scale.set(10, 10, 1);
      lanternGroup.add(glowSprite);

      // Distribute in a cylinder space around camera
      lanternGroup.position.x = (Math.random() - 0.5) * 220;
      lanternGroup.position.y = (Math.random() - 0.5) * 250 - 50;
      lanternGroup.position.z = (Math.random() - 0.5) * 160 - 20;

      // Custom motion properties
      lanternGroup.userData = {
        speedY: 0.08 + Math.random() * 0.12,
        swaySpeed: 0.5 + Math.random() * 0.8,
        swayDistance: 0.4 + Math.random() * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        baseX: lanternGroup.position.x,
        seed: Math.random() * 100
      };

      scene.add(lanternGroup);
      lanterns.push(lanternGroup);
    }
  }

  /* ==========================================================================
     3. Rising Golden Embers Particle Engine
     ========================================================================== */
  function createEmberTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 215, 130, 0.9)');
    grad.addColorStop(0.5, 'rgba(245, 166, 35, 0.5)');
    grad.addColorStop(1, 'rgba(230, 80, 20, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  function createRisingEmbers() {
    embersGeometry = new THREE.BufferGeometry();
    embersPositions = new Float32Array(EMBER_COUNT * 3);
    embersVelocities = [];

    for (let i = 0; i < EMBER_COUNT; i++) {
      embersPositions[i * 3 + 0] = (Math.random() - 0.5) * 240;
      embersPositions[i * 3 + 1] = (Math.random() - 0.5) * 240;
      embersPositions[i * 3 + 2] = (Math.random() - 0.5) * 180;

      embersVelocities.push({
        y: 0.2 + Math.random() * 0.35,
        x: (Math.random() - 0.5) * 0.1,
        seed: Math.random() * Math.PI * 2
      });
    }

    embersGeometry.setAttribute('position', new THREE.BufferAttribute(embersPositions, 3));

    const embersMaterial = new THREE.PointsMaterial({
      size: 2.8,
      map: createEmberTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    embersParticles = new THREE.Points(embersGeometry, embersMaterial);
    scene.add(embersParticles);
  }

  /* ==========================================================================
     4. Animation & Physics Loop
     ========================================================================== */
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX * 8;
    camera.position.y = -scrollY * 0.04 - mouseY * 6;
    camera.lookAt(0, -scrollY * 0.04, 0);

    // Update Floating Lanterns
    for (let i = 0; i < lanterns.length; i++) {
      const l = lanterns[i];
      const data = l.userData;

      l.position.y += data.speedY;
      l.position.x = data.baseX + Math.sin(elapsedTime * data.swaySpeed + data.seed) * (data.swayDistance * 8);
      l.rotation.y += data.rotSpeed;
      l.rotation.z = Math.sin(elapsedTime * data.swaySpeed + data.seed) * 0.05;

      // Recycle lanterns when they rise out of bounds
      if (l.position.y > 140 - (scrollY * 0.04)) {
        l.position.y = -140 - (scrollY * 0.04);
        l.position.x = (Math.random() - 0.5) * 220;
        data.baseX = l.position.x;
      }
    }

    // Update Rising Embers
    if (embersPositions) {
      for (let i = 0; i < EMBER_COUNT; i++) {
        const idx = i * 3;
        const vel = embersVelocities[i];

        embersPositions[idx + 1] += vel.y;
        embersPositions[idx + 0] += Math.sin(elapsedTime * 1.5 + vel.seed) * 0.12 + vel.x;

        // Reset ember to bottom
        if (embersPositions[idx + 1] > 120 - (scrollY * 0.04)) {
          embersPositions[idx + 1] = -120 - (scrollY * 0.04);
          embersPositions[idx + 0] = (Math.random() - 0.5) * 240;
        }
      }
      embersGeometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    targetMouseX = (event.clientX - windowHalfX) / windowHalfX;
    targetMouseY = (event.clientY - windowHalfY) / windowHalfY;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      targetMouseX = (event.touches[0].clientX - windowHalfX) / windowHalfX;
      targetMouseY = (event.touches[0].clientY - windowHalfY) / windowHalfY;
    }
  }

  function onScroll() {
    scrollY = window.scrollY;
  }

  /* ==========================================================================
     5. Ambient Audio Synthesizer (Zero External Dependencies, 100% Reliable)
     ========================================================================== */
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let chordInterval = null;

  const audioBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');

  // Chords in F Major / D Minor (Ethereal, warm, reflective)
  const chordProgression = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [130.81, 164.81, 196.00, 246.94], // Cmaj / Am
    [116.54, 146.83, 174.61, 220.00]  // Bbmaj7
  ];
  let chordIndex = 0;

  function initAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    // Warm Low-pass filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);
  }

  function playSoftChord(frequencies, duration) {
    if (!audioCtx || !isPlaying) return;

    frequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Add gentle detuning
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.05, now + 1.8);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.4);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  function startAmbientScore() {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 2.0);

    document.body.classList.add('playing');
    if (audioLabel) audioLabel.textContent = 'Ambient Sound: Playing';

    playSoftChord(chordProgression[chordIndex], 6.5);
    chordInterval = setInterval(() => {
      if (!isPlaying) return;
      chordIndex = (chordIndex + 1) % chordProgression.length;
      playSoftChord(chordProgression[chordIndex], 6.5);
    }, 6000);
  }

  function stopAmbientScore() {
    isPlaying = false;
    if (masterGain && audioCtx) {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    }
    if (chordInterval) {
      clearInterval(chordInterval);
      chordInterval = null;
    }
    document.body.classList.remove('playing');
    if (audioLabel) audioLabel.textContent = 'Ambient Sound: Off';
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAmbientScore();
      } else {
        startAmbientScore();
      }
    });
  }

  // Scroll cue click behavior
  const scrollPrompt = document.getElementById('scroll-prompt');
  if (scrollPrompt) {
    scrollPrompt.addEventListener('click', () => {
      const openingSection = document.getElementById('opening');
      if (openingSection) {
        openingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ==========================================================================
     6. WhatsApp & SMS Configuration Helper
     ========================================================================== */
  const toggleConfigBtn = document.getElementById('toggle-config-btn');
  const configDrawer = document.getElementById('config-drawer');
  const savePhoneBtn = document.getElementById('save-phone-btn');
  const customPhoneInput = document.getElementById('custom-phone');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  const smsBtn = document.getElementById('sms-btn');

  const defaultMsg = encodeURIComponent("Hey, I read your letter. I appreciate your honesty and wanted to reach out.");

  if (toggleConfigBtn && configDrawer) {
    toggleConfigBtn.addEventListener('click', () => {
      configDrawer.classList.toggle('hidden');
    });
  }

  function updateLinks(phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (whatsappBtn) {
      if (cleanPhone) {
        whatsappBtn.href = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;
      } else {
        whatsappBtn.href = `https://wa.me/?text=${defaultMsg}`;
      }
    }
    if (smsBtn) {
      if (cleanPhone) {
        smsBtn.href = `sms:${cleanPhone}?body=${defaultMsg}`;
      } else {
        smsBtn.href = `sms:?body=${defaultMsg}`;
      }
    }
  }

  // Restore saved phone if available
  try {
    const saved = localStorage.getItem('sadhna_apology_phone');
    if (saved && customPhoneInput) {
      customPhoneInput.value = saved;
      updateLinks(saved);
    }
  } catch(e) {}

  if (savePhoneBtn && customPhoneInput) {
    savePhoneBtn.addEventListener('click', () => {
      const val = customPhoneInput.value.trim();
      try {
        localStorage.setItem('sadhna_apology_phone', val);
      } catch(e) {}
      updateLinks(val);
      savePhoneBtn.textContent = 'Saved!';
      setTimeout(() => {
        savePhoneBtn.textContent = 'Update Links';
        configDrawer.classList.add('hidden');
      }, 1200);
    });
  }

  /* ==========================================================================
     7. Initialize Everything
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    initThree();
    animate();
  });

})();
