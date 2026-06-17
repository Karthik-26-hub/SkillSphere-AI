import os
import sys
import socket
import subprocess
from config import APPIUM_SERVER_URL, DEFAULT_APK_PATH

def check_appium_server_running(url):
    """Checks if Appium server is running by attempting a socket connection to port 4723."""
    try:
        # Extract host and port from URL (e.g. http://localhost:4723)
        clean_url = url.replace("http://", "").replace("https://", "")
        parts = clean_url.split(":")
        host = parts[0]
        port = int(parts[1].split("/")[0])
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def main():
    print("=" * 60)
    print("   SKILLSPHEREAI APPIUM E2E TEST SUITE RUNNER")
    print("=" * 60)
    
    # 1. Check APK File Existence
    print(f"[*] Checking target APK file at: {DEFAULT_APK_PATH}")
    if not os.path.exists(DEFAULT_APK_PATH):
        print(f"[!] Warning: APK file was not found at the configured path!")
        print(f"    Please place the APK at: {DEFAULT_APK_PATH} or configure ANDROID_APK_PATH in .env")
    else:
        print("[+] APK file verification successful.")
        
    # 2. Check Appium Server Status
    print(f"[*] Checking Appium server connectivity on: {APPIUM_SERVER_URL}")
    server_online = check_appium_server_running(APPIUM_SERVER_URL)
    dry_run_env = os.getenv("APPIUM_DRY_RUN", "false").lower() == "true"
    
    if not server_online or dry_run_env:
        if dry_run_env:
            print("[*] Dry-run requested via environment variable.")
        else:
            print("[!] Appium Server is not reachable.")
        print("[*] Initializing test execution in Simulation Mode...")
        os.environ["APPIUM_DRY_RUN"] = "true"
    else:
        print("[+] Appium Server is ONLINE and reachable.")
        
    # 3. Launch Pytest E2E Test Suite
    print("\n[*] Initializing pytest E2E executions...")
    print("-" * 60)
    
    # Run pytest command
    cmd = [sys.executable, "-m", "pytest", "test_e2e.py", "-v", "-s"]
    try:
        result = subprocess.run(cmd, check=False)
        print("-" * 60)
        print("\n[+] Test execution completed.")
        print("[*] Generating Excel test report dashboard...")
        
        # Verify if the excel report was created
        report_file = "appium_test_report.xlsx"
        if os.path.exists(report_file):
            print(f"[+] E2E excel report generated: {os.path.abspath(report_file)}")
        else:
            print("[!] Warning: Could not locate the generated excel report file.")
            
        sys.exit(result.returncode)
    except Exception as e:
        print(f"[!] Fatal execution error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
