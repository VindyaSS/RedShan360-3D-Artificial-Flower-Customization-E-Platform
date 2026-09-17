import React, { useState, useEffect } from "react";
import SideNavigation from '../../components/managerComponent/sideNavigation';
import '../../css/manager.css';
import AssignedEmployeeTable from "../../components/managerComponent/AssignedEmployeeTable";
import UnAssignedEmployeeTable from "../../components/managerComponent/UnAssignedEmployeeTable";
import MPreOrderModal from "../../components/managerComponent/mPreOrderModal";
import api from '../../services/api';

// ---------------- MANAGE EMPLOYEES PAGE ----------------
export default function MmanageEmployees() {

    // ---------------- STATE ----------------
    const [unAssignedEmployees, setUnAssignedEmployees] = useState([]);
    const [preOrders, setPreOrders] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // ---------------- FETCH UNASSIGNED ORDERS ----------------
    const fetchPreOrders = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/orders/unassigned");
            console.log('[ManageEmployees] fetchPreOrders - Status:', response.status, '| Data:', response.data);
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
        } catch (error) {
            // Failed to load pre orders
        }
    };

    // ---------------- FETCH ASSIGNED EMPLOYEES ----------------
    const fetchAssignedEmployees = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/employees/assigned");
            console.log('[ManageEmployees] fetchAssignedEmployees - Status:', response.status, '| Data:', response.data);

            const employees = response.data.map(emp => ({
                employeeId: emp.employeeId,
                EmployeeName: emp.employeeName,
                OrderID: emp.orderId,
                WorkingStatus: emp.workingStatus
            }));

            setAssignedEmployees(employees);

        } catch (error) {
            // Failed to load assigned employees
        }
    };

    // ---------------- FETCH UNASSIGNED EMPLOYEES ----------------
    const fetchUnAssignedEmployees = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/employees/not-assigned");
            console.log('[ManageEmployees] fetchUnAssignedEmployees - Status:', response.status, '| Data:', response.data);

            const employees = response.data.map(emp => ({
                employeeId: emp.employeeId,
                userId: emp.userId,
                EmployeeName: emp.employeeName
            }));

            setUnAssignedEmployees(employees);

        } catch (error) {
            // Failed to load unassigned employees
        }
    };

    // ---------------- INITIAL LOAD ----------------
    useEffect(() => {
        fetchPreOrders();
        fetchUnAssignedEmployees();
        fetchAssignedEmployees();
    }, []);

    // ---------------- ASSIGN CLICK HANDLER ----------------
    const handleAssignClick = (employee) => {
        setSelectedEmployee(employee);
    };

    // ---------------- ASSIGN ORDER TO EMPLOYEE ----------------
    const handleAssignOrder = async (selectedEmployee, order) => {

        try {
            await api.post("http://localhost:8080/api/employees/assign-order", {
                employeeId: selectedEmployee.employeeId,
                orderId: order.OrderID
            });

            // Remove the assigned employee from the unassigned list
            setUnAssignedEmployees(prev =>
                prev.filter(emp => emp.employeeId !== selectedEmployee.employeeId)
            );

            // Add the employee to the assigned list with their new order
            setAssignedEmployees(prev => [
                ...prev,
                {
                    employeeId: selectedEmployee.employeeId,
                    OrderID: order.OrderID,
                    WorkingStatus: "Not yet Start Work"
                }
            ]);

            // Remove the order from the pending pre-orders list
            setPreOrders(prev =>
                prev.filter(po => po.OrderID !== order.OrderID)
            );

            setSelectedEmployee(null);

            alert("Order assigned successfully!");

        } catch (error) {
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