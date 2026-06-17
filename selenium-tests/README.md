# SkillSphereAI Selenium E2E Web Testing Suite

This folder contains a complete Selenium WebDriver automation framework written in Node.js for the SkillSphereAI web application. It tests the entire app E2E flow from authentication through onboarding, dashboard analysis, assessments, portfolio management, and settings navigation — generating a professionally styled Excel test report at the end.

---

## 🛠️ Prerequisites

| Requirement | Details |
|---|---|
| Node.js | v18 or higher |
| Google Chrome | Latest stable version |
| SkillSphereAI App | Running on `http://localhost:3000` |

> **Note:** `selenium-webdriver` v4 uses Selenium Manager to automatically download and configure the correct ChromeDriver. You do **not** need to install ChromeDriver separately.

---

## 🚀 Setup & Installation

### 1. Install Dependencies

Navigate to this `selenium-tests` folder and install the required npm packages:

```bash
cd selenium-tests
npm install
```

### 2. Start the Web Application

Open a separate terminal in the project root (`skillsphereai`) and start the dev server:

```bash
npm run dev
```

This starts the Express + Vite server on `http://localhost:3000`.

### 3. Run the Test Suite

Once the app is running, execute the master runner:

```bash
node run_suite.js
```

> **Tip:** The runner automatically detects if the app server is offline and attempts to start it for you. You can also run headlessly by setting `TEST_HEADLESS=true`:
> ```bash
> TEST_HEADLESS=true node run_suite.js
> ```

---

## 📊 Test Coverage — E2E Scenarios

| Step | Test Name |
|---|---|
| 1 | Launch Web Application |
| 2 | Authentication / Login |
| 3 | Register New Account (if needed) |
| 4 | Onboarding — Demographics |
| 5 | Onboarding — Academic Details |
| 6 | Onboarding — Skills Selection |
| 7 | Onboarding — Resume Upload & Parse |
| 8 | Dashboard Verification |
| 9 | Scorecard Tab Navigation |
| 10 | Simulation Sandbox Verification |
| 11 | Profile & Portfolio Manager |
| 12 | Settings Panel Verification |
| 13 | Return to Home Dashboard |

---

## 📂 Output Artifacts

| File/Folder | Purpose |
|---|---|
| `selenium_test_report.xlsx` | Professionally styled Excel test report |
| `screenshots/` | Auto-captured PNG screenshots per step |

### Excel Report Tabs

- **Summary Dashboard** — High-level metrics: execution duration, start/end times, total steps, pass count, fail count, and pass rate percentage (color-coded).
- **Test Details** — Full step-by-step grid with timestamps, step names, PASS/FAIL status, execution durations (ms), error logs, and screenshot path references.

---

## ⚙️ Configuration

You can override defaults using a `.env` file inside this folder or environment variables:

| Variable | Default | Description |
|---|---|---|
| `TEST_URL` | `http://localhost:3000` | Target URL for the web app |
| `TEST_BROWSER` | `chrome` | Browser to use |
| `TEST_HEADLESS` | `false` | Run Chrome in headless mode |
| `TEST_TIMEOUT` | `15000` | Global element wait timeout (ms) |
