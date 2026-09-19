import React from "react";
import { Inbox, Clock } from "lucide-react";
import "../../css/manager.css";

export default function MPendingOrderTable(props) {
    const orders = Array.isArray(props.orders) ? props.orders : [];
    const searchQuery = props.searchQuery || "";

    // ---------------- Render ----------------
    return (
        <div className="table-scroll-wrapper">
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1 || "Order ID"}</th>
                        <th>{props.t2 || "Customer Name"}</th>
                        <th>{props.t3 || "Price"}</th>
                        <th>{props.t4 || "Status"}</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={order?.orderId ?? `pending-order-${index}`}>
                                <td style={{ fontWeight: "600", color: "#744F51" }}>
                                    {order?.orderId ? `#RS-000${order.orderId}` : "-"}
                                </td>
                                <td>{order?.customerName ?? "-"}</td>
                                <td style={{ fontWeight: "700" }}>
                                    {order?.totalAmount != null
                                        ? `Rs. ${Number(order.totalAmount).toFixed(2)}`
                                        : "-"}
                                </td>
                                <td>
                                    <span className="order-status-badge badge-pending">
                                        <Clock size={12} />
                                        {order?.orderStatus || "PRE_ORDER"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">
                                <div className="empty-state-box">
                                    <Inbox size={32} />
                                    <h4>No Pre Orders Found</h4>
                                    <p>
                                        {searchQuery
                                            ? `No orders match "${searchQuery}"`
                                            : "There are currently no pre-orders waiting."}
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