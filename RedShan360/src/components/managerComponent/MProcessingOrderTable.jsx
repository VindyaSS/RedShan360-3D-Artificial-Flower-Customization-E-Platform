import React from "react";
import { Inbox, Loader2 } from "lucide-react";
import "../../css/manager.css";

export default function MProcessingOrderTable(props) {
    const processingorders = Array.isArray(props.processingorders)
        ? props.processingorders
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
                    {processingorders.length > 0 ? (
                        processingorders.map((processingorder, index) => (
                            <tr key={processingorder?.orderId ?? `processing-order-${index}`}>
                                <td style={{ fontWeight: "600", color: "#744F51" }}>
                                    {processingorder?.orderId ? `#RS-000${processingorder.orderId}` : "-"}
                                </td>
                                <td>{processingorder?.customerName ?? "-"}</td>
                                <td style={{ fontWeight: "700" }}>
                                    {processingorder?.totalAmount != null
                                        ? `Rs. ${Number(processingorder.totalAmount).toFixed(2)}`
                                        : "-"}
                                </td>
                                <td>
                                    <span className="order-status-badge badge-processing">
                                        <Loader2 size={12} className="animate-spin" />
                                        {processingorder?.orderStatus || "PROCESSING"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">
                                <div className="empty-state-box">
                                    <Inbox size={32} />
                                    <h4>No Processing Orders Found</h4>
                                    <p>
                                        {searchQuery
                                            ? `No orders match "${searchQuery}"`
                                            : "There are currently no orders in processing."}
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