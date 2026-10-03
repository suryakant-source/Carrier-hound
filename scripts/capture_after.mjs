import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const brainDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\caf034a4-a523-4c7f-8755-7fa4fad550ba";
const afterDir = path.join(brainDir, "after");

if (!fs.existsSync(afterDir)) {
  fs.mkdirSync(afterDir, { recursive: true });
}

const pages = [
  { name: "home", url: "http://localhost:3000/", wait: 2000 },
  { name: "login", url: "http://localhost:3000/login", isLoggedOut: true, wait: 2000 },
  { name: "job_search_all", url: "http://localhost:3000/job-search/all", wait: 4500 },
  { name: "resume", url: "http://localhost:3000/resume", wait: 2000 },
  { name: "radar", url: "http://localhost:3000/radar", wait: 4000 },
  { name: "worldwide", url: "http://localhost:3000/worldwide", wait: 2000 },
  { name: "remote_engineering", url: "http://localhost:3000/remote/jobs/engineering", wait: 2000 },
];

async function captureAfter() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle"],
  });

  try {
    const page = await browser.newPage();

    for (const p of pages) {
      for (const width of [1280, 1440]) {
        const height = 900;
        await page.setViewport({ width, height, deviceScaleFactor: 1 });

        if (p.isLoggedOut) {
          await page.evaluateOnNewDocument(() => {
            localStorage.removeItem("careermonke_user_email");
          });
        } else {
          await page.evaluateOnNewDocument(() => {
            localStorage.setItem("careermonke_user_email", "candidate@example.com");
          });
        }

        console.log(`Capturing after_${p.name}_${width}.png...`);
        await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await new Promise((r) => setTimeout(r, p.wait || 2000));
        await page.screenshot({
          path: path.join(afterDir, `after_${p.name}_${width}.png`),
          fullPage: false,
        });
      }
    }

    // Capture Upgrade Modal at 1280 and 1440 on /job-search/all
    for (const width of [1280, 1440]) {
      const height = 900;
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.goto("http://localhost:3000/job-search/all", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 2000));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const resumeBtn = btns.find((b) => b.textContent && b.textContent.includes("Resume"));
        if (resumeBtn) resumeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({
        path: path.join(afterDir, `after_paywall_modal_${width}.png`),
        fullPage: false,
      });
      console.log(`Saved after_paywall_modal_${width}.png`);
    }

    console.log("All after desktop screenshots captured successfully!");
  } catch (err) {
    console.error("Capture failed:", err);
  } finally {
    await browser.close();
  }
}

captureAfter();
