import React, { useState } from "react";
import { Inbox, Truck, CheckCircle2, Loader2 } from "lucide-react";
import "../../css/manager.css";

// ---------------- API Base URL ----------------
const API_BASE_URL = "http://localhost:8080/api";

export default function MCompletedOrderTable(props) {
    const completedorders = Array.isArray(props.completedorders)
        ? props.completedorders
        : [];
    const searchQuery = props.searchQuery || "";

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
            `Are you sure you want to dispatch Order #RS-000${orderId} to the courier?`
        );

        if (!confirmed) return;

        try {
            setDispatchingOrderId(orderId);

            const dispatchURL = `${API_BASE_URL}/orders/${orderId}/dispatch`;
            const token = localStorage.getItem('token');

            const response = await fetch(dispatchURL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
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

            // Verify backend returned the expected status
            if (updatedOrder?.orderStatus !== "DISPATCHED_TO_COURIER") {
                throw new Error("Order was updated with an unexpected status.");
            }

            // Notify parent to refresh order lists
            if (typeof props.onOrderDispatched === "function") {
                await props.onOrderDispatched(updatedOrder);
            }

            alert(`Order #RS-000${updatedOrder.orderId} has been dispatched to the courier.`);

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
                        <th>{props.t1 || "Order ID"}</th>
                        <th>{props.t2 || "Customer Name"}</th>
                        <th>{props.t3 || "Price"}</th>
                        <th>{props.t4 || "Address"}</th>
                        <th>{props.t5 || "Phone"}</th>
                        <th>{props.t6 || "Status"}</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {completedorders.length > 0 ? (
                        completedorders.map((completedorder, index) => (
                            <tr key={completedorder?.orderId ?? `completed-order-${index}`}>
                                <td style={{ fontWeight: "600", color: "#744F51" }}>
                                    {completedorder?.orderId ? `#RS-000${completedorder.orderId}` : "-"}
                                </td>
                                <td>{completedorder?.customerName ?? "-"}</td>
                                <td style={{ fontWeight: "700" }}>
                                    {completedorder?.totalAmount != null
                                        ? `Rs. ${Number(completedorder.totalAmount).toFixed(2)}`
                                        : "-"}
                                </td>
                                <td style={{ minWidth: "200px", whiteSpace: "normal", wordBreak: "break-word" }}>
                                    {completedorder?.address ?? "-"}
                                </td>
                                <td>{completedorder?.phone ?? "-"}</td>
                                <td>
                                    <span className="order-status-badge badge-completed">
                                        <CheckCircle2 size={12} />
                                        {completedorder?.orderStatus || "COMPLETED"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-dispatch"
                                        disabled={dispatchingOrderId === completedorder?.orderId}
                                        onClick={() => handleDispatch(completedorder)}
                                        style={{ gap: "6px" }}
                                    >
                                        {dispatchingOrderId === completedorder?.orderId ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Dispatching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Truck size={14} />
                                                <span>Dispatch to Courier</span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">
                                <div className="empty-state-box">
                                    <Inbox size={32} />
                                    <h4>No Completed Orders Found</h4>
                                    <p>
                                        {searchQuery
                                            ? `No orders match "${searchQuery}"`
                                            : "There are currently no completed orders ready for dispatch."}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}