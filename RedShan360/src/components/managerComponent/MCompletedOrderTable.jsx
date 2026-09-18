import React, { useEffect, useState } from "react";
import "../../css/manager.css";

// ---------------- API Base URL ----------------
const API_BASE_URL = "http://localhost:8080/api";

export default function MCompletedOrderTable(props) {
    console.log('[MCompletedOrderTable] Props received:', props);

    const completedorders = Array.isArray(props.completedorders)
        ? props.completedorders
        : [];

    // ---------------- State ----------------
    const [dispatchingOrderId, setDispatchingOrderId] = useState(null);

    // ---------------- Dispatch Order to Courier ----------------
    const handleDispatch = async (order) => {
        const orderId = order?.orderId;

        // Validate order ID before proceeding
        if (!orderId) {
            alert("Cannot dispatch order. Order ID is missing.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to dispatch Order #${orderId} to the courier?`
        );

        if (!confirmed) return;

        try {
            setDispatchingOrderId(orderId);

            const dispatchURL = `${API_BASE_URL}/orders/${orderId}/dispatch`;

            const response = await fetch(dispatchURL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            // ---------------- Handle Error Response ----------------
            if (!response.ok) {
                let errorMessage = `Failed to dispatch order. HTTP ${response.status}`;

                try {
                    const errorData = await response.json();
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Response body is not JSON, use generic message
                }

                throw new Error(errorMessage);
            }

            // ---------------- Handle Success Response ----------------
            const updatedOrder = await response.json();
            console.log('[MCompletedOrderTable] handleDispatch - Status:', response.status, '| Data:', updatedOrder);

            // Verify backend returned the expected status
            if (updatedOrder?.orderStatus !== "DISPATCHED_TO_COURIER") {
                throw new Error("Order was updated with an unexpected status.");
            }

            // Notify parent to refresh order lists
            if (typeof props.onOrderDispatched === "function") {
                await props.onOrderDispatched(updatedOrder);
            }

            alert(`Order #${updatedOrder.orderId} has been dispatched to the courier.`);

        } catch (error) {
            alert(error?.message || "Failed to dispatch order.");
        } finally {
            setDispatchingOrderId(null);
        }
    };

    // ---------------- Render ----------------
    return (
        <div className="table-scroll-wrapper">
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                        <th colSpan="2">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {completedorders.length > 0 ? (
                        completedorders.map((completedorder, index) => (
                            <tr key={completedorder?.orderId ?? `completed-order-${index}`}>
                                <td>{completedorder?.orderId ?? "-"}</td>
                                <td>{completedorder?.customerName ?? "-"}</td>
                                <td>{completedorder?.totalAmount ?? "-"}</td>
                                <td colSpan="2">
                                    <button
                                        className="btn-dispatch"
                                        disabled={dispatchingOrderId === completedorder?.orderId}
                                        onClick={() => handleDispatch(completedorder)}
                                    >
                                        {dispatchingOrderId === completedorder?.orderId
                                            ? "Dispatching..."
                                            : "Dispatching to Courier"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                No Completed Orders Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}