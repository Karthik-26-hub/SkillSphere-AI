import http from "http";
import { execSync, spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { CONFIG } from "./config.js";
import { runTests } from "./test_e2e.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ─── CHECK IF WEB APP IS ALREADY RUNNING ─────────────────────────────────────

function isAppRunning(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const req = http.request(
      { hostname: urlObj.hostname, port: urlObj.port || 80, path: urlObj.pathname, method: "GET" },
      () => resolve(true)
    );
    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
    req.end();
  });
}

// ─── ENSURE DEPENDENCIES INSTALLED ───────────────────────────────────────────

function ensureDependencies() {
  const nodeModulesPath = path.join(__dirname, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("[*] Installing Node.js dependencies...");
    execSync("npm install", { cwd: __dirname, stdio: "inherit" });
    console.log("[+] Dependencies installed.\n");
  }
}

// ─── MAIN ORCHESTRATOR ────────────────────────────────────────────────────────

(async () => {
  console.log("=".repeat(60));
  console.log("   SKILLSPHEREAI SELENIUM WEB TEST RUNNER");
  console.log("=".repeat(60));

  // 1. Check if app is live
  console.log(`\n[*] Checking if web app is running at: ${CONFIG.baseUrl}`);
  const appOnline = await isAppRunning(CONFIG.baseUrl);

  let devServer = null;
  if (!appOnline) {
    console.log("[!] App not running. Starting dev server automatically...");
    devServer = spawn("npm", ["run", "dev"], {
      cwd: PROJECT_ROOT,
      shell: true,
      stdio: "pipe"
    });
    devServer.stdout.on("data", (d) => process.stdout.write(`[server] ${d}`));
    devServer.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));

    // Wait up to 15 seconds for the server to respond
    let attempts = 0;
    let ready = false;
    while (attempts < 15) {
      await new Promise(r => setTimeout(r, 1000));
      ready = await isAppRunning(CONFIG.baseUrl);
      if (ready) break;
      attempts++;
      process.stdout.write(".");
    }
    console.log();

    if (!ready) {
      console.error("\n[!] Error: Web app could not be started within 15 seconds.");
      console.error("    Please start the server manually:  npm run dev");
      process.exit(1);
    }
    console.log("[+] Dev server is live.\n");
  } else {
    console.log("[+] Web application is already running.\n");
  }

  // 2. Run Selenium E2E tests
  try {
    await runTests();
  } catch (err) {
    console.error("\n[!] Fatal error during test execution:", err.message);
  } finally {
    if (devServer) {
      console.log("\n[*] Shutting down dev server...");
      devServer.kill("SIGTERM");
    }
    console.log("[+] Suite runner finished.\n");
  }
})();
