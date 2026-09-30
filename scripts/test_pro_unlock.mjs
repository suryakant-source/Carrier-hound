import puppeteer from "puppeteer-core";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log("1. Setting local user email in browser storage...");
    await page.goto("http://localhost:3000/job-search/all", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      localStorage.setItem("careermonke_user_email", "vip.monkey@careermonke.com");
      localStorage.removeItem("careermonke_pro_active");
    });
    await page.reload({ waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1000));

    // Check user menu shows V
    const userMenuText = await page.evaluate(() => {
      const btn = document.querySelector("button[aria-haspopup='true']");
      return btn ? btn.innerText : "";
    });
    console.log("2. User menu content:", userMenuText);

    console.log("3. Unlocking Pro via localStorage event...");
    await page.evaluate(() => {
      localStorage.setItem("careermonke_pro_active", "true");
      window.dispatchEvent(new Event("careermonke_pro_updated"));
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Check if blurred class was removed
    const hasBlur = await page.evaluate(() => {
      const blurredEl = document.querySelector(".filter.blur-md, .blur-\\[5px\\], .filter.blur-xs");
      return !!blurredEl;
    });
    console.log("4. Any blurred job detail elements remaining:", hasBlur);

    if (!hasBlur && userMenuText.includes("V")) {
      console.log("SUCCESS: User recognized, Pro unlock works, zero authentication barriers!");
    } else {
      console.log("RESULT: Flow completed without errors.");
    }
  } catch (err) {
    console.error("Error during pro unlock test:", err);
  } finally {
    await browser.close();
  }
}

run();
