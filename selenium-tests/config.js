import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BASE_DIR = __dirname;
export const SCREENSHOTS_DIR = path.join(BASE_DIR, "screenshots");

// Create screenshots directory if it does not exist
import fs from "fs";
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

export const CONFIG = {
  baseUrl: process.env.TEST_URL || "http://localhost:3000",
  browser: process.env.TEST_BROWSER || "chrome",
  headless: (process.env.TEST_HEADLESS || "false").toLowerCase() === "true",
  timeout: parseInt(process.env.TEST_TIMEOUT || "15000", 10),
  reportPath: path.join(BASE_DIR, "selenium_test_report.xlsx")
};
