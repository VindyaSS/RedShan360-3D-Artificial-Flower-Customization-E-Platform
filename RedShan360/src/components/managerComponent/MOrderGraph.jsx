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
    const data = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul"
        ],
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
                        family: "Arial",
                        size: 12,
                        weight: "600",
                    },
                },
            },
            tooltip: {
                backgroundColor: "#1a1a1a",
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#777",
                },
            },
            y: {
                grid: {
                    color: "#e5e4e7",
                },
                ticks: {
                    color: "#777",
                },
            },
        },
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Order Analytics (Monthly)</h3>

            {/* IMPORTANT: fixed height container */}
            <div style={{ height: "350px", width: "100%" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}