import "./AdminDashboardCharts.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function AdminDashboardCharts() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 15000, 14000, 22000, 20000, 28000],
        borderColor: "#8a6365",
        backgroundColor: "rgba(138, 99, 101, 0.05)",
        tension: 0.45,
        fill: false,
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
        titleFont: { family: "Inter", size: 12 },
        bodyFont: { family: "Inter", size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9f9f9f",
          font: { family: "Inter", size: 11, weight: "500" },
        },
        border: {
          display: false,
        }
      },
      y: {
        grid: {
          color: "#f1edea",
          drawTicks: false,
        },
        ticks: {
          color: "#9f9f9f",
          font: { family: "Inter", size: 11 },
          stepSize: 5000,
        },
        border: {
          display: false,
        }
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: "#8a6365",
        borderWidth: 2,
        borderColor: "#ffffff",
      },
      line: {
        borderWidth: 3.5,
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-block">
          <h3>Monthly Sales Overview</h3>
          <p>Revenue performance over the last 6 months</p>
        </div>
        <div className="chart-actions">
          <button className="chart-btn outline">Export PDF</button>
          <button className="chart-btn solid">View Detail</button>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default AdminDashboardCharts;
