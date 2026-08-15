import React, { useEffect } from "react";
import "../../css/manager.css";

export default function MProcessingOrderTable(props) {

    const processingorders = Array.isArray(
        props.processingorders
    )
        ? props.processingorders
        : [];


    // ============================================================
    // DEBUG LOGS
    // ============================================================

    useEffect(() => {

        console.log(
            "=================================================="
        );

        console.log(
            "🔵 [MProcessingOrderTable] Component loaded"
        );

        console.log(
            "🔵 [MProcessingOrderTable] Processing orders received:",
            processingorders
        );

        console.log(
            "🔵 [MProcessingOrderTable] Number of processing orders:",
            processingorders.length
        );

        processingorders.forEach((processingorder, index) => {

            console.log(
                `🔵 [MProcessingOrderTable] Processing Order ${index + 1}:`,
                {
                    orderId: processingorder.orderId,
                    customerName: processingorder.customerName,
                    totalAmount: processingorder.totalAmount,
                    orderStatus: processingorder.orderStatus
                }
            );

        });

        console.log(
            "=================================================="
        );

    }, [props.processingorders]);


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

                    {processingorders.length > 0 ? (

                        processingorders.map((processingorder) => (

                            <tr
                                key={processingorder.orderId}
                            >

                                <td>
                                    {processingorder.orderId}
                                </td>

                                <td>
                                    {processingorder.customerName}
                                </td>

                                <td>
                                    {processingorder.totalAmount}
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
                                No Processing Orders Found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>
        </>
    );
}