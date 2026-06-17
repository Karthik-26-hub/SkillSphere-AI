import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export class SeleniumExcelReporter {
  constructor(outputPath = "selenium_test_report.xlsx") {
    this.outputPath = outputPath;
    this.steps = [];
    this.startTime = new Date();
  }

  /**
   * Log a test step.
   * @param {string} stepName Name of the action/step
   * @param {string} status 'PASS' or 'FAIL'
   * @param {number} durationMs Execution duration in milliseconds
   * @param {string} details Optional execution details or error logs
   * @param {string} screenshotPath Path to visual screenshot
   */
  addStep(stepName, status, durationMs, details = "", screenshotPath = "") {
    const timestampStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    this.steps.push({
      timestamp: timestampStr,
      stepName,
      status: status.toUpperCase(),
      durationMs,
      details,
      screenshot: screenshotPath
    });
  }

  /**
   * Compiles the recorded steps into a beautifully styled Excel workbook using exceljs.
   */
  async generateReport() {
    const workbook = new ExcelJS.Workbook();
    
    // Create worksheets
    const wsSummary = workbook.addWorksheet("Summary Dashboard", {
      views: [{ showGridLines: true }]
    });
    const wsDetails = workbook.addWorksheet("Test Details", {
      views: [{ showGridLines: true }]
    });

    // Formatting Tokens
    const fontFamily = "Segoe UI";
    
    const styleTitle = { name: fontFamily, size: 16, bold: true, color: { argb: "FF1F4E79" } };
    const styleSection = { name: fontFamily, size: 12, bold: true, color: { argb: "FF2C3E50" } };
    const styleHeader = { name: fontFamily, size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    const styleBold = { name: fontFamily, size: 10, bold: true };
    const styleRegular = { name: fontFamily, size: 10 };
    const styleDetails = { name: fontFamily, size: 9, italic: true, color: { argb: "FF555555" } };
    
    const fillHeader = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } }; // Deep Teal
    const fillZebra = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F7FA" } };  // Light Blue-Gray
    const fillPass = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD4EDDA" } };   // Soft Green
    const fillFail = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8D7DA" } };   // Soft Red
    const fillAccent = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE9ECEF" } }; // Neutral Gray Accent
    
    const borderThinSide = { style: "thin", color: { argb: "FFD3D3D3" } };
    const borderAll = {
      top: borderThinSide,
      left: borderThinSide,
      bottom: borderThinSide,
      right: borderThinSide
    };
    
    const borderHeader = {
      top: borderThinSide,
      left: borderThinSide,
      bottom: { style: "medium", color: { argb: "FF1F4E79" } },
      right: borderThinSide
    };

    const alignCenter = { horizontal: "center", vertical: "middle" };
    const alignLeft = { horizontal: "left", vertical: "middle" };
    const alignRight = { horizontal: "right", vertical: "middle" };

    // --- 1. BUILD SUMMARY DASHBOARD ---
    const endTime = new Date();
    const totalTimeSec = ((endTime.getTime() - this.startTime.getTime()) / 1000).toFixed(2);
    const totalSteps = this.steps.length;
    const passedSteps = this.steps.filter(s => s.status === "PASS").length;
    const failedSteps = this.steps.filter(s => s.status === "FAIL").length;
    const passRate = totalSteps > 0 ? ((passedSteps / totalSteps) * 100).toFixed(1) : "0.0";

    // Title Row
    wsSummary.mergeCells("A1:D1");
    const titleCell = wsSummary.getCell("A1");
    titleCell.value = "SkillSphereAI Web E2E Test Report";
    titleCell.font = styleTitle;
    titleCell.alignment = alignLeft;
    wsSummary.getRow(1).height = 40;

    wsSummary.getRow(2).height = 10; // spacing row

    // Section header
    const sectionCell = wsSummary.getCell("A3");
    sectionCell.value = "Test Summary & Performance Indicators";
    sectionCell.font = styleSection;
    wsSummary.getRow(3).height = 25;

    // Metrics Data
    const metrics = [
      ["Execution Start", this.startTime.toISOString().replace("T", " ").substring(0, 19)],
      ["Execution End", endTime.toISOString().replace("T", " ").substring(0, 19)],
      ["Total Duration", `${totalTimeSec} seconds`],
      ["Total Test Steps", totalSteps],
      ["Steps Passed", passedSteps],
      ["Steps Failed", failedSteps],
      ["Pass Rate", `${passRate}%`]
    ];

    let summaryRow = 4;
    for (const [metricName, val] of metrics) {
      const nameCell = wsSummary.getCell(`A${summaryRow}`);
      nameCell.value = metricName;
      nameCell.font = styleBold;
      nameCell.alignment = alignLeft;
      nameCell.fill = fillAccent;
      nameCell.border = borderAll;

      const valCell = wsSummary.getCell(`B${summaryRow}`);
      valCell.value = val;
      valCell.font = styleRegular;
      valCell.alignment = alignLeft;
      valCell.border = borderAll;

      // Conditional formatting for summary indicators
      if (metricName === "Pass Rate") {
        valCell.font = { name: fontFamily, size: 10, bold: true, color: { argb: parseFloat(passRate) >= 80 ? "FF2E7D32" : "FFC62828" } };
        valCell.fill = parseFloat(passRate) >= 80 ? fillPass : fillFail;
      } else if (metricName === "Steps Failed" && failedSteps > 0) {
        valCell.font = { name: fontFamily, size: 10, bold: true, color: { argb: "FFC62828" } };
        valCell.fill = fillFail;
      } else if (metricName === "Steps Passed" && passedSteps > 0) {
        valCell.font = { name: fontFamily, size: 10, bold: true, color: { argb: "FF2E7D32" } };
      }

      wsSummary.getRow(summaryRow).height = 20;
      summaryRow++;
    }

    // --- 2. BUILD DETAILS SHEET ---
    const headers = ["No.", "Timestamp", "Step Name", "Status", "Duration (ms)", "Execution Details", "Screenshot Path"];
    const headerRow = wsDetails.getRow(1);
    headerRow.height = 26;

    for (let i = 0; i < headers.length; i++) {
      const cell = headerRow.getCell(i + 1);
      cell.value = headers[i];
      cell.font = styleHeader;
      cell.fill = fillHeader;
      cell.alignment = alignCenter;
      cell.border = borderHeader;
    }

    let detailRowIdx = 2;
    for (const step of this.steps) {
      const r = wsDetails.getRow(detailRowIdx);
      r.height = 20;

      r.getCell(1).value = detailRowIdx - 1;
      r.getCell(1).alignment = alignCenter;

      r.getCell(2).value = step.timestamp;
      r.getCell(2).alignment = alignCenter;

      r.getCell(3).value = step.stepName;
      r.getCell(3).alignment = alignLeft;

      const statusCell = r.getCell(4);
      statusCell.value = step.status;
      statusCell.alignment = alignCenter;
      if (step.status === "PASS") {
        statusCell.fill = fillPass;
        statusCell.font = { name: fontFamily, size: 10, bold: true, color: { argb: "FF155724" } };
      } else {
        statusCell.fill = fillFail;
        statusCell.font = { name: fontFamily, size: 10, bold: true, color: { argb: "FF721C24" } };
      }

      r.getCell(5).value = step.durationMs;
      r.getCell(5).alignment = alignRight;

      const detailsCell = r.getCell(6);
      detailsCell.value = step.details;
      detailsCell.alignment = alignLeft;
      if (step.status === "FAIL") {
        detailsCell.font = { name: fontFamily, size: 9, bold: true, color: { argb: "FF721C24" } };
      } else {
        detailsCell.font = styleDetails;
      }

      r.getCell(7).value = step.screenshot;
      r.getCell(7).alignment = alignLeft;
      r.getCell(7).font = styleDetails;

      // Apply borders & zebra striping
      for (let c = 1; c <= 7; c++) {
        const cell = r.getCell(c);
        cell.border = borderAll;
        if (detailRowIdx % 2 === 1 && step.status !== "PASS" && step.status !== "FAIL") {
          cell.fill = fillZebra;
        }
      }

      detailRowIdx++;
    }

    // --- AUTO-FIT COLUMNS ---
    wsSummary.columns.forEach(col => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: false }, cell => {
        const valStr = cell.value ? String(cell.value) : "";
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      });
      col.width = Math.max(maxLen + 3, 12);
    });

    wsDetails.columns.forEach(col => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: false }, cell => {
        const valStr = cell.value ? String(cell.value) : "";
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      });
      col.width = Math.max(maxLen + 3, 12);
    });

    // Custom overrides for widths
    wsSummary.getColumn(1).width = 25;
    wsSummary.getColumn(2).width = 30;
    wsDetails.getColumn(6).width = 50;
    wsDetails.getColumn(7).width = 40;

    await workbook.xlsx.writeFile(this.outputPath);
    console.log(`Excel test analysis report compiled: ${path.resolve(this.outputPath)}`);
  }
}

// Self-test execution guard
if (process.argv[1] && process.argv[1].endsWith("reporter.js")) {
  (async () => {
    const reporter = new SeleniumExcelReporter("self_test_report.xlsx");
    reporter.addStep("Launch Browser", "PASS", 740, "Chrome browser launched and pointed to homepage.");
    reporter.addStep("Enter Logins", "PASS", 1100, "Successfully authenticated as Candidate User.");
    reporter.addStep("Run Assessment", "FAIL", 1450, "Assertion Error: Scores didn't increment by 10 points on client dashboard.", "screenshots/fail_step_3.png");
    await reporter.generateReport();
    if (fs.existsSync("self_test_report.xlsx")) {
      fs.unlinkSync("self_test_report.xlsx");
      console.log("Self test report verified and cleaned up.");
    }
  })();
}
