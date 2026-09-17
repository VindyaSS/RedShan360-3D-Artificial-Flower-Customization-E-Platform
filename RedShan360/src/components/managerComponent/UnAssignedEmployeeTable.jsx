import React from "react";
import '../../css/manager.css';

export default function UnAssignedEmployeeTable(props) {
    console.log('[UnAssignedEmployeeTable] Props received:', props);
    return (
        <>
            <div className="table-scroll-wrapper">
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1}</th>
                        <th colSpan="2">{props.t2 || "Action"}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.unAssignedEmployees?.map((unAssignedEmployee) => (
                        <tr key={unAssignedEmployee.employeeId}>
                            <td>{unAssignedEmployee.EmployeeName}</td>
                            <td colSpan="2">
                                <button
                                    className="btn-dispatch"
                                    onClick={() => props.onAssignClick && props.onAssignClick(unAssignedEmployee)}
                                >
                                    Assign For Order
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    );
}
