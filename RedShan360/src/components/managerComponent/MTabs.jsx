import React, { useState, useEffect, useRef } from "react";
import "../../css/manager.css";
import MPOrderTable from "./MPendingOrderTable";
import MProcessingOrderTable from "./MProcessingOrderTable";
import MCompletedOrderTable from "./MCompletedOrderTable";
import MDispatchOrderTable from "./MDispatchOrderTable";

export default function MTabs() {
    const [currentTab, setCurrentTab] = useState(1);
    const totalTabs = 4;
    const wrapperRef = useRef(null);

    const handleKeyDown = (e) => {
        if (!wrapperRef.current?.contains(document.activeElement)) return;

        if (e.key === "ArrowRight") {
            setCurrentTab((prev) => (prev < totalTabs ? prev + 1 : 1));
        }

        if (e.key === "ArrowLeft") {
            setCurrentTab((prev) => (prev > 1 ? prev - 1 : totalTabs));
        }
    };

    const orders = [
        {
            OrderID: "ORD001",
            CustomerName: "John",
            OrderName: "lily",
            Price: "Rs.1500",
        },
        {
            OrderID: "ORD002",
            CustomerName: "Kamal",
            OrderName: "Rose",
            Price: "Rs.1000",
        },
        {
            OrderID: "ORD003",
            CustomerName: "Nimal",
            OrderName: "Desi",
            Price: "Rs.1200",
        },
        {
            OrderID: "ORD004",
            CustomerName: "Saman",
            OrderName: "Orchid",
            Price: "Rs.1800",
        },
        {
            OrderID: "ORD007",
            CustomerName: "Tharindu",
            OrderName: "Lotus",
            Price: "Rs.1700",
        },

    ];

    const processingorders = [
        {
            OrderID: "ORD001",
            CustomerName: "John",
            OrderName: "lily",
            Price: "Rs.1500",
        },
        {
            OrderID: "ORD002",
            CustomerName: "Kamal",
            OrderName: "Rose",
            Price: "Rs.1000",
        },
        {
            OrderID: "ORD003",
            CustomerName: "Nimal",
            OrderName: "Desi",
            Price: "Rs.1200",
        },
        {
            OrderID: "ORD004",
            CustomerName: "Saman",
            OrderName: "Orchid",
            Price: "Rs.1800",
        },
        {
            OrderID: "ORD007",
            CustomerName: "Tharindu",
            OrderName: "Lotus",
            Price: "Rs.1700",
        },
    ];

    const completedorders = [
        {
            OrderID: "ORD001",
            CustomerName: "John",
            OrderName: "lily",
            Price: "Rs.1500",
        },
        {
            OrderID: "ORD002",
            CustomerName: "Kamal",
            OrderName: "Rose",
            Price: "Rs.1000",
        },
        {
            OrderID: "ORD003",
            CustomerName: "Nimal",
            OrderName: "Desi",
            Price: "Rs.1200",
        },
        {
            OrderID: "ORD004",
            CustomerName: "Saman",
            OrderName: "Orchid",
            Price: "Rs.1800",
        },
        {
            OrderID: "ORD007",
            CustomerName: "Tharindu",
            OrderName: "Lotus",
            Price: "Rs.1700",
        },
    ];

    const dispatchedorders = [
        {
            OrderID: "ORD001",
            CustomerName: "John",
            OrderName: "lily",
            Price: "Rs.1500",
        },
        {
            OrderID: "ORD002",
            CustomerName: "Kamal",
            OrderName: "Rose",
            Price: "Rs.1000",
        },
        {
            OrderID: "ORD003",
            CustomerName: "Nimal",
            OrderName: "Desi",
            Price: "Rs.1200",
        },
        {
            OrderID: "ORD004",
            CustomerName: "Saman",
            OrderName: "Orchid",
            Price: "Rs.1800",
        },
        {
            OrderID: "ORD007",
            CustomerName: "Tharindu",
            OrderName: "Lotus",
            Price: "Rs.1700",
        },
    ];

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);



    return (
        <div className="tabs-container" ref={wrapperRef}>
            {/* Tab Buttons */}
            <div className="tabs-header">
                <button
                    className={`tab-btn ${currentTab === 1 ? "active" : ""}`}
                    onClick={() => setCurrentTab(1)}
                >
                    Pre Orders
                </button>

                <button
                    className={`tab-btn ${currentTab === 2 ? "active" : ""}`}
                    onClick={() => setCurrentTab(2)}
                >
                    Processing Orders
                </button>

                <button
                    className={`tab-btn ${currentTab === 3 ? "active" : ""}`}
                    onClick={() => setCurrentTab(3)}
                >
                    Completed Orders
                </button>

                <button
                    className={`tab-btn ${currentTab === 4 ? "active" : ""}`}
                    onClick={() => setCurrentTab(4)}
                >
                    Dispatched Orders To Courier
                </button>

            </div>

            {/* Content */}
            <div className="tab-content">
                {currentTab === 1 && (
                    <div>
                        <MPOrderTable
                            t1="Order ID"
                            t2="Customer Name"
                            t3="Order Name"
                            t4="Price"
                            orders={orders}
                        />
                    </div>
                )}

                {currentTab === 2 && (
                    <div>
                        <MProcessingOrderTable
                            t1="Order ID"
                            t2="Customer Name"
                            t3="Order Name"
                            t4="Price"
                            processingorders={processingorders}


                        />
                    </div>
                )}

                {currentTab === 3 && (
                    <div>
                        <MCompletedOrderTable
                            t1="Order ID"
                            t2="Customer Name"
                            t3="Order Name"
                            t4="Price"
                            completedorders={completedorders}


                        />
                    </div>
                )}

                {currentTab === 4 && (
                    <div>
                        <MDispatchOrderTable
                            t1="Order ID"
                            t2="Customer Name"
                            t3="Order Name"
                            t4="Price"
                            dispatchedorders={dispatchedorders}

                        />

                        
                    </div>
                )}



            </div>
        </div>
    );
}