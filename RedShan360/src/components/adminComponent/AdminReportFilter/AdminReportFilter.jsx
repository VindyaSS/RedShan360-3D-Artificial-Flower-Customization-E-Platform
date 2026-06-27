import React from "react";
import "./AdminReportFilter.css";

function AdminReportFilter({ value, onChange }) {
  const options = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Date Range"
  ];

  return (
    <div className="report-filter-container">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4f4f4f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="filter-calendar-icon"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AdminReportFilter;
