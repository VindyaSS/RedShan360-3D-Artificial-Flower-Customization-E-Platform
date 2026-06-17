import React, { useState } from "react";
import '../../css/manager.css'

export default function AssignedEmployeeTable(props) {


    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr >
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th>{props.t3}</th>
                        <th colSpan="2">{props.t4}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.assignedEmployees?.map((assignedEmployee) => {
                        const isActive = assignedEmployee.WorkingStatus?.toLowerCase() === "active";
                        const isOffline = assignedEmployee.WorkingStatus?.toLowerCase() === "offline";
                        return (
                            <tr key={assignedEmployee.EmployeeName}>
                                <td>{assignedEmployee.EmployeeName}</td>
                                <td>{assignedEmployee.OrderID}</td>
                                <td>{assignedEmployee.OrderName}</td>
                                <td colSpan="2">
                                    <button className={`btn-dispatch ${isActive ? "active-status" : ""} ${isOffline ? "offline-status" : ""}`}>
                                        {assignedEmployee.WorkingStatus}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                </tbody>
            </table>


        </>
    );
}

