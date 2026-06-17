import os
import time
import pytest
from appium import webdriver
from appium.options.common import AppiumOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import APPIUM_CAPABILITIES, APPIUM_SERVER_URL, SCREENSHOTS_DIR
from reporter import AppiumExcelReporter

# Global reporter instance shared across tests
excel_reporter = AppiumExcelReporter(output_path="appium_test_report.xlsx")

@pytest.fixture(scope="session")
def reporter():
    """Fixture to handle reporting lifecycle."""
    yield excel_reporter
    # Generate report at the end of the session
    excel_reporter.generate_report()

@pytest.fixture(scope="session")
def driver(reporter):
    """Fixture to manage Appium Webdriver lifecycle."""
    print("\nInitializing Appium Driver...")
    options = AppiumOptions()
    for key, value in APPIUM_CAPABILITIES.items():
        options.set_capability(key, value)
        
    start_time = time.time()
    try:
        driver = webdriver.Remote(APPIUM_SERVER_URL, options=options)
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Driver Initialization", "PASS", duration, "Appium driver connected and APK installed successfully.")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Driver Initialization", "FAIL", duration, f"Failed to connect to Appium server: {str(e)}")
        raise e
        
    yield driver
    
    print("\nTerminating Appium Session...")
    driver.quit()

# --- HELPER FUNCTIONS FOR ROBUST WEBVIEW/NATIVE INTERACTION ---

def find_element_with_retry(driver, xpath_list, timeout=10):
    """
    Tries to find an element using a list of alternative XPaths to support 
    both native rendering layers, webview content, and different layout structures.
    """
    wait = WebDriverWait(driver, timeout)
    last_err = None
    for xpath in xpath_list:
        try:
            element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
            return element
        except Exception as e:
            last_err = e
            continue
    raise last_err or Exception("Element not found with provided XPaths")

def click_element_with_retry(driver, xpath_list, timeout=10):
    """Finds and clicks an element with alternative XPaths."""
    element = find_element_with_retry(driver, xpath_list, timeout)
    element.click()

def send_keys_with_retry(driver, xpath_list, keys, timeout=10):
    """Finds an input and types text into it."""
    element = find_element_with_retry(driver, xpath_list, timeout)
    element.clear()
    element.send_keys(keys)

def capture_screenshot(driver, step_name):
    """Saves a screenshot on failure or key step."""
    filename = f"{step_name.lower().replace(' ', '_')}_{int(time.time())}.png"
    filepath = os.path.join(SCREENSHOTS_DIR, filename)
    try:
        driver.save_screenshot(filepath)
        # Return relative path for report usability
        return os.path.join("screenshots", filename)
    except Exception as e:
        print(f"Failed to capture screenshot: {e}")
        return ""

# --- END-TO-END AUTOMATION TEST SUITE ---

def test_step_1_launch_app(driver, reporter):
    """Verify that the SkillSphereAI app launches and renders the auth screen."""
    start_time = time.time()
    try:
        # Wait for container or text specific to the Login layout
        # Checking for email/password labels or container id
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Sign In')]", 
            "//*[contains(@text, 'Access Suite')]",
            "//android.widget.EditText",
            "//*[@resource-id='auth-panel-container']"
        ], timeout=20)
        
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Launch App", "PASS", duration, "Application loaded successfully. Authentication panel is visible.")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Launch_Fail")
        reporter.add_step("Launch App", "FAIL", duration, f"Launch timed out or elements missing: {str(e)}", shot)
        pytest.fail(e)

def test_step_2_authentication_flow(driver, reporter):
    """Submit credentials and complete OTP validation bypass."""
    start_time = time.time()
    try:
        # 1. Fill email
        send_keys_with_retry(driver, [
            "//android.widget.EditText[1]", 
            "//android.widget.EditText[@text='candidate@example.com']",
            "//*[@hint='tony6250584@gmail.com']"
        ], "tony6250584@gmail.com")
        
        # 2. Fill password
        send_keys_with_retry(driver, [
            "//android.widget.EditText[2]",
            "//android.widget.EditText[@password='true']"
        ], "Candidate@123")
        
        # 3. Submit Login Form
        click_element_with_retry(driver, [
            "//*[@text='Access Suite']",
            "//*[@resource-id='btn-login-submit']",
            "//android.widget.Button[contains(@text, 'Access')]"
        ])
        
        # Check if we go to OTP verification or straight to Onboarding
        # The AuthLayout triggers registration if standard password fails, which leads to OTP screen
        # Let's check if OTP code input is rendered or Onboarding layout is shown
        time.sleep(2)  # Wait for transition
        
        # Check if OTP screen is active
        otp_elements = driver.find_elements(By.XPATH, "//*[contains(@text, 'OTP') or contains(@text, 'bypass')]")
        if otp_elements:
            print("OTP Screen active. Submitting bypass token 402921...")
            # Fill OTP field
            send_keys_with_retry(driver, [
                "//android.widget.EditText",
                "//*[@hint='402921']"
            ], "402921")
            
            # Submit OTP
            click_element_with_retry(driver, [
                "//*[@text='Validate Security Access']",
                "//*[@resource-id='btn-otp-submit']",
                "//android.widget.Button[contains(@text, 'Validate')]"
            ])
            time.sleep(2)
            
        # Verify transition to Onboarding
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Onboarding')]",
            "//*[contains(@text, 'Demographic')]",
            "//*[@resource-id='onboard-parent-container']"
        ], timeout=15)
        
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Auth_Success")
        reporter.add_step("Authentication Flow", "PASS", duration, "Credentials submitted. Logged in and reached Onboarding page.", shot)
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Auth_Fail")
        reporter.add_step("Authentication Flow", "FAIL", duration, f"Login failed: {str(e)}", shot)
        pytest.fail(e)

