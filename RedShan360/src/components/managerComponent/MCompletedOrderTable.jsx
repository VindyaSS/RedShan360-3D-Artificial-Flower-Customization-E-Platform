import React, { useEffect, useState } from "react";
import "../../css/manager.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function MCompletedOrderTable(props) {

    const completedorders = Array.isArray(
        props.completedorders
    )
        ? props.completedorders
        : [];


    // ============================================================
    // STATE
    // ============================================================

    const [dispatchingOrderId, setDispatchingOrderId] =
        useState(null);


    // ============================================================
    // DEBUG LOGS
    // ============================================================

    useEffect(() => {

        console.log(
            "=================================================="
        );

        console.log(
            "[MCompletedOrderTable] Component loaded"
        );

        console.log(
            "[MCompletedOrderTable] Completed orders received:",
            completedorders
        );

        console.log(
            "[MCompletedOrderTable] Number of completed orders:",
            completedorders.length
        );


        completedorders.forEach(
            (completedorder, index) => {

                console.log(
                    `[MCompletedOrderTable] Completed Order ${
                        index + 1
                    }:`,
                    {
                        orderId:
                            completedorder?.orderId,

                        customerName:
                            completedorder?.customerName,

                        totalAmount:
                            completedorder?.totalAmount,

                        orderStatus:
                            completedorder?.orderStatus
                    }
                );

            }
        );


        console.log(
            "=================================================="
        );

    }, [props.completedorders]);


    // ============================================================
    // DISPATCH BUTTON
    // ============================================================

    const handleDispatch = async (order) => {

        console.log("");
        console.log(
            "=================================================="
        );

        console.log(
            "[DISPATCH BUTTON] Clicked"
        );

        console.log(
            "[DISPATCH BUTTON] Selected order:",
            order
        );


        const orderId = order?.orderId;


        // --------------------------------------------------------
        // CHECK ORDER ID
        // --------------------------------------------------------

        if (!orderId) {

            console.error(
                "[DISPATCH BUTTON] Order ID is missing"
            );

            alert(
                "Cannot dispatch order. Order ID is missing."
            );

            return;
        }


        console.log(
            "[DISPATCH BUTTON] Order ID:",
            orderId
        );


        // --------------------------------------------------------
        // CONFIRMATION
        // --------------------------------------------------------

        const confirmed = window.confirm(
            `Are you sure you want to dispatch Order #${orderId} to the courier?`
        );


        if (!confirmed) {

            console.log(
                "[DISPATCH BUTTON] User cancelled"
            );

            return;
        }


        try {

            // ----------------------------------------------------
            // LOADING
            // ----------------------------------------------------

            setDispatchingOrderId(orderId);


            // ----------------------------------------------------
            // API URL
            // ----------------------------------------------------

            const dispatchURL =
                `${API_BASE_URL}/orders/${orderId}/dispatch`;


            console.log(
                "[DISPATCH BUTTON] API URL:",
                dispatchURL
            );

            console.log(
                "[DISPATCH BUTTON] Method: PUT"
            );

            console.log(
                "[DISPATCH BUTTON] Body: NONE"
            );


            // ----------------------------------------------------
            // API CALL
            // ----------------------------------------------------

            const response = await fetch(
                dispatchURL,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


            console.log(
                "[DISPATCH BUTTON] Response status:",
                response.status
            );

            console.log(
                "[DISPATCH BUTTON] Response OK:",
                response.ok
            );


            // ----------------------------------------------------
            // ERROR RESPONSE
            // ----------------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    `Failed to dispatch order. HTTP ${response.status}`;


                try {

                    const errorData =
                        await response.json();

                    console.error(
                        "[DISPATCH BUTTON] Backend error:",
                        errorData
                    );


                    if (errorData?.message) {

                        errorMessage =
                            errorData.message;

                    }

                } catch (error) {

                    console.error(
                        "[DISPATCH BUTTON] Error response is not JSON:",
                        error
                    );

                }


                throw new Error(
                    errorMessage
                );
            }


            // ----------------------------------------------------
            // SUCCESS RESPONSE
            // ----------------------------------------------------

            const updatedOrder =
                await response.json();


            console.log(
                "[DISPATCH BUTTON] Backend response:",
                updatedOrder
            );


            console.log(
                "[DISPATCH BUTTON] Updated order ID:",
                updatedOrder?.orderId
            );

            console.log(
                "[DISPATCH BUTTON] Updated status:",
                updatedOrder?.orderStatus
            );


            // ----------------------------------------------------
            // VERIFY BACKEND STATUS
            // ----------------------------------------------------

            if (
                updatedOrder?.orderStatus !==
                "DISPATCHED_TO_COURIER"
            ) {

                console.error(
                    "[DISPATCH BUTTON] Unexpected backend status:",
                    updatedOrder?.orderStatus
                );

                throw new Error(
                    "Order was updated with an unexpected status."
                );
            }


            console.log(
                "[DISPATCH BUTTON] SUCCESS"
            );

            console.log(
                "[DISPATCH BUTTON] Order is now DISPATCHED_TO_COURIER"
            );


            // ----------------------------------------------------
            // INFORM PARENT COMPONENT
            // ----------------------------------------------------

            if (
                typeof props.onOrderDispatched ===
                "function"
            ) {

                console.log(
                    "[DISPATCH BUTTON] Calling parent refresh..."
                );


                await props.onOrderDispatched(
                    updatedOrder
                );

            }


            alert(
                `Order #${updatedOrder.orderId} has been dispatched to the courier.`
            );


        } catch (error) {

            console.error(
                "[DISPATCH BUTTON] ERROR:",
                error
            );


            alert(
                error?.message ||
                "Failed to dispatch order."
            );

        } finally {

            setDispatchingOrderId(null);


            console.log(
                "[DISPATCH BUTTON] Request finished"
            );

            console.log(
                "=================================================="
            );

        }

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <table className="MPtable">

            <thead>

                <tr>

                    <th>
                        {props.t1}
                    </th>

                    <th>
                        {props.t2}
                    </th>

                    <th>
                        {props.t3}
                    </th>

                    <th colSpan="2">
                        Action
                    </th>

                </tr>

            </thead>


            <tbody>

                {completedorders.length > 0 ? (

                    completedorders.map(
                        (completedorder, index) => (

                            <tr
                                key={
                                    completedorder?.orderId ??
                                    `completed-order-${index}`
                                }
                            >

                                <td>
                                    {
                                        completedorder?.orderId ??
                                        "-"
                                    }
                                </td>


                                <td>
                                    {
                                        completedorder?.customerName ??
                                        "-"
                                    }
                                </td>


                                <td>
                                    {
                                        completedorder?.totalAmount ??
                                        "-"
                                    }
                                </td>


                                <td colSpan="2">

                                    <button
                                        className="btn-dispatch"

                                        disabled={
                                            dispatchingOrderId ===
                                            completedorder?.orderId
                                        }

                                        onClick={() =>
                                            handleDispatch(
                                                completedorder
                                            )
                                        }
                                    >

                                        {
                                            dispatchingOrderId ===
                                            completedorder?.orderId

                                                ? "Dispatching..."

                                                : "Dispatching to Courier"
                                        }

                                    </button>

                                </td>

                            </tr>

                        )
                    )

                ) : (

                    <tr>

                        <td
                            colSpan="5"
                            style={{
                                textAlign: "center",
                                padding: "20px"
                            }}
                        >

                            No Completed Orders Found

                        </td>

                    </tr>

                )}

            </tbody>

        </table>

    );
}