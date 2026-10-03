import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\caf034a4-a523-4c7f-8755-7fa4fad550ba";

const widths = [360, 390, 430, 768, 1280];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-gl=angle"],
  });

  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("careermonke_user_email", "candidate@example.com");
    });

    for (const w of widths) {
      const h = w === 1280 ? 900 : 844;
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto("http://localhost:3000/job-search/all", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise((r) => setTimeout(r, 2000));

      // Click Resume button to open PaywallModal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const resumeBtn = btns.find((b) => b.textContent && b.textContent.includes("Resume"));
        if (resumeBtn) resumeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));

      // Check overflow inside modal
      const modalInfo = await page.evaluate(() => {
        const modal = document.querySelector(".fixed.inset-0.z-50");
        if (!modal) return { found: false };
        const dialog = modal.querySelector(".max-w-lg");
        return {
          found: true,
          dialogRect: dialog ? dialog.getBoundingClientRect() : null,
          viewportHeight: window.innerHeight,
        };
      });

      console.log(`[PaywallModal] ${w}px -> Modal found: ${modalInfo.found}, Dialog:`, JSON.stringify(modalInfo.dialogRect));

      await page.screenshot({
        path: path.join(outDir, `paywall_modal_${w}.png`),
        fullPage: false,
      });
    }

    console.log("Paywall modal testing complete!");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}

run();
