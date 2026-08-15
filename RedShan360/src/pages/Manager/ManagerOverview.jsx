import React, { useEffect, useState } from "react";

import SideNavigation from "../../components/managerComponent/sideNavigation";
import MOrderCard from "../../components/managerComponent/MOrderCard";
import MOrderGraph from "../../components/managerComponent/MOrderGraph";
import MrecentOrderTable from "../../components/managerComponent/MrecentOrderTable";
import MworkingEmployeeTable from "../../components/managerComponent/MworkingEmployeeTable";

import "../../css/manager.css";


const API_BASE_URL = "http://localhost:8080/api";


export default function ManagerOverview() {

    // ============================================================
    // RECENT ORDERS
    // ============================================================

    const [recentOrders, setRecentOrders] = useState([]);

    const [loadingOrders, setLoadingOrders] = useState(true);

    const [orderError, setOrderError] = useState(null);


    // ============================================================
    // FETCH RECENT ORDERS
    // ============================================================

    const fetchRecentOrders = async () => {

        console.log("");
        console.log(
            "=================================================="
        );

        console.log(
            "🟤 [ManagerOverview] Fetching recent orders..."
        );

        console.log(
            "🟤 URL:",
            `${API_BASE_URL}/orders/pre-orders`
        );


        try {

            setLoadingOrders(true);

            setOrderError(null);


            const response = await fetch(
                `${API_BASE_URL}/orders/pre-orders`
            );


            console.log(
                "🟤 [ManagerOverview] Response status:",
                response.status
            );

            console.log(
                "🟤 [ManagerOverview] Response OK:",
                response.ok
            );


            if (!response.ok) {

                throw new Error(
                    `Failed to fetch orders. Status: ${response.status}`
                );

            }


            const data = await response.json();


            console.log(
                "🟤 [ManagerOverview] RAW BACKEND DATA:",
                data
            );


            if (!Array.isArray(data)) {

                console.warn(
                    "⚠️ [ManagerOverview] Backend response is not an array:",
                    data
                );

                setRecentOrders([]);

                return;
            }


            // ====================================================
            // CONVERT BACKEND DATA TO TABLE DATA
            // ====================================================

            const formattedOrders = data.map(
                (order, index) => {

                    console.log(
                        `🟤 [ManagerOverview] Backend Order ${
                            index + 1
                        }:`,
                        order
                    );


                    return {

                        orderId: order?.orderId,

                        customerName:
                            order?.customerName,

                        totalAmount:
                            order?.totalAmount,

                        orderStatus:
                            order?.orderStatus

                    };

                }
            );


            console.log(
                "🟢 [ManagerOverview] FORMATTED ORDERS:",
                formattedOrders
            );


            setRecentOrders(formattedOrders);

        } catch (error) {

            console.error(
                "❌ [ManagerOverview] Fetch orders error:",
                error
            );


            setOrderError(
                error.message ||
                "Unable to load recent orders."
            );


            setRecentOrders([]);

        } finally {

            setLoadingOrders(false);

        }


        console.log(
            "=================================================="
        );

    };


    // ============================================================
    // COMPONENT LOAD
    // ============================================================

    useEffect(() => {

        console.log(
            "🚀 [ManagerOverview] Component loaded"
        );

        fetchRecentOrders();

    }, []);


    // ============================================================
    // DEBUG STATE
    // ============================================================

    useEffect(() => {

        console.log(
            "🟤 [ManagerOverview] recentOrders state updated:",
            recentOrders
        );

    }, [recentOrders]);


    // ============================================================
    // WORKING EMPLOYEES
    // ============================================================
    //
    // IMPORTANT:
    // You have not provided a backend endpoint for working
    // employees yet.
    //
    // Therefore we DO NOT invent an API endpoint here.
    //
    // Keep this empty until backend endpoint is available.
    //
    // ============================================================

    const workingEmployees = [];


    return (

        <>

            <div className="MPage">

                {/* ==================================================
                    SIDE NAVIGATION
                ================================================== */}

                <div className="Mpart1">

                    <SideNavigation />

                </div>


                {/* ==================================================
                    MAIN CONTENT
                ================================================== */}

                <div className="Mpart2">


                    {/* ==================================================
                        ORDER CARDS
                    ================================================== */}

                    <div className="MOrderCard">


                        {/* ==================================================
                            TOTAL ORDERS
                        ================================================== */}

                        <MOrderCard

                            icon={

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 mx-auto text-[#333]"
                                    fill="currentColor"
                                    viewBox="0 0 640 640"
                                >

                                    <path
                                        d="M385.5 132.8C393.1 119.9 406.9 112 421.8 112L424 112C446.1 112 464 129.9 464 152C464 174.1 446.1 192 424 192L350.7 192L385.5 132.8zM254.5 132.8L289.3 192L216 192C193.9 192 176 174.1 176 152C176 129.9 193.9 112 216 112L218.2 112C233.1 112 247 119.9 254.5 132.8zM344.1 108.5L320 149.5L295.9 108.5C279.7 80.9 250.1 64 218.2 64L216 64C167.4 64 128 103.4 128 152C128 166.4 131.5 180 137.6 192L96 192C78.3 192 64 206.3 64 224L64 256C64 273.7 78.3 288 96 288L544 288C561.7 288 576 273.7 576 256L576 224C576 206.3 561.7 192 544 192L502.4 192C508.5 180 512 166.4 512 152C512 103.4 472.6 64 424 64L421.8 64C389.9 64 360.3 80.9 344.1 108.4zM544 336L344 336L344 544L480 544C515.3 544 544 515.3 544 480L544 336zM296 336L96 336L96 480C96 515.3 124.7 544 160 544L296 544L296 336z"
                                    />

                                </svg>

                            }

                            title="Total Orders"

                            value={50}

                        />


                        {/* ==================================================
                            TOTAL PRODUCTS
                        ================================================== */}

                        <MOrderCard

                            icon={

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 mx-auto text-[#333]"
                                    fill="currentColor"
                                    viewBox="0 0 640 640"
                                >

                                    <path
                                        d="M142 66.2C150.5 62.3 160.5 63.7 167.6 69.8L208 104.4L248.4 69.8C257.4 62.1 270.7 62.1 279.6 69.8L320 104.4L360.4 69.8C369.4 62.1 382.6 62.1 391.6 69.8L432 104.4L472.4 69.8C479.5 63.7 489.5 62.3 498 66.2C506.5 70.1 512 78.6 512 88L512 552C512 561.4 506.5 569.9 498 573.8C489.5 577.7 479.5 576.3 472.4 570.2L432 535.6L391.6 570.2C382.6 577.9 369.4 577.9 360.4 570.2L320 535.6L279.6 570.2C270.6 577.9 257.3 577.9 248.4 570.2L208 535.6L167.6 570.2C160.5 576.3 150.5 577.7 142 573.8C133.5 569.9 128 561.4 128 552L128 88C128 78.6 133.5 70.1 142 66.2zM232 200C218.7 200 208 210.7 208 224C208 237.3 218.7 248 232 248L408 248C421.3 248 432 237.3 432 224C432 210.7 421.3 200 408 200L232 200zM208 416C208 429.3 218.7 440 232 440L408 440C421.3 440 432 429.3 432 416C432 402.7 421.3 392 408 392L232 392C218.7 392 208 402.7 208 416zM232 296C218.7 296 208 306.7 208 320C208 333.3 218.7 344 232 344L408 344C421.3 344 432 333.3 432 320C432 306.7 421.3 296 408 296L232 296z"
                                    />

                                </svg>

                            }

                            title="Total Products"

                            value={100}

                        />


                        {/* ==================================================
                            TOTAL EMPLOYEES
                        ================================================== */}

                        <MOrderCard

                            icon={

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 mx-auto text-[#333]"
                                    fill="currentColor"
                                    viewBox="0 0 640 640"
                                >

                                    <path
                                        d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"
                                    />

                                </svg>

                            }

                            title="Total Employees"

                            value={90}

                        />

                    </div>


                    {/* ==================================================
                        GRAPH
                    ================================================== */}

                    <MOrderGraph />


                    {/* ==================================================
                        TABLE ROW
                    ================================================== */}

                    <div className="dashboard-row">


                        {/* ==================================================
                            RECENT ORDERS
                        ================================================== */}

                        <div
                            className="tabs-container"
                            style={{
                                padding: "24px",
                                flex: 1
                            }}
                        >

                            <h3
                                style={{
                                    fontFamily:
                                        "'Plus Jakarta Sans', sans-serif",

                                    fontSize: "16px",

                                    fontWeight: "700",

                                    color: "#1a1a1a",

                                    marginBottom: "16px"
                                }}
                            >

                                Recent Orders

                            </h3>


                            {/* ==================================================
                                LOADING
                            ================================================== */}

                            {loadingOrders && (

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px"
                                    }}
                                >

                                    Loading recent orders...

                                </div>

                            )}


                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {!loadingOrders &&
                                orderError && (

                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "20px"
                                        }}
                                    >

                                        <p>
                                            {orderError}
                                        </p>


                                        <button
                                            onClick={
                                                fetchRecentOrders
                                            }
                                        >
                                            Retry
                                        </button>

                                    </div>

                                )}


                            {/* ==================================================
                                TABLE
                            ================================================== */}

                            {!loadingOrders &&
                                !orderError && (

                                    <MrecentOrderTable

                                        t1="Order ID"

                                        t2="Customer Name"

                                        t3="Price"

                                        Mrecentorders={
                                            recentOrders
                                        }

                                    />

                                )}

                        </div>


                        {/* ==================================================
                            WORKING EMPLOYEES
                        ================================================== */}

                        <div
                            className="tabs-container"
                            style={{
                                padding: "24px",
                                flex: 1
                            }}
                        >

                            <h3
                                style={{
                                    fontFamily:
                                        "'Plus Jakarta Sans', sans-serif",

                                    fontSize: "16px",

                                    fontWeight: "700",

                                    color: "#1a1a1a",

                                    marginBottom: "16px"
                                }}
                            >

                                Employees Working On Orders

                            </h3>


                            <MworkingEmployeeTable

                                t1="Employee Name"

                                t2="Order ID"

                                t3="Price"

                                MworkingEmployees={
                                    workingEmployees
                                }

                            />

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}