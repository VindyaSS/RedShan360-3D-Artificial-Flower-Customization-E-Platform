import React, { useEffect, useState } from 'react';

import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ECustomizedOrderTable from '../../components/employeeComponent/ECustomizedOrderTable';
import ECustomizedCompletedTable from '../../components/employeeComponent/ECustomizedCompletedTable';
import ECustomizedItemCard from '../../components/employeeComponent/ECusomizedItemCard';

import '../../css/employee.css';

const API_BASE_URL = 'http://localhost:8080/api';

export default function EcustomizedProducts() {

    // =========================================================
    // LOGGED-IN EMPLOYEE
    // =========================================================

    const loggedInUser =
        JSON.parse(localStorage.getItem('user'));

    const employeeId =
        loggedInUser?.employeeId;


    // =========================================================
    // STATE
    // =========================================================

    const [assignedOrders, setAssignedOrders] = useState([]);

    const [completedOrders, setCompletedOrders] = useState([]);

    const [orderItems, setOrderItems] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        if (!employeeId) {

            setError(
                'Employee information not found. Please login again.'
            );

            setLoading(false);

            return;
        }

        fetchAssignedOrders();

        fetchCompletedOrders();

    }, [employeeId]);


    // =========================================================
    // HELPER
    // Safely read JSON from backend
    // =========================================================

    const readJsonResponse = async (response) => {

        const contentType =
            response.headers.get('content-type') || '';

        const responseText =
            await response.text();

        console.log(
            'API RESPONSE CONTENT-TYPE:',
            contentType
        );

        console.log(
            'API RESPONSE:',
            responseText
        );

        if (!response.ok) {

            throw new Error(
                responseText ||
                `Request failed with status ${response.status}`
            );
        }

        if (
            !contentType.toLowerCase().includes(
                'application/json'
            )
        ) {

            throw new Error(
                `Expected JSON but server returned ${contentType || 'HTML/text'}. ` +
                `Response starts with: ${responseText.substring(0, 100)}`
            );
        }

        try {

            return JSON.parse(responseText);

        } catch (parseError) {

            console.error(
                'JSON PARSE ERROR:',
                parseError
            );

            throw new Error(
                'Server returned invalid JSON.'
            );
        }
    };


    // =========================================================
    // FETCH CUSTOMIZED ASSIGNED ORDERS
    // =========================================================

    const fetchAssignedOrders = async () => {

        try {

            setLoading(true);

            setError(null);

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('FETCHING CUSTOMIZED ASSIGNED ORDERS');
            console.log('EMPLOYEE ID:', employeeId);


            const url =
                `${API_BASE_URL}/employee/tasks/assigned/customized/${employeeId}`;

            console.log(
                'REQUEST URL:',
                url
            );


            const response = await fetch(
                url,
                {
                    method: 'GET',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            console.log(
                'CUSTOMIZED ASSIGNED RESPONSE STATUS:',
                response.status
            );


            const data =
                await readJsonResponse(response);


            console.log(
                'CUSTOMIZED ASSIGNED ORDERS:',
                data
            );


            if (Array.isArray(data)) {

                data.forEach((order) => {

                    console.log(
                        'Customized Order:',
                        {
                            employeeId: employeeId,
                            orderId: order.orderId,
                            numberOfItems:
                                order.numberOfItems,
                            totalQuantity:
                                order.totalQuantity
                        }
                    );

                });

            }


            setAssignedOrders(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                'ERROR FETCHING CUSTOMIZED ASSIGNED ORDERS:',
                error
            );

            setError(
                error.message ||
                'Unable to load customized assigned tasks'
            );

            setAssignedOrders([]);


        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // FETCH CUSTOMIZED COMPLETED ORDERS
    // =========================================================

    const fetchCompletedOrders = async () => {

        try {

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('FETCHING CUSTOMIZED COMPLETED ORDERS');
            console.log('EMPLOYEE ID:', employeeId);


            const url =
                `${API_BASE_URL}/employee/tasks/completed/customized/${employeeId}`;

            console.log(
                'REQUEST URL:',
                url
            );


            const response = await fetch(
                url,
                {
                    method: 'GET',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            console.log(
                'CUSTOMIZED COMPLETED RESPONSE STATUS:',
                response.status
            );


            const data =
                await readJsonResponse(response);


            console.log(
                'CUSTOMIZED COMPLETED ORDERS:',
                data
            );


            setCompletedOrders(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                'ERROR FETCHING CUSTOMIZED COMPLETED ORDERS:',
                error
            );

            setCompletedOrders([]);

        }
    };


    // =========================================================
    // FETCH CUSTOMIZED ORDER ITEMS
    // =========================================================

    const fetchOrderItems = async (orderId) => {

        try {

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('FETCHING CUSTOMIZED ORDER ITEMS');
            console.log('ORDER ID:', orderId);


            const url =
                `${API_BASE_URL}/employee/tasks/order/${orderId}`;

            console.log(
                'CUSTOMIZED ITEMS REQUEST URL:',
                url
            );


            const response = await fetch(
                url,
                {
                    method: 'GET',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            console.log(
                'ORDER ITEMS RESPONSE STATUS:',
                response.status
            );


            /*
             * IMPORTANT:
             *
             * Do not call response.json() directly.
             *
             * If Spring/Vite returns HTML, response.json()
             * produces:
             *
             * Unexpected token '<'
             *
             * readJsonResponse() detects that situation
             * and gives us a useful error instead.
             */

            const data =
                await readJsonResponse(response);


            console.log(
                'CUSTOMIZED ORDER ITEMS:',
                data
            );


            if (!Array.isArray(data)) {

                console.error(
                    'CUSTOMIZED ORDER ITEMS IS NOT AN ARRAY:',
                    data
                );

                return [];
            }


            /*
             * Normalize the customized item.
             *
             * Expected backend object:
             *
             * {
             *   itemId: "CUSTOM-32",
             *   itemName: "Customized Bouquet",
             *   quantity: 10,
             *   status: "Pending",
             *   flowerType: "Pink Cynthresus Stem",
             *   numberOfFlowers: 10,
             *   bouquetStyle: "ROUND"
             * }
             */

            const normalizedItems =
                data.map((item) => ({

                    ...item,

                    itemId:
                        item.itemId != null
                            ? String(item.itemId)
                            : '',

                    itemName:
                        item.itemName ||
                        'Customized Bouquet',

                    quantity:
                        item.quantity ?? 0,

                    status:
                        item.status ||
                        'PENDING',

                    flowerType:
                        item.flowerType ||
                        '',

                    numberOfFlowers:
                        item.numberOfFlowers ??
                        item.quantity ??
                        0,

                    bouquetStyle:
                        item.bouquetStyle ||
                        ''

                }));


            normalizedItems.forEach((item) => {

                console.log(
                    'CUSTOMIZED ITEM:',
                    {
                        itemId: item.itemId,
                        itemName: item.itemName,
                        quantity: item.quantity,
                        status: item.status,
                        flowerType: item.flowerType,
                        numberOfFlowers:
                            item.numberOfFlowers,
                        bouquetStyle:
                            item.bouquetStyle
                    }
                );

            });


            return normalizedItems;


        } catch (error) {

            console.error(
                'ERROR FETCHING CUSTOMIZED ORDER ITEMS:',
                error
            );

            /*
             * Do not silently hide the real API problem.
             */

            alert(
                error.message ||
                'Unable to load customized order items.'
            );

            return [];
        }
    };


    // =========================================================
    // SHOW ORDER ITEMS
    // =========================================================

    const handleShowItems = async (orderId) => {

        console.log(
            'SHOW CUSTOMIZED ITEMS CLICKED'
        );

        console.log(
            'ORDER ID:',
            orderId
        );


        /*
         * Already loaded.
         */
        if (
            Object.prototype.hasOwnProperty.call(
                orderItems,
                orderId
            )
        ) {

            console.log(
                'ITEMS ALREADY LOADED:',
                orderId
            );

            return;
        }


        const items =
            await fetchOrderItems(orderId);


        console.log(
            'ITEMS RECEIVED:',
            items
        );


        setOrderItems((previousItems) => ({

            ...previousItems,

            [orderId]: items

        }));
    };


    // =========================================================
    // START ITEM
    // =========================================================

    const handleStart = async (
        orderId,
        itemId
    ) => {

        try {

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('START CUSTOMIZED ITEM');
            console.log('ORDER ID:', orderId);
            console.log('ITEM ID:', itemId);


            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/start`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            const result =
                await response.text();


            console.log(
                'START RESPONSE:',
                result
            );


            if (!response.ok) {

                throw new Error(
                    result ||
                    'Failed to start item'
                );
            }


            console.log(
                'Customized item started successfully.'
            );


            setOrderItems((previousItems) => {

                const currentItems =
                    previousItems[orderId] || [];


                return {

                    ...previousItems,

                    [orderId]:
                        currentItems.map(
                            (item) =>

                                String(item.itemId) ===
                                String(itemId)

                                    ? {
                                        ...item,
                                        status: 'START'
                                    }

                                    : item
                        )

                };

            });


            await fetchAssignedOrders();

            await fetchCompletedOrders();


            return true;


        } catch (error) {

            console.error(
                'START CUSTOMIZED ITEM ERROR:',
                error
            );

            alert(
                error.message ||
                'Unable to start customized item.'
            );

            return false;
        }
    };


    // =========================================================
    // STOP ITEM
    // =========================================================

    const handleStop = async (
        orderId,
        itemId
    ) => {

        try {

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('STOP CUSTOMIZED ITEM');
            console.log('ORDER ID:', orderId);
            console.log('ITEM ID:', itemId);


            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/stop`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            const result =
                await response.text();


            console.log(
                'STOP RESPONSE:',
                result
            );


            if (!response.ok) {

                throw new Error(
                    result ||
                    'Failed to stop item'
                );
            }


            console.log(
                'Customized item stopped successfully.'
            );


            setOrderItems((previousItems) => {

                const currentItems =
                    previousItems[orderId] || [];


                return {

                    ...previousItems,

                    [orderId]:
                        currentItems.map(
                            (item) =>

                                String(item.itemId) ===
                                String(itemId)

                                    ? {
                                        ...item,
                                        status: 'STOP'
                                    }

                                    : item
                        )

                };

            });


            await fetchAssignedOrders();

            await fetchCompletedOrders();


            return true;


        } catch (error) {

            console.error(
                'STOP CUSTOMIZED ITEM ERROR:',
                error
            );

            alert(
                error.message ||
                'Unable to stop customized item.'
            );

            return false;
        }
    };


    // =========================================================
    // COMPLETE ITEM
    // =========================================================

    const handleComplete = async (
        orderId,
        itemId
    ) => {

        try {

            const token =
                localStorage.getItem('token');


            console.log('====================================');
            console.log('COMPLETE CUSTOMIZED ITEM');
            console.log('ORDER ID:', orderId);
            console.log('ITEM ID:', itemId);


            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/complete`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',

                        ...(token
                            ? {
                                'Authorization':
                                    `Bearer ${token}`
                            }
                            : {})
                    }
                }
            );


            const result =
                await response.text();


            console.log(
                'COMPLETE RESPONSE:',
                result
            );


            if (!response.ok) {

                throw new Error(
                    result ||
                    'Failed to complete item'
                );
            }


            console.log(
                'Customized item completed successfully.'
            );


            setOrderItems((previousItems) => {

                const currentItems =
                    previousItems[orderId] || [];


                return {

                    ...previousItems,

                    [orderId]:
                        currentItems.map(
                            (item) =>

                                String(item.itemId) ===
                                String(itemId)

                                    ? {
                                        ...item,
                                        status: 'COMPLETED'
                                    }

                                    : item
                        )

                };

            });


            await fetchAssignedOrders();

            await fetchCompletedOrders();


            return true;


        } catch (error) {

            console.error(
                'COMPLETE CUSTOMIZED ITEM ERROR:',
                error
            );

            alert(
                error.message ||
                'Unable to complete customized item.'
            );

            return false;
        }
    };


    // =========================================================
    // ITEM CLICK
    // =========================================================

    const handleItemClick = (item) => {

        console.log(
            'CUSTOMIZED ITEM CLICKED:',
            item
        );


        setSelectedItem(item);
    };


    // =========================================================
    // CLOSE ITEM POPUP
    // =========================================================

    const handleCloseItem = () => {

        setSelectedItem(null);
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="EPage">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <div className="Epart1">

                <ESideNavigation />

            </div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="Epart2">


                {/* =================================================
                    ASSIGNED CUSTOMIZED TASKS
                ================================================= */}

                <div className="dashboard-row">

                    <div
                        className="tabs-container"
                        style={{
                            padding: '24px',
                            flex: 1
                        }}
                    >

                        <h3
                            style={{
                                fontFamily:
                                    "'Plus Jakarta Sans', sans-serif",

                                fontSize: "18px",

                                fontWeight: "700",

                                color: "#1a1a1a",

                                marginBottom: "16px"
                            }}
                        >
                            Assigned Tasks (Customized Items)
                        </h3>


                        <p
                            style={{
                                fontFamily:
                                    "'Plus Jakarta Sans', sans-serif",

                                fontSize: "13.5px",

                                color: "#b25e00",

                                backgroundColor: "#fcf6e8",

                                border: "1px solid #faecc8",

                                padding: "8px 12px",

                                borderRadius: "8px",

                                marginTop: "-8px",

                                marginBottom: "16px",

                                display: "inline-flex",

                                alignItems: "center",

                                gap: "6px",

                                fontWeight: "500"
                            }}
                        >
                            💡 Customized items do not have
                            pre-made flower bouquets.
                            They must be made on-demand
                            (make on time).
                        </p>


                        {loading && (

                            <div className="employee-loading">

                                Loading customized assigned tasks...

                            </div>

                        )}


                        {error && (

                            <div className="employee-error">

                                {error}

                            </div>

                        )}


                        {!loading && !error && (

                            <ECustomizedOrderTable

                                orders={assignedOrders}

                                orderItems={orderItems}

                                onItemClick={handleItemClick}

                                onShowItems={handleShowItems}

                                onStart={handleStart}

                                onStop={handleStop}

                                onComplete={handleComplete}

                            />

                        )}

                    </div>

                </div>


                {/* =================================================
                    COMPLETED CUSTOMIZED TASKS
                ================================================= */}

                <div
                    className="dashboard-row"
                    style={{
                        marginTop: '24px'
                    }}
                >

                    <div
                        className="tabs-container"
                        style={{
                            padding: '24px',
                            flex: 1
                        }}
                    >

                        <h3
                            style={{
                                fontFamily:
                                    "'Plus Jakarta Sans', sans-serif",

                                fontSize: "18px",

                                fontWeight: "700",

                                color: "#1a1a1a",

                                marginBottom: "16px"
                            }}
                        >
                            Completed Tasks (Customized Items)
                        </h3>


                        <ECustomizedCompletedTable

                            orders={completedOrders}

                            orderItems={orderItems}

                            onItemClick={handleItemClick}

                            onShowItems={handleShowItems}

                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                CUSTOMIZED ITEM DETAILS POPUP
            ================================================= */}

            {selectedItem && (

                <div
                    className="item-modal-overlay"
                    onClick={handleCloseItem}
                >

                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <ECustomizedItemCard

                            ItemID={
                                selectedItem.itemId
                            }

                            FlowerType={
                                selectedItem.flowerType ||
                                'N/A'
                            }

                            numberOfFlower={
                                selectedItem.numberOfFlowers ??
                                selectedItem.quantity ??
                                'N/A'
                            }

                            BoquetStyle={
                                selectedItem.bouquetStyle ||
                                'N/A'
                            }

                            DecorativeFoliage={
                                selectedItem.decorativeFoliage ||
                                'N/A'
                            }

                            WrappingAndAccents={
                                selectedItem.wrappingAndAccents ||
                                'N/A'
                            }

                            onClose={
                                handleCloseItem
                            }

                        />

                    </div>

                </div>

            )}

        </div>
    );
}