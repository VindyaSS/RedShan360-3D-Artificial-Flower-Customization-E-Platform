import React, { useState } from "react";
import '../../css/manager.css'

export default function MworkingEmployeeTable(props) {


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
                    {props.MworkingEmployees?.map((MworkingEmployee) => (
                        <tr key={MworkingEmployee.OrderID}>
                            <td>{MworkingEmployee.EmployeeName}</td>
                            <td>{MworkingEmployee.OrderID}</td>
                            <td>{MworkingEmployee.OrderName}</td>
                            <td>{MworkingEmployee.Price}</td>
                        </tr>
                    ))}

                </tbody>
            </table>



        </>
    );
}

