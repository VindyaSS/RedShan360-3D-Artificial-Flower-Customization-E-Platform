import React from "react";
import "../../css/manager.css";

export default function MrecentOrderTable({
    t1 = "Order ID",
    t2 = "Customer Name",
    t3 = "Price",
    Mrecentorders = []
}) {

    return (
        <div className="table-scroll-wrapper">
        <table className="MPtable">

            <thead>
                <tr>
                    <th>{t1}</th>
                    <th>{t2}</th>
                    <th>{t3}</th>
                </tr>
            </thead>

            <tbody>

                {Mrecentorders.length > 0 ? (

                    Mrecentorders.map((order) => (

                        <tr key={order.orderId}>

                            <td>
                                {order.orderId}
                            </td>

                            <td>
                                {order.customerName}
                            </td>

                            <td>
                                {order.price}
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
                            No recent orders found.
                        </td>
                    </tr>

                )}

            </tbody>

        </table>
        </div>
    );
}