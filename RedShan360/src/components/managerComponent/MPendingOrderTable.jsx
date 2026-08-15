import React, { useEffect } from "react";
import "../../css/manager.css";

export default function MPendingOrderTable(props) {

    const orders = Array.isArray(props.orders)
        ? props.orders
        : [];


    // ============================================================
    // DEBUG
    // ============================================================

    useEffect(() => {

        console.log("");
        console.log(
            "=================================================="
        );

        console.log(
            "🟤 [MPendingOrderTable] RENDERED"
        );

        console.log(
            "🟤 [MPendingOrderTable] orders:",
            orders
        );

        console.log(
            "🟤 [MPendingOrderTable] count:",
            orders.length
        );


        orders.forEach((order, index) => {

            console.log(
                `🟤 [MPendingOrderTable] ACTUAL ORDER ${index + 1}:`,
                order
            );

            console.log(
                `🟤 [MPendingOrderTable] ORDER ${index + 1} VALUES:`,
                {
                    orderId: order?.orderId,
                    customerName: order?.customerName,
                    totalAmount: order?.totalAmount,
                    orderStatus: order?.orderStatus
                }
            );

        });


        console.log(
            "=================================================="
        );

    }, [props.orders]);


    // ============================================================
    // TABLE
    // ============================================================

    return (

        <table className="MPtable">

            <thead>

                <tr>

                    <th>{props.t1}</th>

                    <th>{props.t2}</th>

                    <th>{props.t3}</th>

                </tr>

            </thead>


            <tbody>

                {orders.length > 0 ? (

                    orders.map((order, index) => (

                        <tr
                            key={
                                order?.orderId ??
                                `pending-order-${index}`
                            }
                        >

                            <td>
                                {order?.orderId ?? "-"}
                            </td>

                            <td>
                                {order?.customerName ?? "-"}
                            </td>

                            <td>
                                {order?.totalAmount != null
                                    ? Number(
                                        order.totalAmount
                                    ).toFixed(2)
                                    : "-"
                                }
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
                            No Pre Orders Found
                        </td>

                    </tr>

                )}

            </tbody>

        </table>

    );
}