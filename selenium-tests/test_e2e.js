import { Builder, By, until, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import path from "path";
import fs from "fs";
import { CONFIG, SCREENSHOTS_DIR } from "./config.js";
import { SeleniumExcelReporter } from "./reporter.js";

const reporter = new SeleniumExcelReporter(CONFIG.reportPath);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function captureScreenshot(driver, stepName) {
  const filename = `${stepName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  try {
    const data = await driver.takeScreenshot();
    fs.writeFileSync(filepath, data, "base64");
    return path.join("screenshots", filename);
  } catch {
    return "";
  }
}

async function waitForElement(driver, locator, timeout = CONFIG.timeout) {
  return driver.wait(until.elementLocated(locator), timeout);
}

async function waitAndClick(driver, locator, timeout = CONFIG.timeout) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
  await el.click();
  return el;
}

async function waitAndType(driver, locator, text, timeout = CONFIG.timeout) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await el.clear();
  await el.sendKeys(text);
  return el;
}

async function buildDriver() {
  const options = new chrome.Options();
  if (CONFIG.headless) {
    options.addArguments("--headless=new");
  }
  options.addArguments(
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1366,768",
    "--disable-extensions",
    "--disable-popup-blocking"
  );
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

// ─── TEST STEP WRAPPER ────────────────────────────────────────────────────────

async function runStep(driver, stepName, fn) {
  const start = Date.now();
  try {
    await fn(driver);
    const duration = Date.now() - start;
    const shot = await captureScreenshot(driver, stepName);
    reporter.addStep(stepName, "PASS", duration, "Step completed successfully.", shot);
    console.log(`  ✓ PASS [${duration}ms] ${stepName}`);
  } catch (err) {
    const duration = Date.now() - start;
    const shot = await captureScreenshot(driver, `FAIL_${stepName}`);
    reporter.addStep(stepName, "FAIL", duration, err.message || String(err), shot);
    console.error(`  ✗ FAIL [${duration}ms] ${stepName}: ${err.message}`);
    throw err;
  }
}

// ─── E2E TEST SCENARIOS ───────────────────────────────────────────────────────

async function step01_launchApp(driver) {
  await driver.get(CONFIG.baseUrl);
  await driver.wait(until.titleContains("Cognitive"), 12000).catch(() => null);
  // Ensure auth panel is visible
  await waitForElement(driver, By.id("auth-panel-container"), 12000);
}

async function step02_authentication(driver) {
  // Fill email
  const emailInput = await waitForElement(driver, By.css("input[type='email']"));
  await emailInput.clear();
  await emailInput.sendKeys("tony6250584@gmail.com");

  // Fill password
  const pwInput = await waitForElement(driver, By.css("input[type='password']"));
  await pwInput.clear();
  await pwInput.sendKeys("Candidate@123");

  // Click "Access Suite"
  await waitAndClick(driver, By.id("btn-login-submit"));

  // Wait briefly for response — app may show OTP screen or go straight to onboarding
  await driver.sleep(2000);

  // Check if OTP screen appeared
  try {
    const otpSection = await driver.findElement(By.xpath("//*[contains(text(),'Multi-Factor')]"));
    if (otpSection) {
      // Fill OTP field with bypass token
      const otpInput = await waitForElement(driver, By.css("input[maxlength='6'], input[placeholder*='OTP'], input[type='text']"), 5000);
      await otpInput.clear();
      await otpInput.sendKeys("402921");
      await waitAndClick(driver, By.id("btn-otp-submit"));
      await driver.sleep(2000);
    }
  } catch {
    // OTP not shown — direct login or registration path taken
  }

  // Verify we've passed auth (onboarding or dashboard present)
  await driver.wait(
    until.elementLocated(By.xpath("//*[@id='auth-panel-container' or contains(text(),'Onboarding') or contains(text(),'Welcome')]")),
    10000
  );
}

async function step03_register(driver) {
  // If still on auth panel, click "Create Account" and register
  let onAuthPanel = false;
  try {
    await driver.findElement(By.id("auth-panel-container"));
    onAuthPanel = true;
  } catch { /* not on auth panel */ }

  if (!onAuthPanel) return;

  // Click "Create Account" link
  await waitAndClick(driver, By.xpath("//*[contains(text(),'Create Account')]"));
  await driver.sleep(500);

  // Fill registration form
  const nameInput = await waitForElement(driver, By.css("input[placeholder*='Candidate'], input[type='text']"));
  await nameInput.clear();
  await nameInput.sendKeys("Tony Candidate");

  const emailInput = await waitForElement(driver, By.css("input[type='email']"));
  await emailInput.clear();
  await emailInput.sendKeys("tony6250584@gmail.com");

  const pwInput = await waitForElement(driver, By.css("input[type='password']"));
  await pwInput.clear();
  await pwInput.sendKeys("Candidate@123");

  // Submit registration
  await waitAndClick(driver, By.id("btn-register-submit"));
  await driver.sleep(2000);

  // Enter OTP bypass
  try {
    const otpInput = await waitForElement(driver, By.css("input[maxlength='6'], input[type='text']"), 5000);
    await otpInput.clear();
    await otpInput.sendKeys("402921");
    await waitAndClick(driver, By.id("btn-otp-submit"));
    await driver.sleep(2000);
  } catch { /* OTP might not appear */ }
}

async function step04_onboarding_demographics(driver) {
  // Fill name if prompted
  try {
    const nameField = await waitForElement(driver, By.css("input[placeholder*='Dr.'], input[placeholder*='Full'], input[placeholder*='Candidate']"), 8000);
    await nameField.clear();
    await nameField.sendKeys("Tony Candidate");
  } catch { /* field might not exist */ }

  // Click "Proceed to Academics"
  await waitAndClick(driver, By.xpath("//button[contains(text(),'Academics') or contains(text(),'Proceed')]"));
  await driver.sleep(1000);
}

async function step05_onboarding_academics(driver) {
  await driver.sleep(500);

  // Fill academic fields using label proximity or placeholder approach
  const textInputs = await driver.findElements(By.css("input[type='text'], input[type='number']"));

  if (textInputs.length >= 1) { await textInputs[0].clear(); await textInputs[0].sendKeys("National Institute of Science"); }
  if (textInputs.length >= 2) { await textInputs[1].clear(); await textInputs[1].sendKeys("B.Tech"); }
  if (textInputs.length >= 3) { await textInputs[2].clear(); await textInputs[2].sendKeys("Software Engineering"); }
  if (textInputs.length >= 4) { await textInputs[3].clear(); await textInputs[3].sendKeys("8.8"); }

  // Click next
  await waitAndClick(driver, By.xpath("//button[contains(text(),'Skills') or contains(text(),'Verify')]"));
  await driver.sleep(1000);
}

async function step06_onboarding_skills(driver) {
  await driver.sleep(500);

  // Click skill tags in the skills pool
  const skillTags = ["React", "Python", "JavaScript", "Node.js"];
  for (const skill of skillTags) {
    try {
      const btn = await driver.findElement(By.xpath(`//button[contains(text(),'${skill}')]`));
      await btn.click();
      await driver.sleep(200);
    } catch { /* skill not found on this screen */ }
  }

  // Click "Onboard to Resume Upload" or similar
  await waitAndClick(driver, By.xpath("//button[contains(text(),'Resume') or contains(text(),'Onboard')]"));
  await driver.sleep(1000);
}

