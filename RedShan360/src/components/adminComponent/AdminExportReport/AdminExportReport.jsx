import React, { useState } from "react";
import { AdminReportService } from "../../../services/AdminReportService";
import "./AdminExportReport.css";

function AdminExportReport({ period }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await AdminReportService.exportPDFReport(period);
      if (res.success) {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className={`export-report-btn ${exporting ? "loading" : ""}`}
      onClick={handleExport}
      disabled={exporting}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="export-icon"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>{exporting ? "Exporting..." : "Export PDF"}</span>
    </button>
  );
}

export default AdminExportReport;
