import os
import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter


class AppiumExcelReporter:
    def __init__(self, output_path="appium_test_report.xlsx"):
        self.output_path = output_path
        self.steps = []
        self.start_time = datetime.datetime.now()

    def add_step(self, test_case_id, module, description, status,
                 duration_ms, details="", screenshot_path=None):
        """
        Record a test step result.
        :param test_case_id:   e.g. 'TC_001'
        :param module:         e.g. 'Authentication'
        :param description:    Human-readable test description
        :param status:         'PASS' or 'FAIL'
        :param duration_ms:    Execution duration in milliseconds
        :param details:        Extra log context or error message
        :param screenshot_path: Relative path to screenshot file
        """
        self.steps.append({
            "timestamp":      datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "test_case_id":   test_case_id,
            "module":         module,
            "description":    description,
            "status":         status.upper(),
            "duration_ms":    duration_ms,
            "details":        details,
            "screenshot":     screenshot_path or "",
        })

    def generate_report(self):
        """Compile and write results into a professionally styled Excel spreadsheet."""
        wb = Workbook()

        # ── SHEETS ──────────────────────────────────────────────────────────────
        ws_summary = wb.active
        ws_summary.title = "Summary Dashboard"
        ws_details = wb.create_sheet(title="Test Details")

        # ── PALETTE & STYLES ────────────────────────────────────────────────────
        FF = "Segoe UI"

        font_title   = Font(name=FF, size=16, bold=True,  color="1F4E79")
        font_section = Font(name=FF, size=12, bold=True,  color="2C3E50")
        font_header  = Font(name=FF, size=11, bold=True,  color="FFFFFF")
        font_bold    = Font(name=FF, size=10, bold=True)
        font_reg     = Font(name=FF, size=10)
        font_detail  = Font(name=FF, size=9,  italic=True, color="555555")

        fill_header  = PatternFill("solid", fgColor="1F4E79")
        fill_zebra   = PatternFill("solid", fgColor="F2F7FA")
        fill_pass    = PatternFill("solid", fgColor="D4EDDA")
        fill_fail    = PatternFill("solid", fgColor="F8D7DA")
        fill_accent  = PatternFill("solid", fgColor="E9ECEF")

        thin  = Side(border_style="thin",   color="D3D3D3")
        thick = Side(border_style="medium", color="1F4E79")
        b_all = Border(left=thin, right=thin, top=thin, bottom=thin)
        b_hdr = Border(left=thin, right=thin, top=thin, bottom=thick)

        ctr  = Alignment(horizontal="center", vertical="center")
        lft  = Alignment(horizontal="left",   vertical="center")
        rgt  = Alignment(horizontal="right",  vertical="center")

        # ── SUMMARY DASHBOARD ───────────────────────────────────────────────────
        end_time    = datetime.datetime.now()
        total_dur   = end_time - self.start_time
        total       = len(self.steps)
        passed      = sum(1 for s in self.steps if s["status"] == "PASS")
        failed      = total - passed
        pass_rate   = (passed / total * 100) if total > 0 else 0.0

        ws_summary.merge_cells("A1:E1")
        ws_summary["A1"] = "SkillSphereAI — Appium Mobile E2E Test Report"
        ws_summary["A1"].font = font_title
        ws_summary["A1"].alignment = lft
        ws_summary.row_dimensions[1].height = 42

        ws_summary["A3"] = "Execution Summary & KPIs"
        ws_summary["A3"].font = font_section
        ws_summary.row_dimensions[3].height = 26

        metrics = [
            ("Execution Start",   self.start_time.strftime("%Y-%m-%d %H:%M:%S")),
            ("Execution End",     end_time.strftime("%Y-%m-%d %H:%M:%S")),
            ("Total Duration",    f"{total_dur.total_seconds():.2f} seconds"),
            ("Total Test Cases",  total),
            ("Cases Passed",      passed),
            ("Cases Failed",      failed),
            ("Pass Rate",         f"{pass_rate:.1f}%"),
        ]

        row = 4
        for label, value in metrics:
            lc = ws_summary.cell(row=row, column=1, value=label)
            lc.font = font_bold; lc.alignment = lft
            lc.fill = fill_accent; lc.border = b_all

            vc = ws_summary.cell(row=row, column=2, value=value)
            vc.font = font_reg; vc.alignment = lft; vc.border = b_all

            if label == "Pass Rate":
                vc.font = Font(name=FF, size=10, bold=True,
                               color="2E7D32" if pass_rate >= 80 else "C62828")
                vc.fill = fill_pass if pass_rate >= 80 else fill_fail
            elif label == "Cases Failed" and failed > 0:
                vc.font = Font(name=FF, size=10, bold=True, color="C62828")
                vc.fill = fill_fail
            elif label == "Cases Passed" and passed > 0:
                vc.font = Font(name=FF, size=10, bold=True, color="2E7D32")

            ws_summary.row_dimensions[row].height = 22
            row += 1

        ws_summary.column_dimensions["A"].width = 22
        ws_summary.column_dimensions["B"].width = 30

        # ── TEST DETAILS SHEET ──────────────────────────────────────────────────
        headers = ["No.", "TC ID", "Module", "Test Description",
                   "Status", "Duration (ms)", "Execution Log", "Screenshot"]

        for ci, h in enumerate(headers, 1):
            c = ws_details.cell(row=1, column=ci, value=h)
            c.font = font_header; c.fill = fill_header
            c.alignment = ctr; c.border = b_hdr
        ws_details.row_dimensions[1].height = 28

        for ri, step in enumerate(self.steps, 2):
            is_even = ri % 2 == 0
            row_bg  = fill_zebra if is_even else PatternFill()

            def cell(col, val, align=lft):
                c = ws_details.cell(row=ri, column=col, value=val)
                c.alignment = align; c.border = b_all
                if step["status"] not in ("PASS", "FAIL"):
                    c.fill = row_bg
                return c

            cell(1, ri - 1, ctr)
            cell(2, step["test_case_id"], ctr)
            cell(3, step["module"])
            cell(4, step["description"])

            sc = ws_details.cell(row=ri, column=5, value=step["status"])
            sc.alignment = ctr; sc.border = b_all
            if step["status"] == "PASS":
                sc.fill = fill_pass
                sc.font = Font(name=FF, size=10, bold=True, color="155724")
            else:
                sc.fill = fill_fail
                sc.font = Font(name=FF, size=10, bold=True, color="721C24")

            cell(6, step["duration_ms"], rgt)

            dc = ws_details.cell(row=ri, column=7, value=step["details"])
            dc.alignment = lft; dc.border = b_all
            dc.font = (Font(name=FF, size=9, bold=True, color="721C24")
                       if step["status"] == "FAIL" else font_detail)

            sc2 = ws_details.cell(row=ri, column=8, value=step["screenshot"])
            sc2.alignment = lft; sc2.border = b_all; sc2.font = font_detail

            ws_details.row_dimensions[ri].height = 20

        # Auto-fit columns
        col_widths = [6, 10, 24, 52, 10, 14, 55, 35]
        for i, w in enumerate(col_widths, 1):
            ws_details.column_dimensions[get_column_letter(i)].width = w

        wb.save(self.output_path)
        print(f"\n[+] Excel report saved -> {os.path.abspath(self.output_path)}")


if __name__ == "__main__":
    r = AppiumExcelReporter("self_test_report.xlsx")
    r.add_step("TC_001", "Authentication",  "App launches and auth panel renders",       "PASS", 850,  "Auth screen detected.")
    r.add_step("TC_002", "Authentication",  "Email field is visible",                    "PASS", 320,  "EditText[1] found.")
    r.add_step("TC_006", "Authentication",  "Valid email entered",                       "PASS", 480,  "tony6250584@gmail.com typed.")
    r.add_step("TC_013", "Onboarding",      "Demographics screen visible",               "PASS", 600,  "Onboarding container rendered.")
    r.add_step("TC_066", "Scorecard",       "Scorecard tab navigated",                   "FAIL", 1200, "Tab not found within timeout.", "screenshots/tc066_fail.png")
    r.generate_report()
