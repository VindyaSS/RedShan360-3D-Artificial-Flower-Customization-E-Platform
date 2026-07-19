import React, { useState, useEffect } from "react";
import SideNavigation from '../../components/managerComponent/sideNavigation';
import '../../css/manager.css'
import AssignedEmployeeTable from "../../components/managerComponent/AssignedEmployeeTable";
import UnAssignedEmployeeTable from "../../components/managerComponent/UnAssignedEmployeeTable";
import MPreOrderModal from "../../components/managerComponent/mPreOrderModal";
import api from '../../services/api';

export default function MmanageEmployees() {
    const [assignedEmployees, setAssignedEmployees] = useState([
        {
            EmployeeName: "John",
            OrderID: "ORD001",
            WorkingStatus: "Active",
        },

        {
            EmployeeName: "Kamal",
            OrderID: "ORD002",
            WorkingStatus: "Offline",
        },

        {
            EmployeeName: "Nimal",
            OrderID: "ORD003",
            WorkingStatus: "Active",
        },
    ]);

    const [unAssignedEmployees, setUnAssignedEmployees] = useState([]);

    const [preOrders, setPreOrders] = useState([]);

    const fetchPreOrders = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/orders");
            const mappedData = response.data.map(item => ({
                OrderID: item.OrderID !== undefined ? item.OrderID : item.orderId,
                CustomerName: item.CustomerName !== undefined ? item.CustomerName : item.customerName,
                OrderName: item.OrderName !== undefined ? item.OrderName : (item.itemName || ""),
                Price: item.Price !== undefined ? item.Price : (typeof item.price === "number" ? `Rs.${item.price}` : (item.price || "")),
                Type: item.Type !== undefined ? item.Type : item.type,
                FlowerType: item.FlowerType !== undefined ? item.FlowerType : (item.flowerType || ""),
                ColorHex: item.ColorHex !== undefined ? item.ColorHex : (item.colorHex || ""),
                ColorTheme: item.ColorTheme !== undefined ? item.ColorTheme : (item.colorTheme || ""),
                WrappingPaper: item.WrappingPaper !== undefined ? item.WrappingPaper : (item.wrappingPaper || ""),
                RibbonAccent: item.RibbonAccent !== undefined ? item.RibbonAccent : (item.ribbonAccent || ""),
                CardMessage: item.CardMessage !== undefined ? item.CardMessage : (item.cardMessage || ""),
                Contact: item.Contact !== undefined ? item.Contact : (item.contact || ""),
                ShippingMethod: item.ShippingMethod !== undefined ? item.ShippingMethod : (item.shippingMethod || ""),
            }));
            setPreOrders(mappedData);
            console.log("Fetched and Mapped Pre Orders:", mappedData);
        } catch (error) {
            console.error("Error fetching pre orders:", error);
        }
    };

    const fetchUnAssignedEmployees = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/employees/not-assigned");

            const employees = response.data.map(emp => ({
                employeeId: emp.employeeId,
                userId: emp.userId,
                EmployeeName: emp.employeeName
            }));

            setUnAssignedEmployees(employees);

            console.log("Unassigned Employees :", employees);

        } catch (error) {
            console.error("Error fetching unassigned employees :", error);
        }
    };

    useEffect(() => {
        fetchPreOrders();
        fetchUnAssignedEmployees();
    }, []);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAssignClick = (employee) => {
        console.log("emp ", employee)
        setSelectedEmployee(employee);
    };

    const handleAssignOrder = async (selectedEmployee, order) => {
        console.log("Employee:", selectedEmployee.employeeId);
        console.log("Order:", order.OrderID);

        try {
            await api.post("http://localhost:8080/api/employees/assign-order", {
                employeeId: selectedEmployee.employeeId,
                orderId: order.OrderID
            });

            setUnAssignedEmployees(prev =>
                prev.filter(emp => emp.employeeId !== selectedEmployee.employeeId)
            );

            setAssignedEmployees(prev => [
                ...prev,
                {
                    employeeId: selectedEmployee.employeeId,
                    OrderID: order.OrderID,
                    WorkingStatus: "Not yet Start Work"
                }
            ]);

            setPreOrders(prev =>
                prev.filter(po => po.OrderID !== order.OrderID)
            );

            setSelectedEmployee(null);

            alert("Order assigned successfully!");

        } catch (error) {
            console.error(error);
            alert("Failed to assign order.");
        }
    };

    return (
        <>
            <div className="MPage">
                <div className="Mpart1">
                    <SideNavigation />
                </div>
                <div className="Mpart2">
                    <div className="dashboard-row">
                        <div className="tabs-container" style={{ padding: "24px", flex: 1 }}>
                            <h3 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "#1a1a1a",
                                marginBottom: "16px"
                            }}>
                                Assigned Employees
                            </h3>
                            <AssignedEmployeeTable
                                t1="Employee Name"
                                t2="Order ID"
                                t3="Working Status"
                                assignedEmployees={assignedEmployees}
                            />
                        </div>
                    </div>

                    <div className="dashboard-row">
                        <div className="tabs-container" style={{ padding: "24px", flex: 1 }}>
                            <h3 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "#1a1a1a",
                                marginBottom: "16px"
                            }}>
                                Unassigned Employees
                            </h3>
                            <UnAssignedEmployeeTable
                                t1="Employee Name"
                                t2="Action"
                                unAssignedEmployees={unAssignedEmployees}
                                onAssignClick={handleAssignClick}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <MPreOrderModal
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                employee={selectedEmployee}
                preOrders={preOrders}
                onAssign={handleAssignOrder}
            />
        </>
    );
}