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

// ---------------- API Base URL ----------------
const API_BASE_URL = "http://localhost:8080/api";


export default function MTabs() {

    // ---------------- Tab State ----------------
    const [currentTab, setCurrentTab] = useState(1);

    // ---------------- Order States ----------------
    const [orders, setOrders] = useState([]);
    const [processingorders, setProcessingOrders] = useState([]);
    const [completedorders, setCompletedOrders] = useState([]);
    const [dispatchedorders, setDispatchedOrders] = useState([]);

    // ---------------- Loading & Error State ----------------
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalTabs = 4;
    const wrapperRef = useRef(null);


    // ---------------- Fetch All Order Lists ----------------
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const preOrdersURL = `${API_BASE_URL}/orders/pre-orders`;
            const processingURL = `${API_BASE_URL}/orders/processing`;
            const completedURL = `${API_BASE_URL}/orders/completed`;
            const dispatchedURL = `${API_BASE_URL}/orders/dispatched`;

            // Fetch all four order status lists in parallel
            const token = localStorage.getItem('token');
            const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
            const [
                preOrdersResponse,
                processingResponse,
                completedResponse,
                dispatchedResponse
            ] = await Promise.all([
                fetch(preOrdersURL, authHeaders),
                fetch(processingURL, authHeaders),
                fetch(completedURL, authHeaders),
                fetch(dispatchedURL, authHeaders)
            ]);

            // Validate HTTP responses
            if (!preOrdersResponse.ok) throw new Error(`Pre Orders API returned ${preOrdersResponse.status}`);
            if (!processingResponse.ok) throw new Error(`Processing API returned ${processingResponse.status}`);
            if (!completedResponse.ok) throw new Error(`Completed API returned ${completedResponse.status}`);
            if (!dispatchedResponse.ok) throw new Error(`Dispatched API returned ${dispatchedResponse.status}`);

            const preOrdersData = await preOrdersResponse.json();
            const processingData = await processingResponse.json();
            const completedData = await completedResponse.json();
            const dispatchedData = await dispatchedResponse.json();

            console.log('[MTabs] fetchOrders preOrders - Status:', preOrdersResponse.status, '| Data:', preOrdersData);
            console.log('[MTabs] fetchOrders processing - Status:', processingResponse.status, '| Data:', processingData);
            console.log('[MTabs] fetchOrders completed - Status:', completedResponse.status, '| Data:', completedData);
            console.log('[MTabs] fetchOrders dispatched - Status:', dispatchedResponse.status, '| Data:', dispatchedData);

            // Save fetched data to state
            setOrders(Array.isArray(preOrdersData) ? preOrdersData : []);
            setProcessingOrders(Array.isArray(processingData) ? processingData : []);
            setCompletedOrders(Array.isArray(completedData) ? completedData : []);
            setDispatchedOrders(Array.isArray(dispatchedData) ? dispatchedData : []);

        } catch (error) {
            setError(error?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, []);


    // ---------------- Initial Data Fetch on Mount ----------------
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    // ---------------- Handle Order Dispatched (Refresh Lists) ----------------
    const handleOrderDispatched = async (updatedOrder) => {
        if (updatedOrder?.orderStatus === "DISPATCHED_TO_COURIER") {
            await fetchOrders();
        }
    };


    // ---------------- Keyboard Tab Navigation ----------------
    const handleKeyDown = (e) => {
        if (!wrapperRef.current?.contains(document.activeElement)) return;

        if (e.key === "ArrowRight") {
            setCurrentTab((prev) => prev < totalTabs ? prev + 1 : 1);
        }

        if (e.key === "ArrowLeft") {
            setCurrentTab((prev) => prev > 1 ? prev - 1 : totalTabs);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    // ---------------- Loading State ----------------
    if (loading) {
        return (
            <div className="tabs-container" ref={wrapperRef}>
                <div className="tabs-header">
                    <button className="tab-btn active">Pre Orders</button>
                    <button className="tab-btn">Processing Orders</button>
                    <button className="tab-btn">Completed Orders</button>
                    <button className="tab-btn">Dispatched Orders To Courier</button>
                </div>
                <div className="tab-content" style={{ display: 'block', width: '100%' }}>
                    <div style={{ padding: "40px", textAlign: "center" }}>
                        Loading orders...
                    </div>
                </div>
            </div>
        );
    }


    // ---------------- Error State ----------------
    if (error) {
        return (
            <div className="tabs-container" ref={wrapperRef}>
                <div className="tabs-header">
                    <button className="tab-btn active">Pre Orders</button>
                    <button className="tab-btn">Processing Orders</button>
                    <button className="tab-btn">Completed Orders</button>
                    <button className="tab-btn">Dispatched Orders To Courier</button>
                </div>
                <div className="tab-content" style={{ display: 'block', width: '100%' }}>
                    <div style={{ padding: "40px", textAlign: "center" }}>
                        <h3>Failed to load orders</h3>
                        <p>{error}</p>
                        <button onClick={fetchOrders}>Retry</button>
                    </div>
                </div>
            </div>
        );
    }


    // ---------------- Main UI ----------------
    return (
        <div className="tabs-container" ref={wrapperRef}>

            {/* ---------------- Tab Buttons ---------------- */}
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


            {/* ---------------- Tab Content ---------------- */}
            <div className="tab-content" style={{ display: 'block', width: '100%' }}>

                {/* ---------------- Pre Orders Tab ---------------- */}
                {currentTab === 1 && (
                    <MPOrderTable
                        t1="Order ID"
                        t2="Customer Name"
                        t3="Price"
                        orders={orders}
                    />
                )}

                {/* ---------------- Processing Orders Tab ---------------- */}
                {currentTab === 2 && (
                    <MProcessingOrderTable
                        t1="Order ID"
                        t2="Customer Name"
                        t3="Price"
                        processingorders={processingorders}
                    />
                )}

                {/* ---------------- Completed Orders Tab ---------------- */}
                {currentTab === 3 && (
                    <MCompletedOrderTable
                        t1="Order ID"
                        t2="Customer Name"
                        t3="Price"
                        completedorders={completedorders}
                        onOrderDispatched={handleOrderDispatched}
                    />
                )}

                {/* ---------------- Dispatched Orders Tab ---------------- */}
                {currentTab === 4 && (
                    <MDispatchOrderTable
                        t1="Order ID"
                        t2="Customer Name"
                        t3="Price"
                        dispatchedorders={dispatchedorders}
                    />
                )}

            </div>
        </div>
    );
}