import React from "react";
import "../../css/manager.css";

export default function MProcessingOrderTable(props) {
    console.log('[MProcessingOrderTable] Props received:', props);

    const processingorders = Array.isArray(props.processingorders)
        ? props.processingorders
        : [];

    // ---------------- Render ----------------
    return (
        <>
            <div className="table-scroll-wrapper">
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                    </tr>
                </thead>

                <tbody>
                    {processingorders.length > 0 ? (
                        processingorders.map((processingorder) => (
                            <tr key={processingorder.orderId}>
                                <td>{processingorder.orderId}</td>
                                <td>{processingorder.customerName}</td>
                                <td>{processingorder.totalAmount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                                No Processing Orders Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </>
    );
}