import React, { useState, useEffect, useMemo } from 'react';
import { Check, Play, Pause, AlertCircle, Inbox, ChevronDown, ChevronUp, Database } from 'lucide-react';

import EStartButton from './EStartButton';
import EStopButton from './EStopButton';
import ECompletedButton from './ECompletedButton';

import '../../css/employee.css';

import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';
import redRoseBunch from '../../assets/redRoseBouquet.jpg';
import lilyBunch from '../../assets/lilyBoquet.jpg';


/* Default orders */
const DEFAULT_ORDERS = [
  {
    OrderID: 'ORD-1002',
    ItemID: 'ITM-5001',
    OrderName: 'Vibrant Daisy Bunch',
    image: daisyBunch,
    Quantity: 2,
    initialStatus: 'Pending'
  },
  {
    OrderID: 'ORD-1002',
    ItemID: 'ITM-5003',
    OrderName: 'Elegant Lily Arrangement',
    image: lilyBunch,
    Quantity: 1,
    initialStatus: 'Pending'
  },
  {
    OrderID: 'ORD-1003',
    ItemID: 'ITM-5002',
    OrderName: 'Romantic Red Rose Bouquet',
    image: redRoseBunch,
    Quantity: 1,
    initialStatus: 'In Progress'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5003',
    OrderName: 'Elegant Lily Arrangement',
    image: lilyBunch,
    Quantity: 1,
    initialStatus: 'Completed'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5001',
    OrderName: 'Vibrant Daisy Bunch',
    image: daisyBunch,
    Quantity: 2,
    initialStatus: 'Completed'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5002',
    OrderName: 'Romantic Red Rose Bouquet',
    image: redRoseBunch,
    Quantity: 1,
    initialStatus: 'Completed'
  }
];


/* Mock stock */
const MOCK_STOCK = {
  'ITM-5001': 0,
  'ITM-5002': 0,
  'ITM-5003': 3
};


