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
                    </tr>
                </thead>
                <tbody>
                    {props.completedorders?.map((completedorder) => (
                        <tr key={completedorder.orderID}>
                            <td>{completedorder.OrderID}</td>
                            <td>{completedorder.CustomerName}</td>
                            <td>{completedorder.OrderName}</td>
                            <td>{completedorder.Price}</td>
                        </tr>
                    ))}



                </tbody>
            </table>


        </>
    );
}

