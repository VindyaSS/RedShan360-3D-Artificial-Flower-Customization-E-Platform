import React, { useState, useEffect } from "react";
import "./AdminDashboardCharts.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { AdminReportService } from "../../services/AdminReportService";

function AdminDashboardCharts() {
  const [salesData, setSalesData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchSales = async () => {
      try {
        const data = await AdminReportService.getMonthlySalesOverview();
        if (active) {
          setSalesData(data);
        }
      } catch (err) {
        console.error("Failed to load monthly sales overview", err);
      }
    };

    fetchSales();

    return () => {
      active = false;
    };
  }, []);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await AdminReportService.exportPDFReport("last30days");
    } catch (err) {
      console.error("Failed to export report PDF", err);
    } finally {
      setExporting(false);
    }
  };

  // Prepare chart labels and dataset
  const chartLabels = salesData.length > 0 ? salesData.map(d => d.month) : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartValues = salesData.length > 0 ? salesData.map(d => d.revenue) : [12000, 15000, 14000, 22000, 20000, 28000];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Revenue",
        data: chartValues,
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
        callbacks: {
          label: (context) => `Rs. ${Number(context.raw).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        }
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
          callback: (value) => `Rs. ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
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
          <button 
            className="chart-btn outline" 
            onClick={handleExportPDF} 
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
          <button className="chart-btn solid" onClick={() => setShowModal(true)}>
            View Detail
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>

      {/* View Detail Modal */}
      {showModal && (
        <div className="report-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <div>
                <h2>Monthly Sales Details Report</h2>
                <p className="subtitle">Luxury Artificial Flower Business Analytics Summary</p>
              </div>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <div className="report-table-wrapper">
              <table className="report-details-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="num">Revenue</th>
                    <th className="num">Total Orders</th>
                    <th className="num">Completed Orders</th>
                    <th className="num">Avg Order Value (AOV)</th>
                    <th>Growth Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((row, idx) => {
                    const prevRow = idx > 0 ? salesData[idx - 1] : null;
                    const revenue = Number(row.revenue);
                    const ordersCount = Number(row.ordersCount);
                    const completedOrdersCount = Number(row.completedOrdersCount);
                    
                    // Calc AOV
                    const aov = ordersCount > 0 ? (revenue / ordersCount) : 0;
                    
                    // Calc Trend/Growth status
                    let growthStr = "Baseline";
                    let trendClass = "baseline";
                    if (prevRow) {
                      const prevRevenue = Number(prevRow.revenue);
                      if (prevRevenue > 0) {
                        const pct = ((revenue - prevRevenue) / prevRevenue) * 100;
                        if (pct > 0) {
                          growthStr = `+${pct.toFixed(1)}% Growth`;
                          trendClass = "positive";
                        } else if (pct < 0) {
                          growthStr = `${pct.toFixed(1)}% Decline`;
                          trendClass = "negative";
                        } else {
                          growthStr = "Stable";
                          trendClass = "neutral";
                        }
                      } else if (revenue > 0) {
                        growthStr = "+100% Growth";
                        trendClass = "positive";
                      } else {
                        growthStr = "Stable";
                        trendClass = "neutral";
                      }
                    }

                    return (
                      <tr key={idx}>
                        <td className="month-name">{row.month}</td>
                        <td className="num font-semibold">Rs. {revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="num">{ordersCount.toLocaleString()}</td>
                        <td className="num">{completedOrdersCount.toLocaleString()}</td>
                        <td className="num font-medium">Rs. {aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>
                          <span className={`trend-tag ${trendClass}`}>{growthStr}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="report-modal-footer">
              <div className="info-block">
                <span>* Generated from live PostgreSQL database</span>
                <span>* Formatted in Sri Lankan Rupees (Rs.)</span>
              </div>
              <div className="action-block">
                <button 
                  className="chart-btn outline" 
                  onClick={handleExportPDF} 
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Download PDF Report"}
                </button>
                <button className="chart-btn solid" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardCharts;
