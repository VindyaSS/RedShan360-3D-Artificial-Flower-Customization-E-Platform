import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react";

import "../../css/manager.css";

import MPOrderTable from "./MPendingOrderTable";
import MProcessingOrderTable from "./MProcessingOrderTable";
import MCompletedOrderTable from "./MCompletedOrderTable";
import MDispatchOrderTable from "./MDispatchOrderTable";


const API_BASE_URL =
    "http://localhost:8080/api";


export default function MTabs() {

    // ============================================================
    // TAB STATE
    // ============================================================

    const [currentTab, setCurrentTab] =
        useState(1);


    // ============================================================
    // ORDER STATES
    // ============================================================

    const [orders, setOrders] =
        useState([]);

    const [processingorders, setProcessingOrders] =
        useState([]);

    const [completedorders, setCompletedOrders] =
        useState([]);

    const [dispatchedorders, setDispatchedOrders] =
        useState([]);


    // ============================================================
    // LOADING / ERROR
    // ============================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const totalTabs = 4;

    const wrapperRef =
        useRef(null);


    // ============================================================
    // FETCH ALL ORDERS
    // ============================================================

    const fetchOrders = useCallback(
        async () => {

            console.log("");
            console.log(
                "===================================================="
            );

            console.log(
                " STARTING ORDER FETCH"
            );

            console.log(
                "===================================================="
            );


            setLoading(true);
            setError("");


            try {

                // ------------------------------------------------
                // URLs
                // ------------------------------------------------

                const preOrdersURL =
                    `${API_BASE_URL}/orders/pre-orders`;

                const processingURL =
                    `${API_BASE_URL}/orders/processing`;

                const completedURL =
                    `${API_BASE_URL}/orders/completed`;

                const dispatchedURL =
                    `${API_BASE_URL}/orders/dispatched`;


                console.log(
                    " PRE ORDERS URL:",
                    preOrdersURL
                );

                console.log(
                    " PROCESSING URL:",
                    processingURL
                );

                console.log(
                    " COMPLETED URL:",
                    completedURL
                );

                console.log(
                    " DISPATCHED URL:",
                    dispatchedURL
                );


                // ------------------------------------------------
                // FETCH FOUR APIs
                // ------------------------------------------------

                const [
                    preOrdersResponse,
                    processingResponse,
                    completedResponse,
                    dispatchedResponse
                ] = await Promise.all([

                    fetch(preOrdersURL),

                    fetch(processingURL),

                    fetch(completedURL),

                    fetch(dispatchedURL)

                ]);


                // ------------------------------------------------
                // HTTP STATUS
                // ------------------------------------------------

                console.log("");
                console.log(
                    "========== HTTP STATUS =========="
                );


                console.log(
                    " Pre Orders:",
                    preOrdersResponse.status,
                    preOrdersResponse.ok
                );

                console.log(
                    " Processing:",
                    processingResponse.status,
                    processingResponse.ok
                );

                console.log(
                    " Completed:",
                    completedResponse.status,
                    completedResponse.ok
                );

                console.log(
                    " Dispatched:",
                    dispatchedResponse.status,
                    dispatchedResponse.ok
                );


                // ------------------------------------------------
                // CHECK RESPONSE
                // ------------------------------------------------

                if (!preOrdersResponse.ok) {

                    throw new Error(
                        `Pre Orders API returned ${preOrdersResponse.status}`
                    );

                }


                if (!processingResponse.ok) {

                    throw new Error(
                        `Processing API returned ${processingResponse.status}`
                    );

                }


                if (!completedResponse.ok) {

                    throw new Error(
                        `Completed API returned ${completedResponse.status}`
                    );

                }


                if (!dispatchedResponse.ok) {

                    throw new Error(
                        `Dispatched API returned ${dispatchedResponse.status}`
                    );

                }


                // ------------------------------------------------
                // JSON
                // ------------------------------------------------

                const preOrdersData =
                    await preOrdersResponse.json();

                const processingData =
                    await processingResponse.json();

                const completedData =
                    await completedResponse.json();

                const dispatchedData =
                    await dispatchedResponse.json();


                // ------------------------------------------------
                // RAW DATA LOG
                // ------------------------------------------------

                console.log("");
                console.log(
                    "===================================================="
                );

                console.log(
                    " RAW BACKEND RESPONSES"
                );

                console.log(
                    "===================================================="
                );


                console.log(
                    " PRE ORDERS:",
                    preOrdersData
                );

                console.log(
                    " PROCESSING:",
                    processingData
                );

                console.log(
                    " COMPLETED:",
                    completedData
                );

                console.log(
                    " DISPATCHED:",
                    dispatchedData
                );


                // ------------------------------------------------
                // SAVE STATES
                // ------------------------------------------------

                setOrders(
                    Array.isArray(preOrdersData)
                        ? preOrdersData
                        : []
                );


                setProcessingOrders(
                    Array.isArray(processingData)
                        ? processingData
                        : []
                );


                setCompletedOrders(
                    Array.isArray(completedData)
                        ? completedData
                        : []
                );


                setDispatchedOrders(
                    Array.isArray(dispatchedData)
                        ? dispatchedData
                        : []
                );


                console.log("");
                console.log(
                    " ORDER DATA SAVED TO REACT STATE"
                );


            } catch (error) {

                console.error("");
                console.error(
                    "===================================================="
                );

                console.error(
                    " ORDER FETCH ERROR"
                );

                console.error(
                    "===================================================="
                );


                console.error(
                    "Error:",
                    error
                );


                console.error(
                    "Message:",
                    error?.message
                );


                setError(
                    error?.message ||
                    "Failed to fetch orders"
                );


            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ============================================================
    // INITIAL FETCH
    // ============================================================

    useEffect(() => {

        console.log(
            " MTabs mounted - fetching orders"
        );

        fetchOrders();

    }, [fetchOrders]);


    // ============================================================
    // DISPATCH SUCCESS CALLBACK
    // ============================================================

    const handleOrderDispatched =
        async (updatedOrder) => {

            console.log("");
            console.log(
                "===================================================="
            );

            console.log(
                " [MTabs] ORDER DISPATCHED"
            );

            console.log(
                " [MTabs] Updated order:",
                updatedOrder
            );

            console.log(
                " [MTabs] Order ID:",
                updatedOrder?.orderId
            );

            console.log(
                " [MTabs] New status:",
                updatedOrder?.orderStatus
            );


            if (
                updatedOrder?.orderStatus ===
                "DISPATCHED_TO_COURIER"
            ) {

                console.log(
                    " [MTabs] Refreshing all order lists..."
                );


                // ------------------------------------------------
                // REFETCH ALL FOUR STATUS LISTS
                // ------------------------------------------------

                await fetchOrders();


                console.log(
                    " [MTabs] All order lists refreshed"
                );

            }


            console.log(
                "===================================================="
            );

        };


    // ============================================================
    // STATE DEBUG
    // ============================================================

    useEffect(() => {

        console.log(
            " [STATE] Pre Orders:",
            orders
        );

    }, [orders]);


    useEffect(() => {

        console.log(
            " [STATE] Processing Orders:",
            processingorders
        );

    }, [processingorders]);


    useEffect(() => {

        console.log(
            " [STATE] Completed Orders:",
            completedorders
        );

    }, [completedorders]);


    useEffect(() => {

        console.log(
            " [STATE] Dispatched Orders:",
            dispatchedorders
        );

    }, [dispatchedorders]);


    // ============================================================
    // KEYBOARD NAVIGATION
    // ============================================================

    const handleKeyDown = (e) => {

        if (
            !wrapperRef.current?.contains(
                document.activeElement
            )
        ) {

            return;

        }


        if (e.key === "ArrowRight") {

            setCurrentTab(
                (prev) =>
                    prev < totalTabs
                        ? prev + 1
                        : 1
            );

        }


        if (e.key === "ArrowLeft") {

            setCurrentTab(
                (prev) =>
                    prev > 1
                        ? prev - 1
                        : totalTabs
            );

        }

    };


    useEffect(() => {

        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, []);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <div
                className="tabs-container"
                ref={wrapperRef}
            >

                <div className="tabs-header">

                    <button className="tab-btn active">
                        Pre Orders
                    </button>

                    <button className="tab-btn">
                        Processing Orders
                    </button>

                    <button className="tab-btn">
                        Completed Orders
                    </button>

                    <button className="tab-btn">
                        Dispatched Orders To Courier
                    </button>

                </div>


                <div className="tab-content">

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center"
                        }}
                    >

                        Loading orders...

                    </div>

                </div>

            </div>

        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <div
                className="tabs-container"
                ref={wrapperRef}
            >

                <div className="tabs-header">

                    <button className="tab-btn active">
                        Pre Orders
                    </button>

                    <button className="tab-btn">
                        Processing Orders
                    </button>

                    <button className="tab-btn">
                        Completed Orders
                    </button>

                    <button className="tab-btn">
                        Dispatched Orders To Courier
                    </button>

                </div>


                <div className="tab-content">

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center"
                        }}
                    >

                        <h3>
                            Failed to load orders
                        </h3>

                        <p>
                            {error}
                        </p>


                        <button
                            onClick={fetchOrders}
                        >
                            Retry
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (

        <div
            className="tabs-container"
            ref={wrapperRef}
        >

            {/* ==================================================
                TABS
            ================================================== */}

            <div className="tabs-header">

                <button
                    className={`tab-btn ${
                        currentTab === 1
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setCurrentTab(1)
                    }
                >
                    Pre Orders
                </button>


                <button
                    className={`tab-btn ${
                        currentTab === 2
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setCurrentTab(2)
                    }
                >
                    Processing Orders
                </button>


                <button
                    className={`tab-btn ${
                        currentTab === 3
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setCurrentTab(3)
                    }
                >
                    Completed Orders
                </button>


                <button
                    className={`tab-btn ${
                        currentTab === 4
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setCurrentTab(4)
                    }
                >
                    Dispatched Orders To Courier
                </button>

            </div>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="tab-content">


                {/* ==================================================
                    PRE ORDERS
                ================================================== */}

                {currentTab === 1 && (

                    <MPOrderTable

                        t1="Order ID"

                        t2="Customer Name"

                        t3="Price"

                        orders={orders}

                    />

                )}


                {/* ==================================================
                    PROCESSING ORDERS
                ================================================== */}

                {currentTab === 2 && (

                    <MProcessingOrderTable

                        t1="Order ID"

                        t2="Customer Name"

                        t3="Price"

                        processingorders={
                            processingorders
                        }

                    />

                )}


                {/* ==================================================
                    COMPLETED ORDERS
                ================================================== */}

                {currentTab === 3 && (

                    <MCompletedOrderTable

                        t1="Order ID"

                        t2="Customer Name"

                        t3="Price"

                        completedorders={
                            completedorders
                        }

                        onOrderDispatched={
                            handleOrderDispatched
                        }

                    />

                )}


                {/* ==================================================
                    DISPATCHED ORDERS
                ================================================== */}

                {currentTab === 4 && (

                    <MDispatchOrderTable

                        t1="Order ID"

                        t2="Customer Name"

                        t3="Price"

                        dispatchedorders={
                            dispatchedorders
                        }

                    />

                )}

            </div>

        </div>

    );

}