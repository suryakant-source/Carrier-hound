import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\9eab4d28-ab6d-4f12-8da3-733ed802a5b6";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // 1. Mobile 390px (iPhone) test
    console.log("Capturing Mobile 390px view...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto("http://localhost:3000/job-search/all?cat=tech", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    // Wait for jobs to load
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: path.join(outDir, "pill_bar_mobile_390.png"),
      fullPage: false,
    });
    console.log("Saved pill_bar_mobile_390.png");

    // 2. Desktop 1280px view
    console.log("Capturing Desktop 1280px view...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto("http://localhost:3000/jobs?cat=tech", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: path.join(outDir, "pill_bar_desktop_1280.png"),
      fullPage: false,
    });
    console.log("Saved pill_bar_desktop_1280.png");

    // 3. Advanced Filter Slide-over open view on desktop/mobile
    console.log("Capturing Filter Slide-over view...");
    // Click the Filter pill button
    const filterBtn = await page.$("button[aria-label='Open advanced filters']");
    if (filterBtn) {
      await filterBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({
        path: path.join(outDir, "pill_bar_filter_drawer.png"),
        fullPage: false,
      });
      console.log("Saved pill_bar_filter_drawer.png");
    }
  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

run();
