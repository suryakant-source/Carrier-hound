import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const brainDir = "C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\caf034a4-a523-4c7f-8755-7fa4fad550ba";
const baselineDir = path.join(brainDir, "baselines");
const afterDir = path.join(brainDir, "after");
const diffDir = path.join(brainDir, "diffs");

if (!fs.existsSync(diffDir)) {
  fs.mkdirSync(diffDir, { recursive: true });
}

const targets = [
  "home_1280",
  "home_1440",
  "login_1280",
  "login_1440",
  "job_search_all_1280",
  "job_search_all_1440",
  "resume_1280",
  "resume_1440",
  "radar_1280",
  "radar_1440",
  "worldwide_1280",
  "worldwide_1440",
  "remote_engineering_1280",
  "remote_engineering_1440",
  "paywall_modal_1280",
  "paywall_modal_1440",
];

async function compare() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
  });

  try {
    const page = await browser.newPage();
    const results = [];

    for (const t of targets) {
      const basePath = path.join(baselineDir, `baseline_${t}.png`);
      const afterFilePath = path.join(afterDir, `after_${t}.png`);

      if (!fs.existsSync(basePath) || !fs.existsSync(afterFilePath)) {
        console.log(`Skipping ${t}: files not found`);
        continue;
      }

      const baseB64 = fs.readFileSync(basePath).toString("base64");
      const afterB64 = fs.readFileSync(afterFilePath).toString("base64");

      const diffResult = await page.evaluate(
        async ({ baseB64, afterB64 }) => {
          function loadImage(src) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = src;
            });
          }

          const img1 = await loadImage(`data:image/png;base64,${baseB64}`);
          const img2 = await loadImage(`data:image/png;base64,${afterB64}`);

          const w = Math.min(img1.width, img2.width);
          const h = Math.min(img1.height, img2.height);

          const canvas1 = document.createElement("canvas");
          canvas1.width = w;
          canvas1.height = h;
          const ctx1 = canvas1.getContext("2d");
          ctx1.drawImage(img1, 0, 0);
          const data1 = ctx1.getImageData(0, 0, w, h).data;

          const canvas2 = document.createElement("canvas");
          canvas2.width = w;
          canvas2.height = h;
          const ctx2 = canvas2.getContext("2d");
          ctx2.drawImage(img2, 0, 0);
          const data2 = ctx2.getImageData(0, 0, w, h).data;

          let diffPixels = 0;
          const totalPixels = w * h;

          for (let i = 0; i < data1.length; i += 4) {
            const rDiff = Math.abs(data1[i] - data2[i]);
            const gDiff = Math.abs(data1[i + 1] - data2[i + 1]);
            const bDiff = Math.abs(data1[i + 2] - data2[i + 2]);
            const aDiff = Math.abs(data1[i + 3] - data2[i + 3]);

            // Slight delta threshold to account for antialiasing or dynamic timestamps
            if (rDiff > 10 || gDiff > 10 || bDiff > 10 || aDiff > 10) {
              diffPixels++;
            }
          }

          const diffPercent = ((diffPixels / totalPixels) * 100).toFixed(2);
          return { diffPixels, totalPixels, diffPercent: parseFloat(diffPercent) };
        },
        { baseB64, afterB64 }
      );

      results.push({
        target: t,
        diffPercent: diffResult.diffPercent,
        diffPixels: diffResult.diffPixels,
        totalPixels: diffResult.totalPixels,
      });

      console.log(
        `[Compare] ${t} -> Diff: ${diffResult.diffPercent}% (${diffResult.diffPixels} / ${diffResult.totalPixels} px)`
      );
    }

    console.log("\nSummary Table:");
    console.table(results);
  } catch (err) {
    console.error("Comparison error:", err);
  } finally {
    await browser.close();
  }
}

compare();
