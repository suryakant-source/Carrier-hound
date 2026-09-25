/**
 * Automated Verification Script for Sadhna Apology Website
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
let errors = [];

console.log('--- Starting Verification for Sadhna Apology Website ---');

// 1. Check required files exist
const requiredFiles = ['index.html', 'style.css', 'main.js'];
requiredFiles.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required file: ${file}`);
  } else {
    console.log(`[PASS] Found ${file}`);
  }
});

// 2. Validate index.html contents
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

if (!html.includes('Sadhna')) {
  errors.push('index.html must be explicitly dedicated to Sadhna');
} else {
  console.log('[PASS] Personalized for Sadhna');
}

if (html.includes('[FILL]') || html.includes('TODO') || html.includes('Lorem ipsum')) {
  errors.push('index.html still contains placeholder tokens');
} else {
  console.log('[PASS] No placeholder tokens found');
}

if (!html.includes('id="webgl-canvas"')) {
  errors.push('Missing WebGL canvas element');
} else {
  console.log('[PASS] WebGL canvas mounted');
}

if (!html.includes('https://wa.me/')) {
  errors.push('Missing WhatsApp response link');
} else {
  console.log('[PASS] WhatsApp response mechanism present');
}

// 3. Validate main.js syntax and key systems
const js = fs.readFileSync(path.join(dir, 'main.js'), 'utf8');
if (!js.includes('THREE.Scene') || !js.includes('THREE.PerspectiveCamera')) {
  errors.push('main.js missing Three.js core initialization');
} else {
  console.log('[PASS] Three.js WebGL scene logic present');
}

if (!js.includes('AudioContext')) {
  errors.push('main.js missing ambient audio system');
} else {
  console.log('[PASS] Ambient Web Audio synthesizer present');
}

// Summary
if (errors.length > 0) {
  console.error('\nVerification FAILED with the following issues:');
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log('\n[SUCCESS] All automated verification checks passed cleanly!');
  process.exit(0);
}
