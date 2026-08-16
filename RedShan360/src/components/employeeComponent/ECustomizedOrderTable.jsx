import React, { useEffect, useMemo, useState } from 'react';
import {
    Check,
    Play,
    Pause,
    AlertCircle,
    Inbox,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

import EStartButton from './EStartButton';
import EStopButton from './EStopButton';
import ECompletedButton from './ECompletedButton';

import '../../css/employee.css';

// ---------------- CUSTOMIZED ORDER TABLE ----------------
export default function ECustomizedOrderTable({
    orders,
    orderItems,
    onStart,
    onStop,
    onComplete,
    onItemClick
}) {

    // ---------------- BACKEND DATA ----------------
    const displayOrders = Array.isArray(orders) ? orders : [];

    // ---------------- STATE ----------------
    const [rowStatuses, setRowStatuses] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});

    // ---------------- NORMALIZE STATUS ----------------
    const normalizeStatus = (status) => {
        if (!status) {
            return 'PENDING';
        }
        const value = String(status).toUpperCase();
        switch (value) {
            case 'START':
            case 'IN PROGRESS':
            case 'PROCESSING':
                return 'START';
            case 'STOP':
            case 'STOPPED':
                return 'STOP';
            case 'COMPLETED':
                return 'COMPLETED';
            case 'PENDING':
            default:
                return 'PENDING';
        }
    };

    // ---------------- INITIALIZE STATUSES FROM BACKEND ----------------
    useEffect(() => {
        const newStatuses = {};
        displayOrders.forEach((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            items.forEach((item) => {
                const rowKey = `${order.orderId}-${item.itemId}`;
                newStatuses[rowKey] = normalizeStatus(item.status);
            });
        });
        setRowStatuses(newStatuses);
    }, [orders]);

    // ---------------- GROUP ORDERS ----------------
    const groupedOrders = useMemo(() => {
        return displayOrders.map((order) => {
            return {
                orderId: order.orderId,
                numberOfItems: order.numberOfItems ?? 0,
                totalQuantity: order.totalQuantity ?? 0,
                items: Array.isArray(order.items) ? order.items : []
            };
        });
    }, [displayOrders]);

    // ---------------- TOGGLE ORDER EXPAND / COLLAPSE ----------------
    const toggleExpand = (orderId) => {
        setExpandedOrders((previous) => ({
            ...previous,
            [orderId]: !previous[orderId]
        }));
    };

    // ---------------- START / RESUME ITEM ----------------
    const handleStart = async (rowKey, orderId, itemId) => {
        try {
            const result = onStart ? await onStart(orderId, itemId) : true;

            if (result === false) {
                return;
            }

            setRowStatuses((previous) => ({
                ...previous,
                [rowKey]: 'START'
            }));
        } catch (error) {
            // Request failed silently
        }
    };

    // ---------------- STOP ITEM ----------------
    const handleStop = async (rowKey, orderId, itemId) => {
        try {
            const result = onStop ? await onStop(orderId, itemId) : true;

            if (result === false) {
                return;
            }

            setRowStatuses((previous) => ({
                ...previous,
                [rowKey]: 'STOP'
            }));
        } catch (error) {
            // Request failed silently
        }
    };

    // ---------------- COMPLETE ITEM ----------------
    const handleComplete = async (rowKey, orderId, itemId) => {
        try {
            const result = onComplete ? await onComplete(orderId, itemId) : true;

            if (result === false) {
                return;
            }

            setRowStatuses((previous) => ({
                ...previous,
                [rowKey]: 'COMPLETED'
            }));
        } catch (error) {
            // Request failed silently
        }
    };

    // ---------------- STATUS BADGE ----------------
    const renderStatusBadge = (status) => {
        const normalizedStatus = normalizeStatus(status);

        switch (normalizedStatus) {
            case 'START':
                return (
                    <span className="status-badge status-badge-progress">
                        <Play size={10} fill="currentColor" />
                        In Progress
                    </span>
                );

            case 'STOP':
                return (
                    <span className="status-badge status-badge-stopped">
                        <Pause size={10} fill="currentColor" />
                        Stopped
                    </span>
                );

            case 'COMPLETED':
                return (
                    <span className="status-badge status-badge-completed">
                        <Check size={10} />
                        Completed
                    </span>
                );

            case 'PENDING':
            default:
                return (
                    <span className="status-badge status-badge-pending">
                        <AlertCircle size={10} />
                        Pending
                    </span>
                );
        }
    };

    // ---------------- EMPTY STATE ----------------
    if (groupedOrders.length === 0) {
        return (
            <div className="employee-empty-state">
                <div className="employee-empty-icon-wrapper">
                    <Inbox size={32} />
                </div>
                <h3 className="employee-empty-title">
                    No assigned works
                </h3>
                <p className="employee-empty-text">
                    You currently have no customized orders assigned. Check back later!
                </p>
            </div>
        );
    }

    // ---------------- MAIN TABLE ----------------
    return (
        <div className="employee-table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Number of Items</th>
                        <th>Total Quantity</th>
                        <th style={{ textAlign: 'right', paddingRight: '40px' }}>
                            Items Details
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {groupedOrders.map((group) => {
                        const isExpanded = !!expandedOrders[group.orderId];

                        return (
                            <React.Fragment key={group.orderId}>

                                <tr>
                                    <td style={{ fontWeight: '700', color: 'var(--color-primary, #744F51)' }}>
                                        {group.orderId}
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
                                            type="button"
                                            className="expand-btn"
                                            onClick={() => toggleExpand(group.orderId)}
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
                                            style={{ padding: 0, backgroundColor: 'var(--color-bg-page)' }}
                                        >
                                            <div className="expanded-row-container">
                                                <table className="employee-sub-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Custom ID</th>
                                                            <th>Item Name</th>
                                                            <th>Quantity</th>
                                                            <th>Flower Type</th>
                                                            <th>Number of Flowers</th>
                                                            <th>Bouquet Style</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {group.items.length === 0 ? (
                                                            <tr>
                                                                <td
                                                                    colSpan={8}
                                                                    style={{ textAlign: 'center', padding: '20px' }}
                                                                >
                                                                    No customized item details available.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            group.items.map((item) => {
                                                                const customId = item.itemId;
                                                                const rowKey = `${group.orderId}-${customId}`;

                                                                const status =
                                                                    rowStatuses[rowKey] ||
                                                                    normalizeStatus(item.status);

                                                                return (
                                                                    <tr key={rowKey}>

                                                                        <td>
                                                                            <span
                                                                                className="item-id-clickable"
                                                                                onClick={() =>
                                                                                    onItemClick &&
                                                                                    onItemClick({
                                                                                        ...item,
                                                                                        orderId: group.orderId,
                                                                                        itemId: customId
                                                                                    })
                                                                                }
                                                                            >
                                                                                {customId}
                                                                            </span>
                                                                        </td>

                                                                        <td style={{ fontWeight: '600' }}>
                                                                            {item.itemName || 'Customized Bouquet'}
                                                                        </td>

                                                                        <td style={{ fontWeight: '600' }}>
                                                                            {item.quantity ?? 0}
                                                                        </td>

                                                                        <td>
                                                                            {item.flowerType || 'N/A'}
                                                                        </td>

                                                                        <td style={{ fontWeight: '600' }}>
                                                                            {item.numberOfFlowers ?? item.quantity ?? 0}
                                                                        </td>

                                                                        <td>
                                                                            {item.bouquetStyle || 'N/A'}
                                                                        </td>

                                                                        <td>
                                                                            {renderStatusBadge(status)}
                                                                        </td>

                                                                        <td>
                                                                            <div className="employee-table-actions-cell">

                                                                                {status === 'PENDING' && (
                                                                                    <EStartButton
                                                                                        onClick={() =>
                                                                                            handleStart(rowKey, group.orderId, customId)
                                                                                        }
                                                                                        label="Start"
                                                                                    />
                                                                                )}

                                                                                {status === 'START' && (
                                                                                    <>
                                                                                        <EStopButton
                                                                                            onClick={() =>
                                                                                                handleStop(rowKey, group.orderId, customId)
                                                                                            }
                                                                                            label="Stop"
                                                                                        />
                                                                                        <ECompletedButton
                                                                                            onClick={() =>
                                                                                                handleComplete(rowKey, group.orderId, customId)
                                                                                            }
                                                                                            label="Complete"
                                                                                        />
                                                                                    </>
                                                                                )}

                                                                                {status === 'STOP' && (
                                                                                    <>
                                                                                        <EStartButton
                                                                                            onClick={() =>
                                                                                                handleStart(rowKey, group.orderId, customId)
                                                                                            }
                                                                                            label="Resume"
                                                                                        />
                                                                                        <ECompletedButton
                                                                                            onClick={() =>
                                                                                                handleComplete(rowKey, group.orderId, customId)
                                                                                            }
                                                                                            label="Complete"
                                                                                        />
                                                                                    </>
                                                                                )}

                                                                                {status === 'COMPLETED' && (
                                                                                    <span
                                                                                        style={{
                                                                                            color: '#0f766e',
                                                                                            fontWeight: '700',
                                                                                            fontSize: '12.5px',
                                                                                            display: 'inline-flex',
                                                                                            alignItems: 'center',
                                                                                            gap: '4px'
                                                                                        }}
                                                                                    >
                                                                                        <Check size={14} />
                                                                                        Completed
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