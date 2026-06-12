import React, { useState } from "react";
import '../../css/manager.css'

export default function MDispatchOrderTable(props) {


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
                    {props.dispatchedorders?.map((dispatchedorder) => (
                        <tr key={dispatchedorder.orderID}>
                            <td>{dispatchedorder.OrderID}</td>
                            <td>{dispatchedorder.CustomerName}</td>
                            <td>{dispatchedorder.OrderName}</td>
                            <td>{dispatchedorder.Price}</td>
                        </tr>
                    ))}

                </tbody>
            </table>



        </>
    );
}

