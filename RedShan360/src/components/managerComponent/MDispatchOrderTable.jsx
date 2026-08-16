import React from "react";
import "../../css/manager.css";

export default function MDispatchOrderTable(props) {

    const dispatchedorders = Array.isArray(props.dispatchedorders)
        ? props.dispatchedorders
        : [];

    // ---------------- Render ----------------
    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                    </tr>
                </thead>

                <tbody>
                    {dispatchedorders.length > 0 ? (
                        dispatchedorders.map((dispatchedorder) => (
                            <tr key={dispatchedorder.orderId}>
                                <td>{dispatchedorder.orderId}</td>
                                <td>{dispatchedorder.customerName}</td>
                                <td>{dispatchedorder.totalAmount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                                No Dispatched Orders Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}