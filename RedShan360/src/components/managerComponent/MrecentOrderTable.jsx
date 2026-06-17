import React, { useState } from "react";
import '../../css/manager.css'

export default function MrecentOrderTable(props) {


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
                    {props.Mrecentorders?.map((Mrecentorder) => (
                        <tr key={Mrecentorder.OrderID}>
                            <td>{Mrecentorder.OrderID}</td>
                            <td>{Mrecentorder.CustomerName}</td>
                            <td>{Mrecentorder.OrderName}</td>
                            <td>{Mrecentorder.Price}</td>
                        </tr>
                    ))}

                </tbody>
            </table>



        </>
    );
}

