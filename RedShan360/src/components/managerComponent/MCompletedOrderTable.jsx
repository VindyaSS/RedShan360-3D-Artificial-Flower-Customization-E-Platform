import React, { useState } from "react";
import '../../css/manager.css'

export default function MCompletedOrderTable(props) {


    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr >
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                        <th>{props.t4}</th>
                        <th colSpan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {props.completedorders?.map((completedorder) => (
                        <tr key={completedorder.orderID}>
                            <td>{completedorder.OrderID}</td>
                            <td>{completedorder.CustomerName}</td>
                            <td>{completedorder.ItemName}</td>
                            <td>{completedorder.Price}</td>
                            <td colSpan="2">
                                <button className="btn-dispatch">Dispatching to Courier</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>


        </>
    );
}