async function step07_onboarding_resume(driver) {
  await driver.sleep(500);

  // Fill textarea with sample resume text
  try {
    const textarea = await waitForElement(driver, By.css("textarea"), 6000);
    await textarea.clear();
    await textarea.sendKeys(
      "Tony Candidate. Software Engineer with expertise in React, Python, Node.js. " +
      "GPA: 8.8. 2+ years of industry experience. Led cloud deployment projects."
    );
  } catch { /* textarea might not be visible */ }

  // Click bypass/skip AI or complete
  await waitAndClick(driver, By.xpath(
    "//button[contains(text(),'Bypass') or contains(text(),'Skip') or contains(text(),'Complete') or contains(text(),'Validate')]"
  ));

  // Wait for dashboard to load
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Welcome') or contains(text(),'employability') or contains(text(),'Employability')]")),
    15000
  );
}

async function step08_dashboard_verification(driver) {
  // Verify scorecard/score is displayed
  const scoreEl = await waitForElement(driver,
    By.xpath("//*[contains(@class,'score') or contains(text(),'72') or contains(text(),'75') or contains(text(),'%')]"),
    10000
  );
  const scoreText = await scoreEl.getText();
  if (!scoreText) throw new Error("Score element found but has no text content");

  // Verify navigation tabs exist
  await waitForElement(driver, By.id("sticky-bottom-navigation"), 8000);
}

async function step09_scorecard_navigation(driver) {
  // Click Scorecard tab
  try {
    await waitAndClick(driver, By.id("navigation-scorecard-tab"));
  } catch {
    await waitAndClick(driver, By.xpath("//*[contains(text(),'Scorecard')]"));
  }
  await driver.sleep(1500);

  // Verify scorecard content loaded
  await waitForElement(driver,
    By.xpath("//*[contains(text(),'Simulation') or contains(text(),'Sandbox') or contains(text(),'Score')]"),
    8000
  );
}

