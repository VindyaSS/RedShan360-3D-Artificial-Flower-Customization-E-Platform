import React, { useEffect, useState } from "react";
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

// ---------------- API BASE URL ----------------
const API_BASE_URL = "http://localhost:8080/api";

export default function MOrderGraph() {

    // ---------------- STATE ----------------
    const [monthlyOrders, setMonthlyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // ---------------- FETCH MONTHLY ORDER DATA ----------------
    const fetchMonthlyOrders = async () => {

        try {

            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_BASE_URL}/dashboard/order-analytics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch order analytics: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Monthly order analytics:", data);

            setMonthlyOrders(data);

        } catch (error) {

            console.error("Monthly order analytics error:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    // ---------------- INITIAL LOAD ----------------
    useEffect(() => {
        fetchMonthlyOrders();
    }, []);


    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div
                className="tabs-container"
                style={{ padding: "24px" }}
            >
                <h3
                    style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a1a1a",
                        marginBottom: "16px"
                    }}
                >
                    Order Analytics (Monthly)
                </h3>

                <div
                    style={{
                        height: "350px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#777",
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                >
                    Loading order analytics...
                </div>
            </div>
        );
    }


    // ---------------- ERROR ----------------
    if (error) {
        return (
            <div
                className="tabs-container"
                style={{ padding: "24px" }}
            >
                <h3
                    style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a1a1a",
                        marginBottom: "16px"
                    }}
                >
                    Order Analytics (Monthly)
                </h3>

                <div
                    style={{
                        height: "350px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#777",
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                >
                    <p>{error}</p>

                    <button
                        onClick={fetchMonthlyOrders}
                        style={{
                            marginTop: "10px",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#744F51",
                            color: "#ffffff",
                            cursor: "pointer"
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    // ---------------- CHART DATA ----------------

    const data = {
        labels: monthlyOrders.map(
            (item) => item.monthName
        ),

        datasets: [
            {
                label: "Income Orders",

                data: monthlyOrders.map(
                    (item) => item.orderCount
                ),

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


    // ---------------- CHART OPTIONS ----------------

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

                grid: {
                    display: false
                },

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

                beginAtZero: true,

                grid: {
                    color: "#e5e4e7"
                },

                ticks: {
                    color: "#777",

                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        size: 11,
                        weight: "500",
                    },

                    precision: 0,
                },
            },
        },
    };


    // ---------------- RENDER ----------------

    return (
        <div
            className="tabs-container"
            style={{ padding: "24px" }}
        >

            <h3
                style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: "16px"
                }}
            >
                Order Analytics (Monthly)
            </h3>

            <div
                style={{
                    height: "350px",
                    width: "100%"
                }}
            >
                <Line
                    data={data}
                    options={options}
                />
            </div>

        </div>
    );
}