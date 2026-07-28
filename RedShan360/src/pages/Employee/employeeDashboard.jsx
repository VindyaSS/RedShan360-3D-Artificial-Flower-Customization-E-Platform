import React, { useEffect, useState } from 'react';

import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ENormalOrderTable from '../../components/employeeComponent/ENormalOrderTable';
import ENormalCompletedTable from '../../components/employeeComponent/ENormalCompletedTable';
import ENormalItemCard from '../../components/employeeComponent/ENormalItemCard';

import '../../css/employee.css';

const API_BASE_URL = 'http://localhost:8080/api';

export default function EmployeeDashboard() {

  /* Get logged-in employee information */
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  /* Employee ID comes from login response */
  const employeeId = loggedInUser?.employeeId;

  const [assignedOrders, setAssignedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Store item details for each order
   * Example:
   * {
   *   25: [
   *     {
   *       itemId: 1,
   *       imageUrl: "...",
   *       itemName: "...",
   *       quantity: 3,
   *       stockQuantity: 10,
   *       status: "Pending"
   *     }
   *   ]
   * }
   */
  const [orderItems, setOrderItems] = useState({});

  /* Check employee login */
  useEffect(() => {
    if (!employeeId) {
      setError('Employee information not found. Please login again.');
      setLoading(false);
      return;
    }
    fetchAssignedOrders();
  }, [employeeId]);

  /* Fetch assigned orders */
  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/assigned/${employeeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assigned tasks');
      }

      const data = await response.json();

      console.log("LOGGED-IN EMPLOYEE ID:", employeeId);
      console.log("ASSIGNED ORDERS RESPONSE:", data);

      data.forEach((order) => {
        console.log(
          "Employee ID:", employeeId,
          "| Order ID:", order.orderId,
          "| Number of Items:", order.numberOfItems,
          "| Total Quantity:", order.totalQuantity
        );
      });

      setAssignedOrders(data);

    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      setError('Unable to load assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch item details for one order
   * Backend URL: GET /api/employee/tasks/order/{orderId}
   * Example: /api/employee/tasks/order/25
   */
  const fetchOrderItems = async (orderId) => {
    try {
      const token = localStorage.getItem('token');

      console.log("====================================");
      console.log("FETCHING ORDER ITEM DETAILS");
      console.log("ORDER ID:", orderId);
      console.log("REQUEST URL:", `${API_BASE_URL}/employee/tasks/order/${orderId}`);

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/order/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("ORDER ITEMS RESPONSE STATUS:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch items for order ${orderId}`);
      }

      const data = await response.json();

      console.log("ORDER ITEMS RESPONSE:", data);

      /* Print every item separately */
      if (Array.isArray(data)) {
        data.forEach((item) => {
          console.log("ITEM DETAILS:", {
            itemId: item.itemId,
            imageUrl: item.imageUrl,
            itemName: item.itemName,
            quantity: item.quantity,
            stockQuantity: item.stockQuantity,
            status: item.status
          });
        });
      }

      return data;

    } catch (error) {
      console.error("ERROR FETCHING ORDER ITEMS:", error);
      return [];
    }
  };

  /* Start Task */
  const handleStartTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      console.log("====================================");
      console.log("START TASK");
      console.log("ORDER ID:", orderId);
      console.log("ITEM ID:", itemId);

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/start`,
        {
          method: "PUT", // Change to PUT if your backend uses PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start task");
      }

      // If your backend returns JSON
      // const result = await response.json();
      // console.log(result);

      console.log("Task started successfully.");

      // Update local item status
      setOrderItems((prev) => ({
        ...prev,
        [orderId]: prev[orderId].map((item) =>
          item.itemId === itemId
            ? { ...item, status: "In Progress" }
            : item
        ),
      }));

      return true;
    } catch (error) {
      console.error("START TASK ERROR:", error);
      alert("Unable to start task.");
      return false;
    }
  };

  /* Stop Task */
  const handleStopTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      console.log("====================================");
      console.log("STOP TASK");
      console.log("ORDER ID:", orderId);
      console.log("ITEM ID:", itemId);

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/stop`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to stop task");
      }

      console.log("Task stopped successfully.");

      // Update local item status
      setOrderItems((prev) => ({
        ...prev,
        [orderId]: prev[orderId].map((item) =>
          item.itemId === itemId
            ? { ...item, status: "Stopped" }
            : item
        ),
      }));

      return true;
    } catch (error) {
      console.error("STOP TASK ERROR:", error);
      alert("Unable to stop task.");
      return false;
    }
  };

  /* Resume Task */
  const handleResumeTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      console.log("====================================");
      console.log("RESUME TASK");
      console.log("ORDER ID:", orderId);
      console.log("ITEM ID:", itemId);

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/resume`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resume task");
      }

      console.log("Task resumed successfully.");

      // Update local state
      setOrderItems((prev) => ({
        ...prev,
        [orderId]: prev[orderId].map((item) =>
          item.itemId === itemId
            ? { ...item, status: "In Progress" }
            : item
        ),
      }));

      return true;
    } catch (error) {
      console.error("RESUME TASK ERROR:", error);
      alert("Unable to resume task.");
      return false;
    }
  };

  /* Complete Task */
  const handleCompleteTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      console.log("====================================");
      console.log("COMPLETE TASK");
      console.log("ORDER ID:", orderId);
      console.log("ITEM ID:", itemId);

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }

      console.log("Task completed successfully.");

      // Update local state
      setOrderItems((prev) => ({
        ...prev,
        [orderId]: prev[orderId].map((item) =>
          item.itemId === itemId
            ? { ...item, status: "Completed" }
            : item
        ),
      }));

      return true;
    } catch (error) {
      console.error("COMPLETE TASK ERROR:", error);
      alert("Unable to complete task.");
      return false;
    }
  };


  const handleShowItems = async (orderId) => {
    console.log("SHOW ITEMS CLICKED");
    console.log("ORDER ID:", orderId);

    /* If this order's items are already loaded, do not call the backend again. */
    if (orderItems[orderId]) {
      console.log("ITEMS ALREADY LOADED FOR ORDER:", orderId);
      return;
    }

    const items = await fetchOrderItems(orderId);

    console.log("ITEMS RECEIVED FOR ORDER:", orderId, items);

    /* Store items using order ID */
    setOrderItems((previousItems) => ({
      ...previousItems,
      [orderId]: items
    }));
  };

  /* When an item is clicked */
  const handleItemClick = (item) => {
    console.log("ITEM CLICKED:", item);
    console.log("ITEM ID:", item.itemId);
    console.log("IMAGE URL:", item.imageUrl);
    console.log("ITEM NAME:", item.itemName);
    console.log("QUANTITY:", item.quantity);
    console.log("STOCK QUANTITY:", item.stockQuantity);
    console.log("STATUS:", item.status);

    setSelectedItem(item);
  };

  /* Close popup */
  const handleCloseItem = () => {
    setSelectedItem(null);
  };

  return (
    <div className="EPage">

      {/* Sidebar */}
      <div className="Epart1">
        <ESideNavigation />
      </div>

      {/* Main content */}
      <div className="Epart2">

        {/* Assigned Tasks */}
        <div className="dashboard-row">
          <div
            className="tabs-container"
            style={{ padding: '24px', flex: 1 }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px'
              }}
            >
              Assigned Tasks
            </h3>

            {/* Loading */}
            {loading && (
              <div className="employee-loading">
                Loading assigned tasks...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="employee-error">
                {error}
              </div>
            )}

            {/* Assigned Orders */}
            {!loading && !error && (
              <ENormalOrderTable
    orders={assignedOrders}
    orderItems={orderItems}
    onItemClick={handleItemClick}
    onShowItems={handleShowItems}
    onStart={handleStartTask}
    onStop={handleStopTask}
    onResume={handleResumeTask}
    onComplete={handleCompleteTask}
/>
            )}

          </div>
        </div>

        {/* Completed Tasks */}
        <div className="dashboard-row" style={{ marginTop: '24px' }}>
          <div
            className="tabs-container"
            style={{ padding: '24px', flex: 1 }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px'
              }}
            >
              Completed Tasks
            </h3>

            <ENormalCompletedTable
              orders={completedOrders}
              onItemClick={handleItemClick}
            />

          </div>
        </div>

      </div>

      {/* Item details popup */}
      {selectedItem && (
        <div
          className="item-modal-overlay"
          onClick={handleCloseItem}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <ENormalItemCard
              ItemID={selectedItem.itemId}
              image={selectedItem.imageUrl}
              itemName={selectedItem.itemName}
              quantity={selectedItem.quantity}
              status={selectedItem.status}
              stockQuantity={selectedItem.stockQuantity}
              onClose={handleCloseItem}
            />
          </div>
        </div>
      )}

    </div>
  );
}