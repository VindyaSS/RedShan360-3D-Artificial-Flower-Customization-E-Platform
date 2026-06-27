import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./AdminRevenueChart.css";

function AdminRevenueChart({ chartData }) {
  if (!chartData) return null;

  // Setup specific colors for June (peak) vs other months
  // June is normally at index 5 of [Jan, Feb, Mar, Apr, May, Jun, Jul]
  const backgroundColors = chartData.labels.map((label) =>
    label.toLowerCase() === "jun" ? "#5a3c3e" : "#eedcdb"
  );

  const hoverColors = chartData.labels.map((label) =>
    label.toLowerCase() === "jun" ? "#4a3032" : "#e5cbca"
  );

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Revenue",
        data: chartData.values,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2d2d2d",
        titleFont: { family: "Inter", size: 12, weight: "600" },
        bodyFont: { family: "Inter", size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Rs. ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9f9f9f",
          font: { family: "Inter", size: 11, weight: "600" },
          textTransform: "uppercase",
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#f1edea",
          drawTicks: false,
        },
        ticks: {
          color: "#9f9f9f",
          font: { family: "Inter", size: 11 },
          callback: function (value) {
            if (value >= 1000) {
              return `${value / 1000}k`;
            }
            return value;
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="revenue-chart-card">
      <div className="chart-card-header">
        <h3>Revenue Growth</h3>
      </div>
      <div className="revenue-chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default AdminRevenueChart;
