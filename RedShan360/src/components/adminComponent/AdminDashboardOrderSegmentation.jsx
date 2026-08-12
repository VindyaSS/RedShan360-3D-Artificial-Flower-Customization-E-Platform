import "./AdminDashboardOrderSegmentation.css";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

function AdminDashboardOrderSegmentation({ data, loading }) {
  // Extract statuses or fall back to mock
  const seg = data?.orderSegmentation || { completed: 60, processing: 20, pending: 15, cancelled: 5 };
  const efficiency = data?.orderEfficiency !== undefined ? data.orderEfficiency : 92;

  // Calculate percentages
  const total = (Number(seg.completed) || 0) + (Number(seg.processing) || 0) + (Number(seg.pending) || 0) + (Number(seg.cancelled) || 0);
  const chartDataValues = total > 0
    ? [
        Math.round((Number(seg.completed) * 100) / total),
        Math.round((Number(seg.processing) * 100) / total),
        Math.round((Number(seg.pending) * 100) / total),
        Math.round((Number(seg.cancelled) * 100) / total)
      ]
    : [100, 0, 0, 0];

  const chartData = {
    labels: ["Completed", "Processing", "Pending", "Cancelled"],
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: ["#27ae60", "#f39c12", "#2980b9", "#c0392b"],
        borderWidth: 2,
        cutout: "70%", // thinner ring for donut
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className={`order-segmentation-card ${loading ? "loading" : ""}`}>
      <h3>Order Segmentation</h3>
      <div className="donut-wrapper">
        <Doughnut data={chartData} options={options} />
      </div>
      <p className="efficiency">{efficiency}% Efficiency</p>
    </div>
  );
}

export default AdminDashboardOrderSegmentation;
