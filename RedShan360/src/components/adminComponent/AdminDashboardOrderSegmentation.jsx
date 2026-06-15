import "./AdminDashboardOrderSegmentation.css";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

function AdminDashboardOrderSegmentation() {
  const data = {
    labels: ["Completed", "Processing", "Pending", "Cancelled"],
    datasets: [
      {
        data: [60, 20, 15, 5],
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
    <div className="order-segmentation-card">
      <h3>Order Segmentation</h3>
      <div className="donut-wrapper">
        <Doughnut data={data} options={options} />
      </div>
      <p className="efficiency">92% Efficiency</p>
    </div>
  );
}

export default AdminDashboardOrderSegmentation;
