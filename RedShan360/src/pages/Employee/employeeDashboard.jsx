import React, { useEffect, useState } from 'react';

import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ENormalOrderTable from '../../components/employeeComponent/ENormalOrderTable';
import ENormalCompletedTable from '../../components/employeeComponent/ENormalCompletedTable';
import ENormalItemCard from '../../components/employeeComponent/ENormalItemCard';

import '../../css/employee.css';

// ---------------- API BASE URL ----------------
const API_BASE_URL = 'http://localhost:8080/api';

// ---------------- EMPLOYEE DASHBOARD PAGE ----------------
export default function EmployeeDashboard() {

  // ---------------- LOGGED-IN EMPLOYEE ----------------
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const employeeId = loggedInUser?.employeeId;

  // ---------------- STATE ----------------
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- ORDER ITEMS MAP ----------------
  // Stores loaded item details keyed by orderId
  const [orderItems, setOrderItems] = useState({});

  // ---------------- CHECK EMPLOYEE LOGIN ----------------
  useEffect(() => {
    if (!employeeId) {
      setError('Employee information not found. Please login again.');
      setLoading(false);
      return;
    }
    fetchAssignedOrders();
    fetchCompletedOrders();
  }, [employeeId]);

  // ---------------- FETCH ASSIGNED ORDERS ----------------
  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/assigned/normal/${employeeId}`,
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
      console.log('[employeeDashboard] fetchAssignedOrders - Status:', response.status, '| Data:', data);

      setAssignedOrders(data);

    } catch (error) {
      setError('Unable to load assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH ORDER ITEM DETAILS ----------------
  const fetchOrderItems = async (orderId) => {
    try {
      const token = localStorage.getItem('token');

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

      if (!response.ok) {
        throw new Error(`Failed to fetch items for order ${orderId}`);
      }

      const data = await response.json();
      console.log('[employeeDashboard] fetchOrderItems - Status:', response.status, '| OrderId:', orderId, '| Data:', data);

      return data;

    } catch (error) {
      return [];
    }
  };

  // ---------------- START TASK ----------------
  const handleStartTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/start`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start task");
      }

      // Update local item status to reflect the started state
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
      alert("Unable to start task.");
      return false;
    }
  };

  // ---------------- STOP TASK ----------------
  const handleStopTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/stop`,
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

      // Update local item status to reflect the stopped state
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
      alert("Unable to stop task.");
      return false;
    }
  };

  // ---------------- RESUME TASK ----------------
  const handleResumeTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/resume`,
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

      // Update local item status to reflect the resumed state
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
      alert("Unable to resume task.");
      return false;
    }
  };

  // ---------------- COMPLETE TASK ----------------
  const handleCompleteTask = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/${orderId}/items/${itemId}/complete`,
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

      // Update local item status to reflect the completed state
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
      alert("Unable to complete task.");
      return false;
    }
  };

  // ---------------- FETCH COMPLETED ORDERS ----------------
  const fetchCompletedOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/employee/tasks/completed/normal/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch completed orders");
      }

      const data = await response.json();
      console.log('[employeeDashboard] fetchCompletedOrders - Status:', response.status, '| Data:', data);

      setCompletedOrders(data);

    } catch (error) {
      setCompletedOrders([]);
    }
  };

  // ---------------- SHOW ORDER ITEMS ----------------
  // Avoids re-fetching if items are already loaded for this order
  const handleShowItems = async (orderId) => {

    if (orderItems[orderId]) {
      return;
    }

    const items = await fetchOrderItems(orderId);

    setOrderItems((previousItems) => ({
      ...previousItems,
      [orderId]: items
    }));
  };

  // ---------------- ITEM CLICK ----------------
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // ---------------- CLOSE ITEM POPUP ----------------
  const handleCloseItem = () => {
    setSelectedItem(null);
  };

  return (
    <div className="EPage">

      <div className="Epart1">
        <ESideNavigation />
      </div>

      <div className="Epart2">

        {/* Assigned tasks section */}
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

            {loading && (
              <div className="employee-loading">
                Loading assigned tasks...
              </div>
            )}

            {error && (
              <div className="employee-error">
                {error}
              </div>
            )}

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

        {/* Completed tasks section */}
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
              orderItems={orderItems}
              onItemClick={handleItemClick}
              onShowItems={handleShowItems}
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