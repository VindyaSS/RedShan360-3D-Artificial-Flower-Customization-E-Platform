import React from "react";
import '../../css/manager.css';

export default function AssignedEmployeeTable(props) {
    return (
        <>
            <table className="MPtable">
                <thead>
                    <tr>
                        <th>{props.t1}</th>
                        <th>{props.t2}</th>
                        <th colSpan="2">{props.t3}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.assignedEmployees?.map((assignedEmployee) => {
                        const status = assignedEmployee.WorkingStatus || "Not yet Start Work";
                        const isActive = status.toLowerCase() === "active";
                        const isOffline = status.toLowerCase() === "offline";
                        const isNotStarted = status.toLowerCase() === "not yet start work";

                        return (
                            <tr key={assignedEmployee.EmployeeName}>
                                <td>{assignedEmployee.EmployeeName}</td>
                                <td>{assignedEmployee.OrderID}</td>
                                <td colSpan="2">
                                    <button className={`btn-dispatch ${isActive ? "active-status" : ""} ${isOffline ? "offline-status" : ""} ${isNotStarted ? "not-started-status" : ""}`}>
                                        {status}
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