def test_step_3_onboarding_profile(driver, reporter):
    """Fill demographic details in Onboarding Step 1."""
    start_time = time.time()
    try:
        # Fill Name
        send_keys_with_retry(driver, [
            "//android.widget.EditText[1]",
            "//*[@text='Tony Candidate']"
        ], "Tony Candidate")
        
        # Click Proceed to Academics
        click_element_with_retry(driver, [
            "//*[@text='Proceed to Academics']",
            "//android.widget.Button[contains(@text, 'Academics')]"
        ])
        
        # Verify transition to Academics step
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Academic & Educational')]",
            "//*[contains(@text, 'College/University')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Onboarding Profile Setup", "PASS", duration, "Demographic form filled and submitted successfully.")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Profile_Setup_Fail")
        reporter.add_step("Onboarding Profile Setup", "FAIL", duration, f"Demographic step failed: {str(e)}", shot)
        pytest.fail(e)

def test_step_4_onboarding_academics(driver, reporter):
    """Fill Academic Details in Onboarding Step 2."""
    start_time = time.time()
    try:
        # College Name
        send_keys_with_retry(driver, [
            "//android.widget.EditText[1]"
        ], "National Institute of Science & Technology")
        
        # Degree
        send_keys_with_retry(driver, [
            "//android.widget.EditText[2]"
        ], "Bachelor of Technology")
        
        # Major
        send_keys_with_retry(driver, [
            "//android.widget.EditText[3]"
        ], "Software Engineering")
        
        # CGPA
        send_keys_with_retry(driver, [
            "//android.widget.EditText[4]"
        ], "8.8")
        
        # Click Next
        click_element_with_retry(driver, [
            "//*[@text='Verify and Go to Skills']",
            "//android.widget.Button[contains(@text, 'Skills')]"
        ])
        
        # Verify transition to Skills Step
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Skills matrix')]",
            "//*[contains(@text, 'compete') or contains(@text, 'Filter')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Onboarding Academics Setup", "PASS", duration, "Academic details submitted successfully.")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Academics_Setup_Fail")
        reporter.add_step("Onboarding Academics Setup", "FAIL", duration, f"Academics step failed: {str(e)}", shot)
        pytest.fail(e)

def test_step_5_onboarding_skills(driver, reporter):
    """Select skill nodes in Onboarding Step 3."""
    start_time = time.time()
    try:
        # Select React skill button
        click_element_with_retry(driver, [
            "//*[contains(@text, 'React')]",
            "//android.widget.Button[contains(@text, 'React')]"
        ])
        
        # Select Python skill button
        click_element_with_retry(driver, [
            "//*[contains(@text, 'Python')]",
            "//android.widget.Button[contains(@text, 'Python')]"
        ])
        
        # Click Proceed to Resume upload
        click_element_with_retry(driver, [
            "//*[@text='Onboard to Resume Upload']",
            "//android.widget.Button[contains(@text, 'Resume')]"
        ])
        
        # Verify transition to Resume Step
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Resume Parsing')]",
            "//*[contains(@text, 'Validate with Gemini') or contains(@text, 'Skip')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Onboarding Skills Selection", "PASS", duration, "Skills configured and verified.")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Skills_Setup_Fail")
        reporter.add_step("Onboarding Skills Selection", "FAIL", duration, f"Skills step failed: {str(e)}", shot)
        pytest.fail(e)

