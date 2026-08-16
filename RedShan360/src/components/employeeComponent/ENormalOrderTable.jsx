import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Play,
  Pause,
  AlertCircle,
  Inbox,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';

import EStartButton from './EStartButton';
import EStopButton from './EStopButton';
import ECompletedButton from './ECompletedButton';

import '../../css/employee.css';

import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';

// ---------------- BACKEND BASE URL ----------------
const BACKEND_BASE_URL = 'http://localhost:8080';

// ---------------- NORMAL ORDER TABLE ----------------
export default function ENormalOrderTable({
  orders,
  orderItems,
  onStart,
  onStop,
  onResume,
  onComplete,
  onReadyToPacking,
  onItemClick,
  onShowItems
}) {

  // ---------------- BACKEND DATA ----------------
  const displayOrders = orders || [];

  // ---------------- STATE ----------------
  const [rowStatuses, setRowStatuses] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  // ---------------- INITIALIZE ROW STATUSES ----------------
  useEffect(() => {

    const newStatuses = {};

    displayOrders.forEach((order) => {

      const orderId = order.orderId ?? order.OrderID;
      const itemId = order.itemId ?? order.ItemID;
      const rowKey = `${orderId}-${itemId}`;

      newStatuses[rowKey] =
        order.Status ||
        order.status ||
        order.initialStatus ||
        'Pending';
    });

    setRowStatuses(newStatuses);

  }, [orders]);

  // ---------------- GROUP ORDERS ----------------
  // Actual item details come from orderItems[orderId]
  const groupedOrders = useMemo(() => {

    return displayOrders.map((order) => {

      const orderId = order.orderId ?? order.OrderID;

      return {
        OrderID: orderId,
        numberOfItems: order.numberOfItems ?? 0,
        totalQuantity: order.totalQuantity ?? 0,
        items: orderItems?.[orderId] || []
      };

    });

  }, [displayOrders, orderItems]);

  // ---------------- IMAGE URL HELPER ----------------
  // Backend returns relative paths (e.g. /uploads/products/C5.jpg).
  // Prepend the backend base URL to make them absolute.
  const getImageUrl = (imageUrl) => {

    if (!imageUrl) {
      return daisyBunch;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
      return `${BACKEND_BASE_URL}${imageUrl}`;
    }

    return `${BACKEND_BASE_URL}/${imageUrl}`;
  };

  // ---------------- TOGGLE ORDER EXPAND / COLLAPSE ----------------
  const toggleExpand = async (orderId) => {

    const isCurrentlyExpanded = !!expandedOrders[orderId];

    // Fetch item details when opening the order for the first time
    if (!isCurrentlyExpanded && onShowItems) {
      await onShowItems(orderId);
    }

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));

  };

  // ---------------- READY TO PACKING ----------------
  const handleReadyToPackingClick = (rowKey, orderId, itemId) => {

    setRowStatuses((prev) => ({
      ...prev,
      [rowKey]: 'Ready to Packing'
    }));

    if (onReadyToPacking) {
      onReadyToPacking(orderId, itemId);
    }

  };

  // ---------------- START ----------------
  const handleStart = async (rowKey, orderId, itemId) => {

    if (!onStart) {
      return;
    }

    const success = await onStart(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress'
      }));
    }

  };

  // ---------------- STOP ----------------
  const handleStop = async (rowKey, orderId, itemId) => {

    if (!onStop) {
      return;
    }

    const success = await onStop(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Stopped'
      }));
    }

  };

  // ---------------- RESUME ----------------
  const handleResume = async (rowKey, orderId, itemId) => {

    if (!onResume) {
      return;
    }

    const success = await onResume(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress'
      }));
    }

  };

  // ---------------- COMPLETE ----------------
  const handleComplete = async (rowKey, orderId, itemId) => {

    if (!onComplete) {
      return;
    }

    const success = await onComplete(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Completed'
      }));
    }

  };

  // ---------------- NORMALIZE STATUS ----------------
  // Maps backend/API status strings to display-ready values
  const normalizeStatus = (status) => {

    if (!status) {
      return 'Pending';
    }

    const lower = String(status).toLowerCase().replace(/_/g, ' ').trim();

    if (lower === 'pending') {
      return 'Pending';
    }

    if (lower === 'in progress' || lower === 'inprogress' || lower === 'started' || lower === 'processing') {
      return 'In Progress';
    }

    if (lower === 'stopped' || lower === 'paused' || lower === 'stop') {
      return 'Stopped';
    }

    if (lower === 'completed' || lower === 'complete' || lower === 'done') {
      return 'Completed';
    }

    if (lower === 'ready to packing' || lower === 'ready to pack' || lower === 'ready_to_packing') {
      return 'Ready to Packing';
    }

    return 'Pending';

  };

  // ---------------- STATUS BADGE ----------------
  const renderStatusBadge = (status) => {

    switch (status) {

      case 'In Progress':
        return (
          <span
            style={{
              color: '#1d4ed8',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '12.5px'
            }}
          >
            <Play size={12} />
            In Progress
          </span>
        );

      case 'Stopped':
        return (
          <span
            style={{
              color: '#b45309',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '12.5px'
            }}
          >
            <Pause size={12} />
            Stopped
          </span>
        );

      case 'Completed':
        return (
          <span
            style={{
              color: '#0f766e',
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '12.5px'
            }}
          >
            <Check size={12} />
            Completed
          </span>
        );

      case 'Ready to Packing':
        return (
          <span
            style={{
              color: '#3730a3',
              backgroundColor: '#e0e7ff',
              border: '1px solid #c7d2fe',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '12.5px'
            }}
          >
            <Inbox size={12} />
            Ready to Packing
          </span>
        );

      case 'Pending':
      default:
        return (
          <span
            style={{
              color: '#92400e',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '12.5px'
            }}
          >
            <AlertCircle size={12} />
            Pending
          </span>
        );

    }

  };

  // ---------------- EMPTY STATE ----------------
  if (groupedOrders.length === 0) {

    return (
      <div className="employee-empty-state">

        <Database
          size={40}
          className="employee-empty-icon"
        />

        <div>
          <strong>No assigned works</strong>
          <br />
          <span>
            You currently have no normal orders assigned. Check back later!
          </span>
        </div>
      </div>
    );

  }

  // ---------------- MAIN TABLE ----------------
  return (

    <div className="employee-table-container">

      <table className="employee-main-table">

        <thead>
          <tr>
            <th>Order ID</th>
            <th>Number of Items</th>
            <th>Total Quantity</th>
            <th className="th-align-right">Items Details</th>
          </tr>
        </thead>

        <tbody>

          {groupedOrders.map((group) => {

            const isExpanded = !!expandedOrders[group.OrderID];

            return (

              <React.Fragment key={group.OrderID}>

                <tr>

                  <td className="td-order-id">
                    {group.OrderID}
                  </td>

                  <td className="td-semibold">
                    {group.numberOfItems}{' '}
                    {group.numberOfItems === 1 ? 'Item' : 'Items'}
                  </td>

                  <td className="td-semibold">
                    {group.totalQuantity}
                  </td>

                  <td className="td-align-right">
                    <button
                      type="button"
                      className="expand-btn"
                      onClick={() => toggleExpand(group.OrderID)}
                    >
                      {isExpanded ? (
                        <>
                          Hide Items
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show Items
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </td>

                </tr>

                {isExpanded && (

                  <tr>

                    <td
                      colSpan={4}
                      className="td-expanded-outer"
                    >

                      <div className="expanded-row-container">

                        {group.items.length === 0 ? (

                          <div className="items-loading">
                            Loading item details...
                          </div>

                        ) : (

                          <table className="employee-sub-table">

                            <thead>
                              <tr>
                                <th>Item ID</th>
                                <th>Picture</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>

                            <tbody>

                              {group.items.map(
                                (item) => {

                                  const itemId = item.itemId;
                                  const rowKey = `${group.OrderID}-${itemId}`;

                                  const rawStatus =
                                    rowStatuses[rowKey] ||
                                    item.status ||
                                    'Pending';

                                  const status = normalizeStatus(rawStatus);

                                  // Resolve image URL — backend returns relative path
                                  const imageUrl = item.imageUrl || item.image || null;
                                  const displayImage = getImageUrl(imageUrl);

                                  return (

                                    <tr key={rowKey}>

                                      <td>
                                        <span
                                          className="item-id-clickable"
                                          onClick={() => {
                                            if (onItemClick) {
                                              onItemClick(item);
                                            }
                                          }}
                                        >
                                          {item.itemId}
                                        </span>
                                      </td>

                                      <td>
                                        <img
                                          src={displayImage}
                                          alt={item.itemName || 'Item'}
                                          className="employee-table-thumbnail"
                                          onError={(e) => {
                                            // Prevent infinite error loop and fall back to default image
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = daisyBunch;
                                          }}
                                        />
                                      </td>

                                      <td className="td-semibold">
                                        {item.itemName || 'Unknown Item'}
                                      </td>

                                      <td className="td-semibold">
                                        {item.quantity ?? 0}
                                      </td>

                                      <td>
                                        {renderStatusBadge(status)}
                                      </td>

                                      <td>

                                        <div className="employee-table-actions-cell">

                                          {/* Pending: show Start */}
                                          {status === 'Pending' && (
                                            <EStartButton
                                              onClick={() =>
                                                handleStart(rowKey, group.OrderID, item.itemId)
                                              }
                                              label="Start"
                                            />
                                          )}

                                          {/* In progress: show Stop and Complete */}
                                          {status === 'In Progress' && (
                                            <>
                                              <EStopButton
                                                onClick={() =>
                                                  handleStop(rowKey, group.OrderID, item.itemId)
                                                }
                                                label="Stop"
                                              />
                                              <ECompletedButton
                                                onClick={() =>
                                                  handleComplete(rowKey, group.OrderID, item.itemId)
                                                }
                                                label="Complete"
                                              />
                                            </>
                                          )}

                                          {/* Stopped: show Resume and Complete */}
                                          {status === 'Stopped' && (
                                            <>
                                              <EStartButton
                                                onClick={() =>
                                                  handleResume(rowKey, group.OrderID, item.itemId)
                                                }
                                                label="Resume"
                                              />
                                              <ECompletedButton
                                                onClick={() =>
                                                  handleComplete(rowKey, group.OrderID, item.itemId)
                                                }
                                                label="Complete"
                                              />
                                            </>
                                          )}

                                          {/* Completed: show completed label */}
                                          {status === 'Completed' && (
                                            <span className="action-status-label action-status-completed">
                                              <Check size={14} />
                                              Completed
                                            </span>
                                          )}

                                          {/* Ready to Packing: show packing label */}
                                          {status === 'Ready to Packing' && (
                                            <span className="action-status-label action-status-packing">
                                              <Inbox size={14} />
                                              Ready to Packing
                                            </span>
                                          )}

                                        </div>

                                      </td>

                                    </tr>

                                  );

                                }
                              )}

                            </tbody>

                          </table>

                        )}

                      </div>

                    </td>

                  </tr>

                )}

              </React.Fragment>

            );

          })}

        </tbody>

      </table>

    </div>

  );

}