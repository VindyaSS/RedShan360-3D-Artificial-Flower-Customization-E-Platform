import React, { useState } from "react";
import '../../css/manager.css'

export default function UnAssignedEmployeeTable(props) {


    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr >
                        <th>{props.t1}</th>

                        <th colSpan="2">{props.t2 || "Action"}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.unAssignedEmployees?.map((unAssignedEmployee) => (
                        <tr key={unAssignedEmployee.EmployeeName}>
                            <td>{unAssignedEmployee.EmployeeName}</td>

                            <td colSpan="2">
                                <button 
                                    className="btn-dispatch"
                                    onClick={() => props.onAssignClick && props.onAssignClick(unAssignedEmployee.EmployeeName)}
                                >
                                    Assign For Order
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>


        </>
    );
}

