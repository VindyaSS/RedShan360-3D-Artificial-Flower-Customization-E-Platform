import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// ---------------- Register Chart.js Components ----------------
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function MOrderGraph() {

    // ---------------- Chart Data ----------------
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Income Orders",
                data: [30, 45, 40, 60, 50, 75, 80, 70],
                fill: true,
                backgroundColor: "rgba(116, 79, 81, 0.08)",
                borderColor: "#744F51",
                borderWidth: 2,
                pointBackgroundColor: "#744F51",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
            },
        ],
    };

    // ---------------- Chart Options ----------------
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#555",
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 12,
                        weight: "600",
                    },
                },
            },
            tooltip: {
                backgroundColor: "#744F51",
                titleFont: {
                    family: "'Plus Jakarta Sans', sans-serif",
                    size: 13,
                    weight: "600",
                },
                bodyFont: {
                    family: "'Plus Jakarta Sans', sans-serif",
                    size: 12,
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "#777",
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 11,
                        weight: "500",
                    },
                },
            },
            y: {
                grid: { color: "#e5e4e7" },
                ticks: {
                    color: "#777",
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 11,
                        weight: "500",
                    },
                },
            },
        },
    };

    // ---------------- Render ----------------
    return (
        <div className="tabs-container" style={{ padding: "24px" }}>
            <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "16px",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "16px"
            }}>
                Order Analytics (Monthly)
            </h3>

            {/* Fixed height container required by Chart.js */}
            <div style={{ height: "350px", width: "100%" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}