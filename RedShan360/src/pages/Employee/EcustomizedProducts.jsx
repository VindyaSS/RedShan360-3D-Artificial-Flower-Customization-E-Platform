import React, { useEffect, useState } from 'react';

import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ECustomizedOrderTable from '../../components/employeeComponent/ECustomizedOrderTable';
import ECustomizedCompletedTable from '../../components/employeeComponent/ECustomizedCompletedTable';
import ECustomizedItemCard from '../../components/employeeComponent/ECusomizedItemCard';

import '../../css/employee.css';

//------------------ API BASE URL -----------------------------------------------
const API_BASE_URL = 'http://localhost:8080/api';

//------------------ CUSTOMIZED PRODUCTS PAGE -----------------------------------
export default function EcustomizedProducts() {

    //------------------ LOGGED-IN EMPLOYEE -----------------------------------------
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const employeeId = loggedInUser?.employeeId;

    //------------------ STATE ------------------------------------------------------
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //------------------ INITIAL LOAD -----------------------------------------------
    useEffect(() => {
        if (!employeeId) {
            setError('Employee information not found. Please login again.');
            setLoading(false);
            return;
        }

        fetchAssignedOrders();
        fetchCompletedOrders();
    }, [employeeId]);

    //------------------ HELPER: SAFE JSON READER -----------------------------------
    const readJsonResponse = async (response) => {
        const contentType = response.headers.get('content-type') || '';
        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(
                responseText ||
                `Request failed with status ${response.status}`
            );
        }

        if (!contentType.toLowerCase().includes('application/json')) {
            return responseText;
        }

        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Server returned invalid JSON.');
        }
    };

    //------------------ FETCH CUSTOMIZED ASSIGNED ORDERS ---------------------------
    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const url = `${API_BASE_URL}/employee/tasks/assigned/customized/${employeeId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const data = await readJsonResponse(response);
            console.log('[EcustomizedProducts] fetchAssignedOrders - Status:', response.status, '| Data:', data);

            setAssignedOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message || 'Unable to load customized assigned tasks');
            setAssignedOrders([]);
        } finally {
            setLoading(false);
        }
    };

    //------------------ FETCH CUSTOMIZED COMPLETED ORDERS -------------------------
    const fetchCompletedOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${API_BASE_URL}/employee/tasks/completed/customized/${employeeId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const data = await readJsonResponse(response);
            console.log('[EcustomizedProducts] fetchCompletedOrders - Status:', response.status, '| Data:', data);

            setCompletedOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            setCompletedOrders([]);
        }
    };

    //------------------ FETCH CUSTOMIZED ORDER ITEMS -------------------------------
    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${API_BASE_URL}/employee/tasks/order/${orderId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            const data = await readJsonResponse(response);
            if (!Array.isArray(data)) {
                return [];
            }

            const normalizedItems = data.map((item) => ({
                ...item,
                itemId: item.itemId != null ? String(item.itemId) : '',
                itemName: item.itemName || 'Customized Bouquet',
                quantity: item.quantity ?? 0,
                status: item.status || 'PENDING',
                flowerType: item.flowerType || '',
                numberOfFlowers: item.numberOfFlowers ?? item.quantity ?? 0,
                bouquetStyle: item.bouquetStyle || ''
            }));

            return normalizedItems;
        } catch (error) {
            alert(error.message || 'Unable to load customized order items.');
            return [];
        }
    };

    //------------------ SHOW ORDER ITEMS -------------------------------------------
    const handleShowItems = async (orderId) => {
        if (Object.prototype.hasOwnProperty.call(orderItems, orderId)) {
            return;
        }

        const items = await fetchOrderItems(orderId);

        setOrderItems((previousItems) => ({
            ...previousItems,
            [orderId]: items
        }));
    };

    //------------------ START CUSTOMIZED ITEM --------------------------------------
    const handleStart = async (orderId, itemId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/customized/${itemId}/start`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || 'Failed to start customized bouquet');
            }

            // Update local item status
            setAssignedOrders((prev) =>
                prev.map((order) => {
                    if (order.orderId === orderId) {
                        return {
                            ...order,
                            items: (order.items || []).map((item) =>
                                String(item.itemId) === String(itemId)
                                    ? { ...item, status: 'START' }
                                    : item
                            )
                        };
                    }
                    return order;
                })
            );

            await fetchAssignedOrders();
            await fetchCompletedOrders();

            return true;
        } catch (error) {
            alert(error.message || 'Unable to start customized item.');
            return false;
        }
    };

    //------------------ STOP CUSTOMIZED ITEM ---------------------------------------
    const handleStop = async (orderId, itemId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/customized/${itemId}/stop`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || 'Failed to stop customized bouquet');
            }

            setAssignedOrders((prev) =>
                prev.map((order) => {
                    if (order.orderId === orderId) {
                        return {
                            ...order,
                            items: (order.items || []).map((item) =>
                                String(item.itemId) === String(itemId)
                                    ? { ...item, status: 'STOP' }
                                    : item
                            )
                        };
                    }
                    return order;
                })
            );

            await fetchAssignedOrders();
            await fetchCompletedOrders();

            return true;
        } catch (error) {
            alert(error.message || 'Unable to stop customized item.');
            return false;
        }
    };

    //------------------ RESUME CUSTOMIZED ITEM -------------------------------------
    const handleResume = async (orderId, itemId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/customized/${itemId}/resume`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || 'Failed to resume customized bouquet');
            }

            setAssignedOrders((prev) =>
                prev.map((order) => {
                    if (order.orderId === orderId) {
                        return {
                            ...order,
                            items: (order.items || []).map((item) =>
                                String(item.itemId) === String(itemId)
                                    ? { ...item, status: 'START' }
                                    : item
                            )
                        };
                    }
                    return order;
                })
            );

            await fetchAssignedOrders();
            await fetchCompletedOrders();

            return true;
        } catch (error) {
            alert(error.message || 'Unable to resume customized item.');
            return false;
        }
    };

    //------------------ COMPLETE CUSTOMIZED ITEM -----------------------------------
    const handleComplete = async (orderId, itemId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API_BASE_URL}/employee/tasks/${orderId}/customized/${itemId}/complete`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || 'Failed to complete customized bouquet');
            }

            await fetchAssignedOrders();
            await fetchCompletedOrders();

            return true;
        } catch (error) {
            alert(error.message || 'Unable to complete customized item.');
            return false;
        }
    };

    //------------------ ITEM CLICK -------------------------------------------------
    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    //------------------ CLOSE ITEM POPUP -------------------------------------------
    const handleCloseItem = () => {
        setSelectedItem(null);
    };

    //------------------ RENDER -----------------------------------------------------
    return (
        <div className="EPage">
            <div className="Epart1">
                <ESideNavigation />
            </div>

            <div className="Epart2">
                {/* Assigned customized tasks section */}
                <div className="dashboard-row">
                    <div
                        className="tabs-container"
                        style={{ padding: '24px', flex: 1 }}
                    >
                        <h3
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                            💡 Customized items do not have pre-made flower bouquets.
                            They must be made on-demand (make on time).
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
                                onResume={handleResume}
                                onComplete={handleComplete}
                            />
                        )}
                    </div>
                </div>

                {/* Completed customized tasks section */}
                <div
                    className="dashboard-row"
                    style={{ marginTop: '24px' }}
                >
                    <div
                        className="tabs-container"
                        style={{ padding: '24px', flex: 1 }}
                    >
                        <h3
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
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

            {/* Customized item details popup */}
            {selectedItem && (
                <div
                    className="item-modal-overlay"
                    onClick={handleCloseItem}
                >
                    <div onClick={(event) => event.stopPropagation()}>
                        <ECustomizedItemCard
                            ItemID={selectedItem.itemId}
                            FlowerType={selectedItem.flowerType || 'N/A'}
                            numberOfFlower={
                                selectedItem.numberOfFlowers ??
                                selectedItem.quantity ??
                                'N/A'
                            }
                            BoquetStyle={selectedItem.bouquetStyle || 'N/A'}
                            DecorativeFoliage={selectedItem.decorativeFoliage || 'N/A'}
                            WrappingAndAccents={selectedItem.wrappingAndAccents || 'N/A'}
                            onClose={handleCloseItem}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}