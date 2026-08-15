import React, { useEffect } from "react";
import "../../css/manager.css";

export default function MDispatchOrderTable(props) {

    const dispatchedorders = Array.isArray(
        props.dispatchedorders
    )
        ? props.dispatchedorders
        : [];


    // ============================================================
    // DEBUG LOGS
    // ============================================================

    useEffect(() => {

        console.log(
            "=================================================="
        );

        console.log(
            "🟣 [MDispatchOrderTable] Component loaded"
        );

        console.log(
            "🟣 [MDispatchOrderTable] Dispatched orders received:",
            dispatchedorders
        );

        console.log(
            "🟣 [MDispatchOrderTable] Number of dispatched orders:",
            dispatchedorders.length
        );

        dispatchedorders.forEach((dispatchedorder, index) => {

            console.log(
                `🟣 [MDispatchOrderTable] Dispatched Order ${index + 1}:`,
                {
                    orderId: dispatchedorder.orderId,
                    customerName: dispatchedorder.customerName,
                    totalAmount: dispatchedorder.totalAmount,
                    orderStatus: dispatchedorder.orderStatus
                }
            );

        });

        console.log(
            "=================================================="
        );

    }, [props.dispatchedorders]);


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

                            <tr
                                key={dispatchedorder.orderId}
                            >

                                <td>
                                    {dispatchedorder.orderId}
                                </td>

                                <td>
                                    {dispatchedorder.customerName}
                                </td>

                                <td>
                                    {dispatchedorder.totalAmount}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="3"
                                style={{
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >
                                No Dispatched Orders Found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>
        </>
    );
}