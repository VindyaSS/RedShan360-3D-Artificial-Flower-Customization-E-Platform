import React, { useState } from "react";
import '../../css/manager.css'

export default function MProcessingOrderTable(props) {


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
                    {props.processingorders?.map((processingorder) => (
                        <tr key={processingorder.OrderID}>
                            <td>{processingorder.OrderID}</td>
                            <td>{processingorder.CustomerName}</td>
                            <td>{processingorder.OrderName}</td>
                            <td>{processingorder.Price}</td>
                        </tr>
                    ))}

                </tbody>
            </table>



        </>
    );
}

