import React, { useState, useEffect, useMemo } from 'react';
import { Check, Play, Pause, AlertCircle, Inbox, ChevronDown, ChevronUp } from 'lucide-react';
import EStartButton from './EStartButton';
import EStopButton from './EStopButton';
import ECompletedButton from './ECompletedButton';
import '../../css/employee.css';

import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';
import redRoseBunch from '../../assets/redRoseBouquet.jpg';
import lilyBunch from '../../assets/lilyBoquet.jpg';

const DEFAULT_ORDERS = [
  { OrderID: 'ORD-1002', ItemID: 'ITM-5001', OrderName: 'Vibrant Daisy Bunch', image: daisyBunch, Quantity: 2, initialStatus: 'Pending' },
  { OrderID: 'ORD-1002', ItemID: 'ITM-5003', OrderName: 'Elegant Lily Arrangement', image: lilyBunch, Quantity: 1, initialStatus: 'Pending' },
  { OrderID: 'ORD-1003', ItemID: 'ITM-5002', OrderName: 'Romantic Red Rose Bouquet', image: redRoseBunch, Quantity: 1, initialStatus: 'In Progress' },
  { OrderID: 'ORD-1004', ItemID: 'ITM-5003', OrderName: 'Elegant Lily Arrangement', image: lilyBunch, Quantity: 1, initialStatus: 'Completed' },
  { OrderID: 'ORD-1004', ItemID: 'ITM-5001', OrderName: 'Vibrant Daisy Bunch', image: daisyBunch, Quantity: 2, initialStatus: 'Completed' },
  { OrderID: 'ORD-1004', ItemID: 'ITM-5002', OrderName: 'Romantic Red Rose Bouquet', image: redRoseBunch, Quantity: 1, initialStatus: 'Completed' }
];

export default function ENormalOrderTable({
  orders,
  onStart,
  onStop,
  onComplete,
  onItemClick
}) {
  const displayOrders = orders || DEFAULT_ORDERS;

  // Track status for each row using a unique key: `${OrderID}-${ItemID}`
  const [rowStatuses, setRowStatuses] = useState({});
  // Track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const newStatuses = {};
    displayOrders.forEach(order => {
      const rowKey = `${order.OrderID}-${order.ItemID}`;
      newStatuses[rowKey] = order.Status || order.status || order.initialStatus || 'Pending';
    });
    setRowStatuses(newStatuses);
  }, [orders]);

  // Group displayOrders by OrderID
  const groupedOrders = useMemo(() => {
    const groups = {};
    displayOrders.forEach(item => {
      if (!groups[item.OrderID]) {
        groups[item.OrderID] = {
          OrderID: item.OrderID,
          items: [],
          totalQuantity: 0,
        };
      }
      groups[item.OrderID].items.push(item);
      groups[item.OrderID].totalQuantity += item.Quantity || 1;
    });
    return Object.values(groups);
  }, [displayOrders]);

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleStart = (rowKey, orderId, itemId) => {
    setRowStatuses(prev => ({
      ...prev,
      [rowKey]: 'In Progress'
    }));
    if (onStart) onStart(orderId, itemId);
  };

  const handleStop = (rowKey, orderId, itemId) => {
    setRowStatuses(prev => ({
      ...prev,
      [rowKey]: 'Stopped'
    }));
    if (onStop) onStop(orderId, itemId);
  };

  const handleComplete = (rowKey, orderId, itemId) => {
    setRowStatuses(prev => ({
      ...prev,
      [rowKey]: 'Completed'
    }));
    if (onComplete) onComplete(orderId, itemId);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="status-badge status-badge-progress">
            <Play size={10} fill="currentColor" /> In Progress
          </span>
        );
      case 'Stopped':
        return (
          <span className="status-badge status-badge-stopped">
            <Pause size={10} fill="currentColor" /> Stopped
          </span>
        );
      case 'Completed':
        return (
          <span className="status-badge status-badge-completed">
            <Check size={10} /> Completed
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="status-badge status-badge-pending">
            <AlertCircle size={10} /> Pending
          </span>
        );
    }
  };

  if (groupedOrders.length === 0) {
    return (
      <div className="employee-empty-state">
        <div className="employee-empty-icon-wrapper">
          <Inbox size={32} />
        </div>
        <h3 className="employee-empty-title">No assigned works</h3>
        <p className="employee-empty-text">You currently have no normal orders assigned. Check back later!</p>
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
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--color-primary, #744F51)' }}>
                    {group.OrderID}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'}
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
                        <>
                          Hide Items <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show Items <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={4} style={{ padding: 0, backgroundColor: 'var(--color-bg-page)' }}>
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
                            {group.items.map((item) => {
                              const rowKey = `${item.OrderID}-${item.ItemID}`;
                              const status = rowStatuses[rowKey] || 'Pending';
                              const displayImage = item.image || item.OrderPicture || daisyBunch;

                              return (
                                <tr key={rowKey}>
                                  <td>
                                    <span 
                                      className="item-id-clickable"
                                      onClick={() => onItemClick && onItemClick(item)}
                                    >
                                      {item.ItemID}
                                    </span>
                                  </td>
                                  <td>
                                    <img
                                      src={displayImage}
                                      alt={item.OrderName}
                                      className="employee-table-thumbnail"
                                      onError={(e) => {
                                        e.target.src = daisyBunch;
                                      }}
                                    />
                                  </td>
                                  <td style={{ fontWeight: '600' }}>
                                    {item.OrderName}
                                  </td>
                                  <td style={{ fontWeight: '600' }}>
                                    {item.Quantity || 1}
                                  </td>
                                  <td>
                                    {renderStatusBadge(status)}
                                  </td>
                                  <td>
                                    <div className="employee-table-actions-cell">
                                      {status === 'Pending' && (
                                        <EStartButton onClick={() => handleStart(rowKey, item.OrderID, item.ItemID)} label="Start" />
                                      )}

                                      {status === 'In Progress' && (
                                        <>
                                          <EStopButton onClick={() => handleStop(rowKey, item.OrderID, item.ItemID)} label="Stop" />
                                          <ECompletedButton onClick={() => handleComplete(rowKey, item.OrderID, item.ItemID)} label="Complete" />
                                        </>
                                      )}

                                      {status === 'Stopped' && (
                                        <>
                                          <EStartButton onClick={() => handleStart(rowKey, item.OrderID, item.ItemID)} label="Resume" />
                                          <ECompletedButton onClick={() => handleComplete(rowKey, item.OrderID, item.ItemID)} label="Complete" />
                                        </>
                                      )}

                                      {status === 'Completed' && (
                                        <span style={{
                                          color: '#0f766e',
                                          fontWeight: '700',
                                          fontSize: '12.5px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <Check size={14} /> Completed
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
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