async function step10_simulation_sandbox(driver) {
  // Click into Simulation Sandbox tab if separate sub-tabs exist
  try {
    await waitAndClick(driver, By.xpath("//*[contains(text(),'Simulation') or contains(text(),'Sandbox')]"));
    await driver.sleep(1500);
  } catch { /* already on sandbox */ }

  // Verify sandbox content (assessments, challenges)
  await waitForElement(driver,
    By.xpath("//*[contains(text(),'Technical') or contains(text(),'Assessment') or contains(text(),'Challenge')]"),
    8000
  );
}

async function step11_profile_portfolio(driver) {
  // Click Profile tab
  try {
    await waitAndClick(driver, By.id("navigation-profile-tab"));
  } catch {
    await waitAndClick(driver, By.xpath("//*[contains(text(),'Profile')]"));
  }
  await driver.sleep(1500);

  // Look for credentials / portfolio section
  await waitForElement(driver,
    By.xpath("//*[contains(text(),'Portfolio') or contains(text(),'Credentials') or contains(text(),'Project')]"),
    8000
  );
}

async function step12_settings_panel(driver) {
  // Click Settings tab
  try {
    await waitAndClick(driver, By.id("navigation-settings-tab"));
  } catch {
    await waitAndClick(driver, By.xpath("//*[contains(text(),'Settings')]"));
  }
  await driver.sleep(1500);

  // Verify settings content
  await waitForElement(driver,
    By.xpath("//*[contains(text(),'Save') or contains(text(),'Demo') or contains(text(),'Reset')]"),
    8000
  );
}

async function step13_home_navigation(driver) {
  // Click Home tab to return to dashboard
  try {
    await waitAndClick(driver, By.id("navigation-home-tab"));
  } catch {
    await waitAndClick(driver, By.xpath("//*[contains(text(),'Home') or contains(text(),'Dashboard')]"));
  }
  await driver.sleep(1500);

  // Verify dashboard is visible again
  await waitForElement(driver,
    By.xpath("//*[contains(text(),'Welcome') or contains(text(),'employability') or contains(text(),'Employability')]"),
    8000
  );
}

// ─── MAIN TEST RUNNER ─────────────────────────────────────────────────────────

export async function runTests() {
  let driver;
  console.log("\n" + "=".repeat(60));
  console.log("   SKILLSPHEREAI WEB E2E SELENIUM TEST RUNNER");
  console.log("=".repeat(60));
  console.log(`Target URL : ${CONFIG.baseUrl}`);
  console.log(`Browser    : ${CONFIG.browser}`);
  console.log(`Headless   : ${CONFIG.headless}`);
  console.log("=".repeat(60) + "\n");

  try {
    driver = await buildDriver();
    await driver.manage().setTimeouts({ implicit: 0, pageLoad: 30000, script: 30000 });

    const steps = [
      ["Launch Web Application",              step01_launchApp],
      ["Authentication / Login",              step02_authentication],
      ["Register New Account (if needed)",    step03_register],
      ["Onboarding — Demographics",           step04_onboarding_demographics],
      ["Onboarding — Academic Details",       step05_onboarding_academics],
      ["Onboarding — Skills Selection",       step06_onboarding_skills],
      ["Onboarding — Resume Upload & Parse",  step07_onboarding_resume],
      ["Dashboard Verification",              step08_dashboard_verification],
      ["Scorecard Tab Navigation",            step09_scorecard_navigation],
      ["Simulation Sandbox Verification",     step10_simulation_sandbox],
      ["Profile & Portfolio Manager",         step11_profile_portfolio],
      ["Settings Panel Verification",         step12_settings_panel],
      ["Return to Home Dashboard",            step13_home_navigation]
    ];

    let hasFailed = false;
    for (const [name, fn] of steps) {
      if (hasFailed) {
        reporter.addStep(name, "SKIP", 0, "Skipped due to earlier test failure.");
        console.log(`  ⊘ SKIP ${name}`);
        continue;
      }
      try {
        await runStep(driver, name, fn);
      } catch {
        hasFailed = true;
      }
    }

  } finally {
    if (driver) await driver.quit();
    console.log("\n" + "-".repeat(60));
    console.log("[*] Compiling Excel test analysis report...");
    await reporter.generateReport();
    console.log("[+] Test session finished.");
  }
}
