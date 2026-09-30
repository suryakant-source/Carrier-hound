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

    console.log("1. Navigating to /login?next=/job-search/all...");
    await page.goto("http://localhost:3000/login?next=/job-search/all", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log("2. Waiting for email input...");
    await page.waitForSelector("input#email");
    await new Promise((r) => setTimeout(r, 1000));

    console.log("3. Typing email...");
    await page.type("input#email", "demo.monkey@careermonke.com");

    console.log("4. Submitting form...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }),
      page.click("button[type='submit']"),
    ]);

    const currentUrl = page.url();
    console.log("4. Redirected URL:", currentUrl);

    // Check localStorage
    const savedEmail = await page.evaluate(() => localStorage.getItem("careermonke_user_email"));
    console.log("5. Saved email in localStorage:", savedEmail);

    if (currentUrl.includes("/job-search/all") && savedEmail === "demo.monkey@careermonke.com") {
      console.log("SUCCESS: Instant email login and redirection works perfectly!");
    } else {
      console.error("FAIL: Did not redirect or save email properly.");
    }
  } catch (err) {
    console.error("Error during auth flow test:", err);
  } finally {
    await browser.close();
  }
}

run();
