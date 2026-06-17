import os
from dotenv import load_dotenv

# Load any local environment variable overrides
load_dotenv()

# Base directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "screenshots")

# Ensure screenshots directory exists
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

# Default APK Path
DEFAULT_APK_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR, 
        "..", 
        "..", 
        "app-apk-8d47256be9a147d0a03820e61a4a1af4-1780248160.apk"
    )
)

# If APK isn't found in parent downloads, fall back to current directory or environment variables
if not os.path.exists(DEFAULT_APK_PATH):
    # Try alternate location in case the file was moved
    alternate_path = os.path.join(BASE_DIR, "app.apk")
    if os.path.exists(alternate_path):
        DEFAULT_APK_PATH = alternate_path

# Appium Connection Settings
APPIUM_SERVER_URL = os.getenv("APPIUM_SERVER_URL", "http://localhost:4723")

# Appium Capabilities (UiAutomator2 Options for Android)
APPIUM_CAPABILITIES = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": os.getenv("ANDROID_DEVICE_NAME", "Android Device"),
    "app": os.getenv("ANDROID_APK_PATH", DEFAULT_APK_PATH),
    "appPackage": os.getenv("ANDROID_APP_PACKAGE", "app.netlify.app"),
    "appActivity": os.getenv("ANDROID_APP_ACTIVITY", "app.netlify.app.MainActivity"),
    "noReset": os.getenv("ANDROID_NO_RESET", "false").lower() == "true",
    "autoGrantPermissions": True,
    "newCommandTimeout": 300,
}