def test_step_6_onboarding_resume(driver, reporter):
    """Paste resume and complete onboarding to dashboard."""
    start_time = time.time()
    try:
        # Fill resume textarea
        send_keys_with_retry(driver, [
            "//android.widget.EditText",
            "//android.widget.EditText[contains(@text, 'CANDIDATE')]"
        ], "Tony Candidate. Skills: React, Python, JavaScript. GPA: 8.8. Experience: Software Developer Intern.")
        
        # Click Skip/Bypass AI to avoid live API call or complete quickly
        click_element_with_retry(driver, [
            "//*[contains(@text, 'Bypass AI') or contains(@text, 'Skip') or contains(@text, 'Complete')]",
            "//android.widget.Button[contains(@text, 'Bypass') or contains(@text, 'Skip')]"
        ])
        
        # Verify Onboarding is completed and Dashboard is loaded
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Welcome Back')]",
            "//*[contains(@text, 'employability') or contains(@text, 'Employability')]",
            "//*[contains(@text, 'Verified')]"
        ], timeout=15)
        
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Dashboard_Loaded")
        reporter.add_step("Onboarding Resume & Complete", "PASS", duration, "Resume processed, onboarding concluded. Dashboard active.", shot)
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Resume_Setup_Fail")
        reporter.add_step("Onboarding Resume & Complete", "FAIL", duration, f"Resume step failed: {str(e)}", shot)
        pytest.fail(e)

def test_step_7_dashboard_verification(driver, reporter):
    """Verify metrics and stats on the student dashboard."""
    start_time = time.time()
    try:
        # Check that employability score is visible (default fallback score is 75)
        score_element = find_element_with_retry(driver, [
            "//*[contains(@text, '72') or contains(@text, '75')]", 
            "//*[contains(@text, '%')]"
        ], timeout=10)
        
        score_text = score_element.text
        duration = int((time.time() - start_time) * 1000)
        reporter.add_step("Dashboard Verification", "PASS", duration, f"Dashboard verified. Starting Employability Score detected: {score_text}")
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Dashboard_Verify_Fail")
        reporter.add_step("Dashboard Verification", "FAIL", duration, f"Failed to verify dashboard metrics: {str(e)}", shot)
        pytest.fail(e)

def test_step_8_assessment_sandbox(driver, reporter):
    """Navigate to Scorecard -> Sandbox and test simulation launch."""
    start_time = time.time()
    try:
        # 1. Click Scorecard tab in bottom navigation
        click_element_with_retry(driver, [
            "//*[@resource-id='navigation-scorecard-tab']",
            "//*[contains(@text, 'Scorecard')]",
            "//android.widget.Button[2]"
        ])
        time.sleep(2)
        
        # 2. Click Simulation Sandbox sub-tab
        click_element_with_retry(driver, [
            "//*[contains(@text, 'Simulation') or contains(@text, 'Sandbox')]"
        ])
        time.sleep(2)
        
        # 3. Verify assessments exist (e.g. Technical Dilemmas)
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Sandbox') or contains(@text, 'Technical')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Scorecard_Sandbox")
        reporter.add_step("Simulation Sandbox", "PASS", duration, "Scorecard navigation successful. Sandbox dashboard loads correctly.", shot)
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Sandbox_Fail")
        reporter.add_step("Simulation Sandbox", "FAIL", duration, f"Failed sandbox verification: {str(e)}", shot)
        pytest.fail(e)

def test_step_9_portfolio_manager(driver, reporter):
    """Navigate to Profile -> credentials to manage projects."""
    start_time = time.time()
    try:
        # 1. Click Profile tab in bottom navigation
        click_element_with_retry(driver, [
            "//*[@resource-id='navigation-profile-tab']",
            "//*[contains(@text, 'Profile')]",
            "//android.widget.Button[3]"
        ])
        time.sleep(2)
        
        # 2. Click Credentials sub-tab
        click_element_with_retry(driver, [
            "//*[contains(@text, 'Credentials') or contains(@text, 'Portfolio')]"
        ])
        time.sleep(2)
        
        # 3. Verify credentials layout loaded
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Academic') or contains(@text, 'Portfolio') or contains(@text, 'Project')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Profile_Credentials")
        reporter.add_step("Portfolio & Credentials Manager", "PASS", duration, "Profile dashboard and experience section verified successfully.", shot)
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Profile_Verify_Fail")
        reporter.add_step("Portfolio & Credentials Manager", "FAIL", duration, f"Failed profile/portfolio validation: {str(e)}", shot)
        pytest.fail(e)

def test_step_10_portal_switches(driver, reporter):
    """Navigate to Recruiter/Admin portal and test settings changes."""
    start_time = time.time()
    try:
        # 1. Click Settings in bottom navigation
        click_element_with_retry(driver, [
            "//*[@resource-id='navigation-settings-tab']",
            "//*[contains(@text, 'Settings')]",
            "//android.widget.Button[4]"
        ])
        time.sleep(2)
        
        # Verify settings items loaded
        find_element_with_retry(driver, [
            "//*[contains(@text, 'Demo') or contains(@text, 'Save')]"
        ], timeout=10)
        
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Settings_Verified")
        reporter.add_step("Settings & Portal Switch", "PASS", duration, "Settings layout loaded. End-to-end testing lifecycle completed.", shot)
    except Exception as e:
        duration = int((time.time() - start_time) * 1000)
        shot = capture_screenshot(driver, "Settings_Verify_Fail")
        reporter.add_step("Settings & Portal Switch", "FAIL", duration, f"Failed settings validation: {str(e)}", shot)
        pytest.fail(e)
