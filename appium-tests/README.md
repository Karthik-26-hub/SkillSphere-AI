# SkillSphereAI Appium E2E Automation Testing Suite

This folder contains a complete Appium mobile E2E automation testing suite for the SkillSphereAI Android Application. It tests the application flow from launch and login through onboarding, dashboard verification, assessment sandbox, and portfolio manager, culminating in a professionally styled Excel report of the execution details.

---

## 🛠️ Prerequisites & Setup

### 1. Install Node.js & Appium Server
Appium is built on Node.js. Ensure you have Node.js installed, then install Appium and the Android UIAutomator2 driver globally:

```bash
# Install Appium Server v2
npm install -g appium

# Install UIAutomator2 Driver for Android
appium driver install uiautomator2
```

### 2. Configure Android Environment
To allow Appium to communicate with your emulator or physical Android device, ensure your `ANDROID_HOME` environment variable is configured. 

The suite will automatically look for the Android SDK in the default location:
`C:\Users\karthik\AppData\Local\Android\Sdk`

If you are using a physical device, ensure **USB Debugging** is enabled on the device under developer settings.

### 3. Start Emulator or Connect Device
- Verify your device/emulator is connected and recognized by ADB:
  ```bash
  C:\Users\karthik\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
  ```

---

## 🚀 Installation & Running

### 1. Install Python Dependencies
Navigate to this folder (`appium-tests`) and install the required libraries:

```bash
pip install -r requirements.txt
```

### 2. Run Appium Server
Open a separate terminal window and start the Appium server on default port `4723`:

```bash
appium
```

### 3. Execute the Tests
Run the master orchestrator script, which verifies dependencies and server status before executing the tests:

```bash
python run_suite.py
```

*Alternatively, you can run tests directly via Pytest:*
```bash
pytest -v -s test_e2e.py
```

---

## 📊 Test Report & Artifacts

1. **Excel Analysis Report (`appium_test_report.xlsx`):**
   - Generated dynamically at the end of the test session.
   - **Summary Dashboard tab:** High-level key performance indicators (Pass Rate, Total Duration, Start/End times, Success/Failure counters).
   - **Test Details tab:** Full grid of test steps containing timestamp, step name, PASS/FAIL status, duration (ms), execution logs, and references to failure screenshots.
   
2. **Screenshots (`appium-tests/screenshots/`):**
   - Screenshots are automatically captured at critical milestones and on any test step failure.
   - Visual references are linked directly inside the Excel report.
