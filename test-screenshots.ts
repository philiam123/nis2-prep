import { chromium } from "playwright";

const BASE = "http://localhost:5000/#";
const SCREENSHOT_DIR = "/home/user/workspace/aigp-study-app/screenshots";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // 1. Landing page
  console.log("1. Taking landing page screenshot...");
  await page.goto(`${BASE}/`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-landing.png`, fullPage: true });
  console.log("   Done.");

  // 2. Register
  console.log("2. Navigating to register...");
  await page.goto(`${BASE}/register`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-register.png`, fullPage: true });

  console.log("   Filling registration form...");
  await page.fill('[data-testid="register-name"]', 'Test User');
  await page.fill('[data-testid="register-email"]', `test${Date.now()}@example.com`);
  await page.fill('[data-testid="register-password"]', 'password123');
  await page.click('[data-testid="register-submit"]');
  await page.waitForTimeout(2000);
  console.log("   Registered. Current URL:", page.url());

  // 3. Payment page
  console.log("3. Taking payment page screenshot...");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/03-payment.png`, fullPage: true });

  // 4. Complete payment
  console.log("4. Completing payment...");
  const payBtn = page.locator('[data-testid="payment-submit"]');
  if (await payBtn.isVisible()) {
    await payBtn.click();
    await page.waitForTimeout(2000);
  }
  console.log("   Payment done. Current URL:", page.url());

  // 5. Dashboard
  console.log("5. Taking dashboard screenshot...");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/05-dashboard.png`, fullPage: true });

  // 6. Study view
  console.log("6. Navigating to study...");
  await page.goto(`${BASE}/study`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/06-study.png`, fullPage: true });

  // 7. Quiz setup
  console.log("7. Navigating to quiz...");
  await page.goto(`${BASE}/quiz`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/07-quiz-setup.png`, fullPage: true });

  console.log("All screenshots saved!");
  await browser.close();
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
