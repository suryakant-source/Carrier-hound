import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\caf034a4-a523-4c7f-8755-7fa4fad550ba";

const pageTarget = process.argv[2] || "/";
const pageName = process.argv[3] || "home";

const widths = [360, 390, 430, 768, 1280];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle"],
  });

  try {
    const page = await browser.newPage();
    const url = `http://localhost:3000${pageTarget}`;

    for (const w of widths) {
      const h = w === 1280 ? 900 : 844;
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, pageName === "radar" ? 3000 : 1500));

      // Test horizontal overflow
      const overflow = await page.evaluate((width) => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const maxW = Math.max(docWidth, bodyWidth);
        const hasOverflow = maxW > width;

        const culprits = [];
        if (hasOverflow) {
          const all = document.querySelectorAll("*");
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > width + 1 || rect.width > width + 1) {
              culprits.push({
                tag: el.tagName,
                id: el.id,
                className: typeof el.className === "string" ? el.className.slice(0, 100) : "",
                width: rect.width,
                right: rect.right,
              });
            }
          }
        }
        return { hasOverflow, docWidth, bodyWidth, culprits: culprits.slice(0, 5) };
      }, w);

      console.log(`[${pageName}] ${w}px -> Overflow: ${overflow.hasOverflow} (doc: ${overflow.docWidth}, win: ${w})`);
      if (overflow.hasOverflow) {
        console.log(`  Culprits for ${w}px:`, JSON.stringify(overflow.culprits));
      }

      await page.screenshot({
        path: path.join(outDir, `${pageName}_${w}.png`),
        fullPage: false,
      });
    }

    // Landscape Phone: 844 x 390
    if (pageName === "radar" || pageName === "job_search_all") {
      console.log(`Capturing landscape phone for ${pageName} (844x390)...`);
      await page.setViewport({ width: 844, height: 390, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, pageName === "radar" ? 3000 : 1500));
      await page.screenshot({
        path: path.join(outDir, `${pageName}_landscape_844x390.png`),
        fullPage: false,
      });
      console.log(`Saved ${pageName}_landscape_844x390.png`);
    }

    // Zoom 200% Usability Test
    console.log(`Capturing 200% zoom for ${pageName}...`);
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, pageName === "radar" ? 3000 : 1500));
    await page.screenshot({
      path: path.join(outDir, `${pageName}_zoom_200.png`),
      fullPage: false,
    });
    console.log(`Saved ${pageName}_zoom_200.png`);

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}

run();
