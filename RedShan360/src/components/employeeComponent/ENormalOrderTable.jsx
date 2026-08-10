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
import redRoseBunch from '../../assets/redRoseBouquet.jpg';
import lilyBunch from '../../assets/lilyBoquet.jpg';


/*
 * ============================================
 * BACKEND BASE URL
 * ============================================
 */
const BACKEND_BASE_URL = 'http://localhost:8080';


/*
 * ============================================
 * DEFAULT ORDERS
 * ============================================
 */
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


/*
 * ============================================
 * MOCK STOCK
 * ============================================
 */
const MOCK_STOCK = {
  'ITM-5001': 0,
  'ITM-5002': 0,
  'ITM-5003': 3
};


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

  /*
   * ============================================
   * USE API ORDERS IF AVAILABLE
   * ============================================
   */
  const displayOrders = orders || DEFAULT_ORDERS;


  /*
   * ============================================
   * ROW STATUS
   * ============================================
   */
  const [rowStatuses, setRowStatuses] = useState({});


  /*
   * ============================================
   * EXPANDED ORDERS
   * ============================================
   */
  const [expandedOrders, setExpandedOrders] = useState({});


  /*
   * ============================================
   * STOCK STATES
   * ============================================
   */
  const [checkingStock, setCheckingStock] = useState({});
  const [stockChecked, setStockChecked] = useState({});


  /*
   * ============================================
   * INITIALIZE ROW STATUSES
   * ============================================
   */
  useEffect(() => {

    const newStatuses = {};

    displayOrders.forEach((order) => {

      /*
       * API order only contains order-level data.
       *
       * Item status will be initialized later
       * when the item details are loaded.
       */
      const orderId =
        order.orderId ??
        order.OrderID;

      const itemId =
        order.itemId ??
        order.ItemID;

      const rowKey =
        `${orderId}-${itemId}`;

      newStatuses[rowKey] =
        order.Status ||
        order.status ||
        order.initialStatus ||
        'Pending';
    });

    setRowStatuses(newStatuses);

  }, [orders]);


  /*
   * ============================================
   * GROUP ORDERS
   * ============================================
   */
  const groupedOrders = useMemo(() => {

    return displayOrders.map((order) => {

      const orderId =
        order.orderId ??
        order.OrderID;

      return {
        OrderID: orderId,

        numberOfItems:
          order.numberOfItems ?? 0,

        totalQuantity:
          order.totalQuantity ?? 0,

        /*
         * Actual item details come from:
         *
         * orderItems[orderId]
         */
        items:
          orderItems?.[orderId] || []
      };

    });

  }, [displayOrders, orderItems]);


  /*
   * ============================================
   * IMAGE URL HELPER
   *
   * Backend returns:
   *
   * /uploads/products/C5.jpg
   *
   * We convert it to:
   *
   * http://localhost:8080/uploads/products/C5.jpg
   * ============================================
   */
  const getImageUrl = (imageUrl) => {

    if (!imageUrl) {
      return daisyBunch;
    }

    /*
     * Already a complete URL
     *
     * Example:
     * http://localhost:8080/uploads/products/C5.jpg
     */
    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {
      return imageUrl;
    }

    /*
     * Blob / data URL
     */
    if (
      imageUrl.startsWith('blob:') ||
      imageUrl.startsWith('data:')
    ) {
      return imageUrl;
    }

    /*
     * Relative backend URL
     *
     * /uploads/products/C5.jpg
     */
    if (imageUrl.startsWith('/')) {
      return `${BACKEND_BASE_URL}${imageUrl}`;
    }

    /*
     * Relative path without /
     */
    return `${BACKEND_BASE_URL}/${imageUrl}`;
  };


  /*
   * ============================================
   * EXPAND / COLLAPSE ORDER
   * ============================================
   */
  const toggleExpand = async (orderId) => {

    const isCurrentlyExpanded =
      !!expandedOrders[orderId];

    console.log(
      '================================='
    );

    console.log(
      'SHOW ITEMS CLICKED'
    );

    console.log(
      'ORDER ID:',
      orderId
    );


    /*
     * If opening the order,
     * fetch item details.
     */
    if (
      !isCurrentlyExpanded &&
      onShowItems
    ) {

      console.log(
        'FETCHING ITEMS FOR ORDER:',
        orderId
      );

      await onShowItems(orderId);
    }


    /*
     * Toggle expansion.
     */
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));

  };


  /*
   * ============================================
   * CHECK THE STORE
   * ============================================
   */
  const handleCheckTheStore = (
    orderId,
    item
  ) => {

    console.log(
      '================================='
    );

    console.log(
      'CHECK THE STORE CLICKED'
    );

    console.log(
      'ORDER ID:',
      orderId
    );

    console.log(
      'ITEM ID:',
      item.itemId
    );

    console.log(
      'ITEM NAME:',
      item.itemName
    );

    console.log(
      'REQUIRED QUANTITY:',
      item.quantity
    );

    console.log(
      'FULL ITEM OBJECT:',
      item
    );

    console.log(
      '================================='
    );

  };


  /*
   * ============================================
   * CHECK STOCK
   * ============================================
   */
  const handleCheckStock = (
    rowKey,
    itemId,
    quantity
  ) => {

    setCheckingStock((prev) => ({
      ...prev,
      [rowKey]: true
    }));


    setTimeout(() => {

      const stock =
        MOCK_STOCK[itemId] !== undefined
          ? MOCK_STOCK[itemId]
          : 3;

      const isSufficient =
        stock >= quantity;


      setStockChecked((prev) => ({
        ...prev,
        [rowKey]: {
          available: stock,
          isSufficient
        }
      }));


      setCheckingStock((prev) => ({
        ...prev,
        [rowKey]: false
      }));

    }, 1000);

  };


  /*
   * ============================================
   * READY TO PACKING
   * ============================================
   */
  const handleReadyToPackingClick = (
    rowKey,
    orderId,
    itemId
  ) => {

    setRowStatuses((prev) => ({
      ...prev,
      [rowKey]: 'Ready to Packing'
    }));


    if (onReadyToPacking) {

      onReadyToPacking(
        orderId,
        itemId
      );

    }

  };


  /*
   * ============================================
   * START
   * ============================================
   */
  const handleStart = async (
    rowKey,
    orderId,
    itemId
  ) => {

    if (!onStart) {
      return;
    }


    const success =
      await onStart(
        orderId,
        itemId
      );


    if (success) {

      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress'
      }));

    }

  };


  /*
   * ============================================
   * STOP
   * ============================================
   */
  const handleStop = async (
    rowKey,
    orderId,
    itemId
  ) => {

    if (!onStop) {
      return;
    }


    const success =
      await onStop(
        orderId,
        itemId
      );


    if (success) {

      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Stopped'
      }));

    }

  };


  /*
   * ============================================
   * RESUME
   * ============================================
   */
  const handleResume = async (
    rowKey,
    orderId,
    itemId
  ) => {

    if (!onResume) {
      return;
    }


    const success =
      await onResume(
        orderId,
        itemId
      );


    if (success) {

      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'In Progress'
      }));

    }

  };


  /*
   * ============================================
   * COMPLETE
   * ============================================
   */
  const handleComplete = async (
    rowKey,
    orderId,
    itemId
  ) => {

    if (!onComplete) {
      return;
    }


    const success =
      await onComplete(
        orderId,
        itemId
      );


    if (success) {

      setRowStatuses((prev) => ({
        ...prev,
        [rowKey]: 'Completed'
      }));

    }

  };


  /*
   * ============================================
   * NORMALIZE STATUS
   * ============================================
   */
  const normalizeStatus = (status) => {

    if (!status) {
      return 'Pending';
    }


    const lower =
      String(status)
        .toLowerCase()
        .replace(/_/g, ' ')
        .trim();


    if (lower === 'pending') {
      return 'Pending';
    }


    if (
      lower === 'in progress' ||
      lower === 'inprogress' ||
      lower === 'started' ||
      lower === 'processing'
    ) {
      return 'In Progress';
    }


    if (
      lower === 'stopped' ||
      lower === 'paused' ||
      lower === 'stop'
    ) {
      return 'Stopped';
    }


    if (
      lower === 'completed' ||
      lower === 'complete' ||
      lower === 'done'
    ) {
      return 'Completed';
    }


    if (
      lower === 'ready to packing' ||
      lower === 'ready to pack' ||
      lower === 'ready_to_packing'
    ) {
      return 'Ready to Packing';
    }


    return 'Pending';

  };


  /*
   * ============================================
   * STATUS BADGE
   * ============================================
   */
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


  /*
   * ============================================
   * EMPTY STATE
   * ============================================
   */
  if (groupedOrders.length === 0) {

    return (
      <div className="employee-empty-state">

        <Database
          size={40}
          className="employee-empty-icon"
        />

        <div>
          <strong>
            No assigned works
          </strong>

          <br />

          <span>
            You currently have no normal orders
            assigned. Check back later!
          </span>
        </div>
      </div>
    );

  }


  /*
   * ============================================
   * MAIN TABLE
   * ============================================
   */
  return (

    <div className="employee-table-container">

      <table className="employee-main-table">

        <thead>

          <tr>

            <th>
              Order ID
            </th>

            <th>
              Number of Items
            </th>

            <th>
              Total Quantity
            </th>

            <th className="th-align-right">
              Items Details
            </th>

          </tr>

        </thead>


        <tbody>

          {groupedOrders.map((group) => {

            const isExpanded =
              !!expandedOrders[group.OrderID];


            console.log(
              '================================='
            );

            console.log(
              'ASSIGNED ORDER:',
              group.OrderID
            );

            console.log(
              'ASSIGNED ITEMS:',
              group.items
            );


            return (

              <React.Fragment
                key={group.OrderID}
              >

                {/* ==========================================
                    MAIN ORDER ROW
                   ========================================== */}

                <tr>

                  <td className="td-order-id">
                    {group.OrderID}
                  </td>


                  <td className="td-semibold">
                    {group.numberOfItems}{' '}

                    {group.numberOfItems === 1
                      ? 'Item'
                      : 'Items'}
                  </td>


                  <td className="td-semibold">
                    {group.totalQuantity}
                  </td>


                  <td className="td-align-right">

                    <button
                      type="button"
                      className="expand-btn"
                      onClick={() =>
                        toggleExpand(
                          group.OrderID
                        )
                      }
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


                {/* ==========================================
                    EXPANDED ITEMS
                   ========================================== */}

                {isExpanded && (

                  <tr>

                    <td
                      colSpan={4}
                      className="td-expanded-outer"
                    >

                      <div
                        className="expanded-row-container"
                      >

                        {group.items.length === 0 ? (

                          <div className="items-loading">
                            Loading item details...
                          </div>

                        ) : (

                          <table
                            className="employee-sub-table"
                          >

                            <thead>

                              <tr>

                                <th>
                                  Item ID
                                </th>

                                <th>
                                  Picture
                                </th>

                                <th>
                                  Item Name
                                </th>

                                <th>
                                  Quantity
                                </th>

                                <th>
                                  Status
                                </th>

                                <th>
                                  Actions
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {group.items.map(
                                (item) => {

                                  /*
                                   * ==================================
                                   * ITEM DATA
                                   * ==================================
                                   */

                                  const itemId =
                                    item.itemId;

                                  const rowKey =
                                    `${group.OrderID}-${itemId}`;


                                  /*
                                   * Status
                                   */
                                  const rawStatus =
                                    rowStatuses[rowKey] ||
                                    item.status ||
                                    'Pending';

                                  const status =
                                    normalizeStatus(
                                      rawStatus
                                    );


                                  /*
                                   * ==================================
                                   * IMPORTANT IMAGE FIX
                                   * ==================================
                                   *
                                   * Backend:
                                   *
                                   * /uploads/products/C5.jpg
                                   *
                                   * Browser:
                                   *
                                   * http://localhost:8080/uploads/products/C5.jpg
                                   */

                                  const imageUrl =
                                    item.imageUrl ||
                                    item.image ||
                                    null;

                                  const displayImage =
                                    getImageUrl(
                                      imageUrl
                                    );


                                  console.log(
                                    '================================='
                                  );

                                  console.log(
                                    'ASSIGNED ITEM:'
                                  );

                                  console.log(
                                    'ORDER ID:',
                                    group.OrderID
                                  );

                                  console.log(
                                    'ITEM ID:',
                                    item.itemId
                                  );

                                  console.log(
                                    'ITEM NAME:',
                                    item.itemName
                                  );

                                  console.log(
                                    'IMAGE FROM BACKEND:',
                                    item.imageUrl
                                  );

                                  console.log(
                                    'FINAL IMAGE URL:',
                                    displayImage
                                  );

                                  console.log(
                                    'QUANTITY:',
                                    item.quantity
                                  );

                                  console.log(
                                    'STATUS:',
                                    item.status
                                  );


                                  return (

                                    <tr
                                      key={rowKey}
                                    >

                                      {/* =========================
                                          ITEM ID
                                         ========================= */}

                                      <td>

                                        <span
                                          className="item-id-clickable"
                                          onClick={() => {

                                            console.log(
                                              'ITEM CLICKED:',
                                              item
                                            );

                                            if (
                                              onItemClick
                                            ) {

                                              onItemClick(
                                                item
                                              );

                                            }

                                          }}
                                        >
                                          {item.itemId}
                                        </span>

                                      </td>


                                      {/* =========================
                                          IMAGE
                                         ========================= */}

                                      <td>

                                        <img
                                          src={displayImage}
                                          alt={
                                            item.itemName ||
                                            'Item'
                                          }
                                          className="employee-table-thumbnail"

                                          onLoad={(e) => {

                                            console.log(
                                              'IMAGE LOADED:',
                                              e.currentTarget.src
                                            );

                                          }}

                                          onError={(e) => {

                                            console.error(
                                              'IMAGE FAILED:',
                                              e.currentTarget.src
                                            );

                                            console.error(
                                              'ITEM:',
                                              item
                                            );

                                            /*
                                             * Prevent infinite
                                             * onError loop.
                                             */
                                            e.currentTarget.onerror =
                                              null;

                                            e.currentTarget.src =
                                              daisyBunch;

                                          }}

                                        />

                                      </td>


                                      {/* =========================
                                          ITEM NAME
                                         ========================= */}

                                      <td className="td-semibold">
                                        {item.itemName ||
                                          'Unknown Item'}
                                      </td>


                                      {/* =========================
                                          QUANTITY
                                         ========================= */}

                                      <td className="td-semibold">
                                        {item.quantity ?? 0}
                                      </td>


                                      {/* =========================
                                          STATUS
                                         ========================= */}

                                      <td>
                                        {renderStatusBadge(
                                          status
                                        )}
                                      </td>


                                      {/* =========================
                                          ACTIONS
                                         ========================= */}

                                      <td>

                                        <div
                                          className="employee-table-actions-cell"
                                        >

                                          {/* PENDING */}

                                          {status ===
                                            'Pending' && (

                                            <EStartButton
                                              onClick={() =>
                                                handleStart(
                                                  rowKey,
                                                  group.OrderID,
                                                  item.itemId
                                                )
                                              }
                                              label="Start"
                                            />

                                          )}


                                          {/* IN PROGRESS */}

                                          {status ===
                                            'In Progress' && (

                                            <>

                                              <EStopButton
                                                onClick={() =>
                                                  handleStop(
                                                    rowKey,
                                                    group.OrderID,
                                                    item.itemId
                                                  )
                                                }
                                                label="Stop"
                                              />

                                              <ECompletedButton
                                                onClick={() =>
                                                  handleComplete(
                                                    rowKey,
                                                    group.OrderID,
                                                    item.itemId
                                                  )
                                                }
                                                label="Complete"
                                              />

                                            </>

                                          )}


                                          {/* STOPPED */}

                                          {status ===
                                            'Stopped' && (

                                            <>

                                              <EStartButton
                                                onClick={() =>
                                                  handleResume(
                                                    rowKey,
                                                    group.OrderID,
                                                    item.itemId
                                                  )
                                                }
                                                label="Resume"
                                              />

                                              <ECompletedButton
                                                onClick={() =>
                                                  handleComplete(
                                                    rowKey,
                                                    group.OrderID,
                                                    item.itemId
                                                  )
                                                }
                                                label="Complete"
                                              />

                                            </>

                                          )}


                                          {/* COMPLETED */}

                                          {status ===
                                            'Completed' && (

                                            <span
                                              className="action-status-label action-status-completed"
                                            >

                                              <Check
                                                size={14}
                                              />

                                              Completed

                                            </span>

                                          )}


                                          {/* READY TO PACKING */}

                                          {status ===
                                            'Ready to Packing' && (

                                            <span
                                              className="action-status-label action-status-packing"
                                            >

                                              <Inbox
                                                size={14}
                                              />

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