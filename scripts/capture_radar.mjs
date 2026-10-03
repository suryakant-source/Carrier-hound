import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\caf034a4-a523-4c7f-8755-7fa4fad550ba";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle"],
  });

  try {
    const page = await browser.newPage();
    console.log("Setting logged in state for Upgrade Modal capture...");
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("careermonke_user_email", "candidate@example.com");
    });

    console.log("Capturing Desktop 1280px radar with Light Filters...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });
    await page.goto("http://localhost:3000/radar", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 3500));
    await page.screenshot({
      path: path.join(outDir, "radar_light_filters.png"),
      fullPage: false,
    });
    console.log("Saved radar_light_filters.png");

    // 2. Open drawer to verify Free vs Pro blurred fields and lock icons
    console.log("Capturing Free vs Pro Gated Job Drawer...");
    const sfBtn = await page.waitForSelector('button[aria-label*="San Francisco"]', { timeout: 8000 }).catch(() => null);
    if (sfBtn) {
      await sfBtn.click();
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({
        path: path.join(outDir, "radar_free_pro_drawer.png"),
        fullPage: false,
      });
      console.log("Saved radar_free_pro_drawer.png");

      // 3. Click locked apply button to open Upgrade Modal
      console.log("Clicking locked button to capture Upgrade Modal...");
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const b = btns.find(x => x.textContent.includes('Direct Apply'));
        if (b) b.click();
      });
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({
        path: path.join(outDir, "radar_upgrade_modal.png"),
        fullPage: false,
      });
      console.log("Saved radar_upgrade_modal.png");
    }

    // 4. Mobile 390px view with filters
    console.log("Capturing Mobile 390px radar with filters...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto("http://localhost:3000/radar", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 3500));
    await page.screenshot({
      path: path.join(outDir, "radar_mobile_filters.png"),
      fullPage: false,
    });
    console.log("Saved radar_mobile_filters.png");

  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    await browser.close();
  }
}

run();
