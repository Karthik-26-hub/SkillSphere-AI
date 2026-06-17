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

// ─── CHECK IF WEB APP IS ALIVE VIA HEALTH ENDPOINT ───────────────────────────

async function isServerHealthy(baseUrl, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const url = new URL("/api/health", baseUrl);
    const req = http.request(
      { hostname: url.hostname, port: url.port || 80, path: url.pathname, method: "GET" },
      (res) => resolve(res.statusCode === 200)
    );
    req.on("error", () => resolve(false));
    req.setTimeout(timeoutMs, () => { req.destroy(); resolve(false); });
    req.end();
  });
}

// ─── KILL ENTIRE PROCESS TREE (Linux-safe) ───────────────────────────────────

function killProcessTree(pid) {
  try {
    // On Linux: kill the entire process group to catch npm → tsx child processes
    process.kill(-pid, "SIGTERM");
  } catch {
    try { process.kill(pid, "SIGTERM"); } catch { /* already dead */ }
  }
}

// ─── ENSURE DEPENDENCIES INSTALLED ───────────────────────────────────────────

function ensureDependencies() {
  const nodeModulesPath = path.join(__dirname, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("[*] Installing Selenium suite Node.js dependencies...");
    execSync("npm install", { cwd: __dirname, stdio: "inherit" });
    console.log("[+] Dependencies installed.\n");
  }
}

// ─── MAIN ORCHESTRATOR ────────────────────────────────────────────────────────

(async () => {
  console.log("=".repeat(60));
  console.log("   SKILLSPHEREAI SELENIUM WEB TEST RUNNER");
  console.log("=".repeat(60));

  ensureDependencies();

  // 1. Check if the server is already running (CI pre-starts it)
  const baseUrl = CONFIG.baseUrl;
  console.log(`\n[*] Checking server health at: ${baseUrl}/api/health`);
  const alreadyRunning = await isServerHealthy(baseUrl);

  let devServer = null;
  let devServerPid = null;

  if (!alreadyRunning) {
    console.log("[!] Server not running. Starting dev server automatically...");
    devServer = spawn("npm", ["run", "dev"], {
      cwd: PROJECT_ROOT,
      shell: false,                     // ← false so spawn creates a real process (not shell wrapper)
      detached: true,                   // ← detached so we can kill the whole process group
      stdio: ["ignore", "pipe", "pipe"]
    });

    devServerPid = devServer.pid;
    devServer.stdout.on("data", (d) => process.stdout.write(`[server] ${d}`));
    devServer.stderr.on("data", (d) => process.stderr.write(`[server] ${d}`));
    devServer.on("error", (err) => console.error("[server] Spawn error:", err));

    // Wait up to 120 seconds for the server to be healthy (Vite can be slow on CI)
    const MAX_WAIT_SECONDS = 120;
    const POLL_INTERVAL_MS = 2000;
    let elapsed = 0;
    let ready = false;

    console.log(`[*] Waiting up to ${MAX_WAIT_SECONDS}s for server health check...`);
    while (elapsed < MAX_WAIT_SECONDS * 1000) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
      elapsed += POLL_INTERVAL_MS;
      ready = await isServerHealthy(baseUrl);
      if (ready) break;
      process.stdout.write(`  [${Math.floor(elapsed / 1000)}s] Waiting...`);
      console.log();
    }

    if (!ready) {
      console.error(`\n[!] Server did not become healthy within ${MAX_WAIT_SECONDS} seconds.`);
      if (devServerPid) killProcessTree(devServerPid);
      process.exit(1);
    }
    console.log("[+] Dev server is live and healthy.\n");
  } else {
    console.log("[+] Server is already running (CI pre-started mode).\n");
  }

  // 2. Run Selenium E2E tests
  let exitCode = 0;
  try {
    await runTests();
  } catch (err) {
    console.error("\n[!] Fatal error during test execution:", err.message);
    exitCode = 1;
  } finally {
    if (devServer && devServerPid) {
      console.log("\n[*] Shutting down dev server (process tree)...");
      killProcessTree(devServerPid);
    }
    console.log("[+] Suite runner finished.\n");
  }

  process.exit(exitCode);
})();
