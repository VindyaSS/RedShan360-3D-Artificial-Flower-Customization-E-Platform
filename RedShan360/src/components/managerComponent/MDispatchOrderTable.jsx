import React from "react";
import { Inbox, Truck } from "lucide-react";
import "../../css/manager.css";

export default function MDispatchOrderTable(props) {
    const dispatchedorders = Array.isArray(props.dispatchedorders)
        ? props.dispatchedorders
        : [];
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
                    {dispatchedorders.length > 0 ? (
                        dispatchedorders.map((dispatchedorder, index) => (
                            <tr key={dispatchedorder?.orderId ?? `dispatched-order-${index}`}>
                                <td style={{ fontWeight: "600", color: "#744F51" }}>
                                    {dispatchedorder?.orderId ? `#RS-000${dispatchedorder.orderId}` : "-"}
                                </td>
                                <td>{dispatchedorder?.customerName ?? "-"}</td>
                                <td style={{ fontWeight: "700" }}>
                                    {dispatchedorder?.totalAmount != null
                                        ? `Rs. ${Number(dispatchedorder.totalAmount).toFixed(2)}`
                                        : "-"}
                                </td>
                                <td>
                                    <span className="order-status-badge badge-dispatched">
                                        <Truck size={12} />
                                        {dispatchedorder?.orderStatus || "DISPATCHED_TO_COURIER"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">
                                <div className="empty-state-box">
                                    <Inbox size={32} />
                                    <h4>No Dispatched Orders Found</h4>
                                    <p>
                                        {searchQuery
                                            ? `No orders match "${searchQuery}"`
                                            : "There are currently no orders dispatched to courier."}
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