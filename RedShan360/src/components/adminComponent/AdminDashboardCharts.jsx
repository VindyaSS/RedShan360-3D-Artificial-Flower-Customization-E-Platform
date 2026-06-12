import "./AdminDashboardCharts.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function AdminDashboardCharts() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 15000, 18000, 22000, 25000, 28000],
        borderColor: "#7a5255",
        backgroundColor: "rgba(122,82,85,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Revenue performance over the last 6 months</h3>
      <Line data={data} />
    </div>
  );
}

export default AdminDashboardCharts;
