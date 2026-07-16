import React, { useState } from "react";
import '../../css/manager.css'

export default function MPendingOrderTable(props) {


    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr >
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                        <th>{props.t4}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.orders?.map((order) => (
                        <tr key={order.OrderID}>
                            <td>{order.OrderID}</td>
                            <td>{order.CustomerName}</td>
                            <td>{order.ItemName}</td>
                            <td>{order.Price}</td>
                        </tr>
                    ))}

                </tbody>
            </table>



        </>
    );
}

