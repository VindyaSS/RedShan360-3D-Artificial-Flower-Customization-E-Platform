import React, { useState } from "react";
import SideNavigation from '../../components/managerComponent/sideNavigation';
import '../../css/manager.css'
import AssignedEmployeeTable from "../../components/managerComponent/AssignedEmployeeTable";
import UnAssignedEmployeeTable from "../../components/managerComponent/UnAssignedEmployeeTable";
import MPreOrderModal from "../../components/managerComponent/mPreOrderModal";

export default function MmanageEmployees() {
    const [assignedEmployees, setAssignedEmployees] = useState([
        {
            EmployeeName: "John",
            OrderID: "ORD001",
            OrderName: "lily",
            WorkingStatus: "Active",
        },

        {
            EmployeeName: "Kamal",
            OrderID: "ORD002",
            OrderName: "Rose",
            WorkingStatus: "Offline",
        },

        {
            EmployeeName: "Nimal",
            OrderID: "ORD003",
            OrderName: "Desi",
            WorkingStatus: "Active",
        },
    ]);

    const [unAssignedEmployees, setUnAssignedEmployees] = useState([
        {
            EmployeeName: "Anura",
        },

        {
            EmployeeName: "Kawshi",
        },

        {
            EmployeeName: "Vihanga",
        },
        {
            EmployeeName: "Chathura",
        },
        {
            EmployeeName: "Pahan",
        },
        {
            EmployeeName: "Dineth",
        },
    ]);

    const [preOrders, setPreOrders] = useState([
        {
            OrderID: "ORD004",
            CustomerName: "Saman",
            OrderName: "Orchid",
            Price: "Rs.1800",
            Type: "customize order",
            FlowerType: "Orchid Bouquet",
            ColorHex: "#DDA0DD",
            ColorTheme: "Plum & Lilac",
            WrappingPaper: "Sheer Organza Wrap",
            RibbonAccent: "Silver Satin",
            CardMessage: "Happy Birthday Saman!",
            Contact: "+94 77 123 4567",
            ShippingMethod: "Express Courier",
        },
        {
            OrderID: "ORD005",
            CustomerName: "Priyantha",
            OrderName: "Tulip",
            Price: "Rs.2200",
            Type: "not customize order",
            FlowerType: "Red Tulips Classic",
            ColorHex: "#FF0000",
            ColorTheme: "Crimson Red",
            WrappingPaper: "Brown Kraft Paper",
            RibbonAccent: "Jute Twine",
            CardMessage: "With love and warmth.",
            Contact: "+94 71 987 6543",
            ShippingMethod: "Express Courier",
        },
        {
            OrderID: "ORD006",
            CustomerName: "Kasun",
            OrderName: "Sunflower",
            Price: "Rs.1300",
            Type: "customize order",
            FlowerType: "Bright Sunflowers",
            ColorHex: "#FFD700",
            ColorTheme: "Sunny Yellow",
            WrappingPaper: "Yellow Matte Border",
            RibbonAccent: "Green Ribbon",
            CardMessage: "Get well soon!",
            Contact: "+94 75 456 7890",
            ShippingMethod: "Express Courier",
        },
        {
            OrderID: "ORD006",
            CustomerName: "Saranga",
            OrderName: "Lily",
            Price: "Rs.2200",
            Type: "not customize order",
            FlowerType: "Red Lily Classic",
            ColorHex: "#FF0000",
            ColorTheme: "Crimson Red",
            WrappingPaper: "Brown Kraft Paper",
            RibbonAccent: "Jute Twine",
            CardMessage: "With love and warmth.",
            Contact: "+94 71 987 6543",
            ShippingMethod: "Express Courier",
        },

    ]);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleAssignClick = (employeeName) => {
        setSelectedEmployee(employeeName);
    };

    const handleAssignOrder = (employeeName, order) => {
        setUnAssignedEmployees(prev => prev.filter(emp => emp.EmployeeName !== employeeName));
        setAssignedEmployees(prev => [
            ...prev,
            {
                EmployeeName: employeeName,
                OrderID: order.OrderID,
                OrderName: order.OrderName,
                WorkingStatus: "Not yet Start Work"
            }
        ]);
        setPreOrders(prev => prev.filter(po => po.OrderID !== order.OrderID));
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
                                t3="Order Name"
                                t4="Working Status"
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
                employeeName={selectedEmployee}
                preOrders={preOrders}
                onAssign={handleAssignOrder}
            />
        </>

















    );























}