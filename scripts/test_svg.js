const puppeteer = require('puppeteer-core');
const fs = require('fs');

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512 });
  const svg = fs.readFileSync('d:/Carrer-hound/public/careermonke.svg', 'utf8');
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0; background:#18181B; display:flex; justify-content:center; align-items:center; width:512px; height:512px;">${svg}</body></html>`);
  await page.screenshot({ path: 'd:/Carrer-hound/svg_test.png' });
  await browser.close();
  console.log('Saved svg_test.png');
})();