export default function ENormalOrderTable({
  orders,
  /* Item details fetched from backend */
  orderItems,
  onStart,
  onStop,
  onResume,
  onComplete,
  onReadyToPacking,
  onItemClick,
  /* Called when Show Items is clicked */
  onShowItems
}) {

  /* Use API orders if available */
  const displayOrders = orders || DEFAULT_ORDERS;

  /* Track status for each row */
  const [rowStatuses, setRowStatuses] = useState({});

  /* Track expanded orders */
  const [expandedOrders, setExpandedOrders] = useState({});

  /* Stock checking states */
  const [checkingStock, setCheckingStock] = useState({});
  const [stockChecked, setStockChecked] = useState({});

  /* Initialize row statuses */
  useEffect(() => {
    const newStatuses = {};
    displayOrders.forEach(order => {
      const rowKey = `${order.OrderID}-${order.ItemID}`;
      newStatuses[rowKey] = order.Status || order.status || order.initialStatus || 'Pending';
    });
    setRowStatuses(newStatuses);
  }, [orders]);


  /* Group orders */
  const groupedOrders = useMemo(() => {
    return displayOrders.map(order => {
      const orderId = order.orderId;
      return {
        OrderID: orderId,
        numberOfItems: order.numberOfItems,
        totalQuantity: order.totalQuantity,
        items: orderItems?.[orderId] || []
      };
    });
  }, [displayOrders, orderItems]);


  /* Expand / collapse order */
  const toggleExpand = (orderId) => {
    const isCurrentlyExpanded = !!expandedOrders[orderId];
    console.log("SHOW ITEMS CLICKED - ORDER ID:", orderId);

    /* Fetch item details only when opening the order */
    if (!isCurrentlyExpanded && onShowItems) {
      onShowItems(orderId);
    }

    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };


  /*
   * Check the Store
   * Frontend only for now. Backend will be connected later.
   */
  const handleCheckTheStore = (orderId, item) => {
    console.log("=================================");
    console.log("CHECK THE STORE CLICKED");
    console.log("ORDER ID:", orderId);
    console.log("ITEM ID:", item.itemId);
    console.log("ITEM NAME:", item.itemName);
    console.log("REQUIRED QUANTITY:", item.quantity);
    console.log("FULL ITEM OBJECT:", item);
    console.log("=================================");
  };


  /* Existing stock checking function - Kept unchanged. */
  const handleCheckStock = (rowKey, itemId, quantity) => {
    setCheckingStock(prev => ({ ...prev, [rowKey]: true }));

    setTimeout(() => {
      const stock = MOCK_STOCK[itemId] !== undefined ? MOCK_STOCK[itemId] : 3;
      const isSufficient = stock >= quantity;

      setStockChecked(prev => ({
        ...prev,
        [rowKey]: { available: stock, isSufficient }
      }));

      setCheckingStock(prev => ({ ...prev, [rowKey]: false }));
    }, 1000);
  };


  /* Ready to packing */
  const handleReadyToPackingClick = (rowKey, orderId, itemId) => {
    setRowStatuses(prev => ({ ...prev, [rowKey]: 'Ready to Packing' }));
    if (onReadyToPacking) {
      onReadyToPacking(orderId, itemId);
    }
  };


  /* Start */
  const handleStart = async (rowKey, orderId, itemId) => {
    if (!onStart) return;

    const success = await onStart(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress',
      }));
    }
  };


  /* Stop */
  const handleStop = async (rowKey, orderId, itemId) => {
    if (!onStop) return;

    const success = await onStop(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Stopped',
      }));
    }
  };


  /* Resume */
  const handleResume = async (rowKey, orderId, itemId) => {
    if (!onResume) return;

    const success = await onResume(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress',
      }));
    }
  };


  /* Complete */
  const handleComplete = async (rowKey, orderId, itemId) => {
    if (!onComplete) return;

    const success = await onComplete(orderId, itemId);

    if (success) {
      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Completed',
      }));
    }
  };


  /* Status badge */
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="status-badge status-badge-progress">
            <Play size={10} fill="currentColor" />
            In Progress
          </span>
        );
      case 'Stopped':
        return (
          <span className="status-badge status-badge-stopped">
            <Pause size={10} fill="currentColor" />
            Stopped
          </span>
        );
      case 'Completed':
        return (
          <span className="status-badge status-badge-completed">
            <Check size={10} />
            Completed
          </span>
        );
      case 'Ready to Packing':
        return (
          <span className="status-badge status-badge-ready-packing">
            <Inbox size={10} />
            Ready to Packing
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-badge status-badge-pending">
            <AlertCircle size={10} />
            Pending
          </span>
        );
    }
  };


  /* Empty state */
  if (groupedOrders.length === 0) {
    return (
      <div className="employee-empty-state">
        <div className="employee-empty-icon-wrapper">
          <Inbox size={32} />
        </div>
        <h3 className="employee-empty-title">No assigned works</h3>
        <p className="employee-empty-text">
          You currently have no normal orders assigned. Check back later!
        </p>
      </div>
    );
  }


  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Number of Items</th>
            <th>Total Quantity</th>
            <th style={{ textAlign: 'right', paddingRight: '40px' }}>Items Details</th>
          </tr>
        </thead>

        <tbody>
          {groupedOrders.map((group) => {
            const isExpanded = !!expandedOrders[group.OrderID];

            return (
              <React.Fragment key={group.OrderID}>

                {/* Main order row */}
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--color-primary, #744F51)' }}>
                    {group.OrderID}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {group.numberOfItems}{' '}
                    {group.numberOfItems === 1 ? 'Item' : 'Items'}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {group.totalQuantity}
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(group.OrderID)}
                    >
                      {isExpanded ? (
                        <>Hide Items <ChevronUp size={16} /></>
                      ) : (
                        <>Show Items <ChevronDown size={16} /></>
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded item section */}
                {isExpanded && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ padding: 0, backgroundColor: 'var(--color-bg-page)' }}
                    >
                      <div className="expanded-row-container">
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
                            {group.items.length === 0 ? (
                              <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                  Loading item details...
                                </td>
                              </tr>
                            ) : (
                              group.items.map((item) => {
                                /* Backend item fields */
                                const itemId = item.itemId;
                                const rowKey = `${group.OrderID}-${itemId}`;

                                const rawStatus = rowStatuses[rowKey] || item.status || 'Pending';

                                /* Normalize status to match comparison strings */
                                const normalizeStatus = (s) => {
                                  if (!s) return 'Pending';
                                  const lower = s.toLowerCase().replace(/_/g, ' ');
                                  if (lower === 'pending') return 'Pending';
                                  if (lower === 'in progress' || lower === 'inprogress' || lower === 'started') return 'In Progress';
                                  if (lower === 'stopped' || lower === 'paused') return 'Stopped';
                                  if (lower === 'completed' || lower === 'done' || lower === 'complete') return 'Completed';
                                  if (lower === 'ready to packing' || lower === 'ready to pack') return 'Ready to Packing';
                                  return 'Pending';
                                };

                                const status = normalizeStatus(rawStatus);
                                const displayImage = item.imageUrl || item.image || daisyBunch;

                                return (
                                  <tr key={rowKey}>

                                    {/* Item ID */}
                                    <td>
                                      <span
                                        className="item-id-clickable"
                                        onClick={() => {
                                          console.log("ITEM CLICKED:", item);
                                          if (onItemClick) {
                                            onItemClick(item);
                                          }
                                        }}
                                      >
                                        {item.itemId}
                                      </span>
                                    </td>

                                    {/* Image */}
                                    <td>
                                      <img
                                        src={displayImage}
                                        alt={item.itemName}
                                        className="employee-table-thumbnail"
                                        onError={(e) => { e.target.src = daisyBunch; }}
                                      />
                                    </td>

                                    {/* Item name */}
                                    <td style={{ fontWeight: '600' }}>
                                      {item.itemName}
                                    </td>

                                    {/* Quantity */}
                                    <td style={{ fontWeight: '600' }}>
                                      {item.quantity}
                                    </td>

                                    {/* Status */}
                                    <td>
                                      {renderStatusBadge(status)}
                                    </td>

                                    {/* Actions */}
                                    <td>
                                      <div
                                        className="employee-table-actions-cell"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                      >
                                        {/* Pending: Start button */}
                                        {status === 'Pending' && (
                                          <EStartButton
                                            onClick={() => handleStart(rowKey, group.OrderID, item.itemId)}
                                            label="Start"
                                          />
                                        )}

                                        {/* In Progress: Stop + Complete */}
                                        {status === 'In Progress' && (
                                          <>
                                            <EStopButton
                                              onClick={() => handleStop(rowKey, group.OrderID, item.itemId)}
                                              label="Stop"
                                            />
                                            <ECompletedButton
                                              onClick={() => handleComplete(rowKey, group.OrderID, item.itemId)}
                                              label="Complete"
                                            />
                                          </>
                                        )}

                                        {/* Stopped: Resume + Complete */}
                                        {status === 'Stopped' && (
                                          <>
                                            <EStartButton
                                              onClick={() => handleResume(rowKey, group.OrderID, item.itemId)}
                                              label="Resume"
                                            />
                                            <ECompletedButton
                                              onClick={() => handleComplete(rowKey, group.OrderID, item.itemId)}
                                              label="Complete"
                                            />
                                          </>
                                        )}

                                        {status === 'Completed' && (
                                          <span>
                                            <Check size={14} /> Completed
                                          </span>
                                        )}

                                        {status === 'Ready to Packing' && (
                                          <span>
                                            <Inbox size={14} /> Ready to Packing
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
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