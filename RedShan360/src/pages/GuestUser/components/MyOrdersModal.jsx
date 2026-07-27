import { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Calendar, CreditCard, Clock, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import { getProductImageUrl } from '../../../utils/imageHelper';

const MyOrdersModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user from localStorage
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user in MyOrdersModal:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fetch orders
  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/orders/my-orders/${userId}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error fetching my orders:', err);
        setError('Failed to retrieve order tracking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstimatedDelivery = (dateStr, status) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Standard estimated delivery is 4 days after order date
    const estDate = new Date(date.getTime() + 4 * 24 * 60 * 60 * 1000);
    const formatted = estDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if ((status || '').toUpperCase() === 'STOP') {
      return `Delivered on ${formatted}`;
    }
    return formatted;
  };

  // Status mapping constants
  const STEPS = [
    { name: 'Order Confirmed', key: 'PENDING', icon: '📝', color: 'yellow', themeClass: 'from-yellow-400 to-yellow-500' },
    { name: 'Processing', key: 'START', icon: '🌸', color: 'blue', themeClass: 'from-blue-400 to-blue-500' },
    { name: 'Completed', key: 'COMPLETED', icon: '✅', color: 'orange', themeClass: 'from-orange-400 to-orange-500' },
    { name: 'Dispatched to Courier', key: 'STOP', icon: '🚚', color: 'green', themeClass: 'from-green-400 to-green-500' }
  ];

  const getStepIndex = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'PENDING') return 0;
    if (upper === 'START') return 1;
    if (upper === 'COMPLETED') return 2;
    if (upper === 'STOP') return 3;
    return 0; // fallback
  };

  const getStatusDescription = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'PENDING') {
      return 'Your order has been received and is waiting to begin processing.';
    }
    if (upper === 'START') {
      return 'Our team has started preparing your bouquet.';
    }
    if (upper === 'COMPLETED') {
      return 'Your order has been dispatched to the courier.';
    }
    if (upper === 'STOP') {
      return 'Your order has been completed successfully.';
    }
    return 'Your order status is being updated.';
  };

  const getBadgeColors = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'PENDING') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (upper === 'START') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (upper === 'COMPLETED') return 'bg-orange-50 text-orange-700 border-orange-200';
    if (upper === 'STOP') return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getSubStatusLabel = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'PENDING') return 'Order Confirmed';
    if (upper === 'START') return 'Processing';
    if (upper === 'COMPLETED') return 'Dispatched to Courier';
    if (upper === 'STOP') return 'Completed';
    return status || 'Pending';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300 animate-fade-in text-left">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0px var(--glow-color); }
          50% { box-shadow: 0 0 16px 6px var(--glow-color); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 4s ease infinite;
        }
      `}</style>

      {/* Modal Container */}
      <div
        className="w-[95%] md:w-[75%] h-[90%] md:h-[80%] bg-[#faf8f6]/95 backdrop-blur-xl border border-white/40 shadow-2xl flex flex-col relative animate-scale-up"
        style={{ borderRadius: '20px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start px-6 md:px-8 pt-6 pb-4 border-b border-[#f3eee9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl">📦</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#2d211e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                My Orders
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#8a726d] font-medium mt-1">
              Track your flower orders in real time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 md:p-3 rounded-full text-[#8a726d]/70 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={24} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 border-4 border-[#8c5e5e]/30 border-t-[#8c5e5e] rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#8c5e5e]">Loading order history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50/50 rounded-2xl border border-red-100 max-w-xl mx-auto px-6 w-full flex flex-col items-center">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <h3 className="font-extrabold text-lg text-red-950 mb-1">Failed to Load Orders</h3>
              <p className="text-xs text-red-700/80 mb-6">{error}</p>
              <button
                onClick={() => onClose()}
                className="py-3 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Close Dashboard
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6 max-w-lg mx-auto">
              {/* Premium Flower SVG Illustration */}
              <div className="w-40 h-40 mb-6 text-[#8c5e5e]/25 animate-pulse">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                  <path d="M50 25c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
                  <path d="M50 75c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
                  <path d="M25 50c0-8.3-6.7-15-15-15S-5 41.7-5 50s6.7 15 15 15 15-6.7 15-15z" />
                  <path d="M75 50c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15z" />
                  <path d="M32.3 32.3c-5.9-5.9-5.9-15.4 0-21.2s15.4-5.9 21.2 0 5.9 15.4 0 21.2-15.3 5.9-21.2 0z" />
                  <path d="M67.7 67.7c-5.9-5.9-5.9-15.4 0-21.2s15.4-5.9 21.2 0 5.9 15.4 0 21.2-15.3 5.9-21.2 0z" />
                  <path d="M32.3 67.7c-5.9 5.9-15.4 5.9-21.2 0s-5.9-15.4 0-21.2 15.4-5.9 21.2 0 5.9 15.4 0 21.2z" />
                  <path d="M67.7 32.3c-5.9 5.9-15.4 5.9-21.2 0s-5.9-15.4 0-21.2 15.4-5.9 21.2 0 5.9 15.4 0 21.2z" />
                  <circle cx="50" cy="50" r="12" className="text-[#8c5e5e]/40" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#2d211e] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                No Orders Yet
              </h3>
              <p className="text-sm text-[#8a726d] leading-relaxed mb-8">
                Your future flower orders will appear here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/shop';
                }}
                className="py-3 px-8 rounded-xl bg-[#8c5e5e] hover:bg-[#7a5050] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="flex flex-col gap-8 pb-4">
              {orders.map((order) => {
                const currentStepIdx = getStepIndex(order.currentSubStatus);
                const isOrderCompleted = (order.currentSubStatus || '').toUpperCase() === 'STOP';

                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-2xl border border-[#ede7e2] p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6"
                  >
                    {/* Upper Section: Details & Status Badge */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between pb-5 border-b border-[#f6f2ee]">
                      {/* Products List & Quantities */}
                      <div className="flex flex-col md:flex-row gap-5 items-start flex-1 w-full">
                        {/* Image Preview Container */}
                        <div className="w-24 h-28 bg-[#fbf9f8] rounded-xl overflow-hidden border border-[#ede7e2] flex-shrink-0 flex items-center justify-center">
                          {order.items && order.items[0] && order.items[0].productName === 'Customized Bouquet' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-[#8c5e5e] font-extrabold bg-[#8c5e5e]/5 p-2 text-center select-none">
                              <ShoppingBag size={22} className="mb-1 text-[#8c5e5e]/70" />
                              3D BOUQUET
                            </div>
                          ) : (
                            <img
                              src={getProductImageUrl(order.items?.[0]?.imageUrl)}
                              alt={order.items?.[0]?.productName || 'Order Product'}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/product-placeholder.png";
                              }}
                            />
                          )}
                        </div>

                        {/* Order Text Metadata */}
                        <div className="flex-1 flex flex-col justify-between h-full pt-1">
                          <div>
                            <h4 className="font-extrabold text-base md:text-lg text-[#2d211e] line-clamp-1 leading-tight">
                              {order.items?.[0]?.productName || 'Customized Flower Bouquet'}
                              {order.items && order.items.length > 1 && (
                                <span className="text-xs font-bold text-[#8c5e5e] ml-2 px-2 py-0.5 bg-[#8c5e5e]/10 rounded-full">
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] font-extrabold text-[#8a726d]/60 uppercase tracking-wider mt-1.5">
                              Order ID: <span className="text-[#2d211e] font-bold">#ORDER-{order.orderId}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mt-3 pt-3 border-t border-[#faf7f5] text-xs">
                            <div>
                              <span className="text-[#8a726d] block mb-0.5 font-medium">Quantity</span>
                              <span className="font-bold text-[#2d211e]">
                                {order.items?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0} items
                              </span>
                            </div>
                            <div>
                              <span className="text-[#8a726d] block mb-0.5 font-medium">Order Date</span>
                              <span className="font-bold text-[#2d211e] flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#8a726d]" />
                                {formatDate(order.orderDate)}
                              </span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <span className="text-[#8a726d] block mb-0.5 font-medium">Price</span>
                              <span className="font-extrabold text-[#ea580c]">
                                Rs. {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="w-full lg:w-auto flex justify-between lg:flex-col lg:items-end items-center border-t lg:border-t-0 border-[#f6f2ee] pt-3 lg:pt-0 gap-2">
                        <span className="text-[10px] font-extrabold text-[#8a726d]/60 uppercase tracking-widest block lg:mb-1">
                          Current Status
                        </span>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeColors(order.currentSubStatus)}`}>
                          {getSubStatusLabel(order.currentSubStatus)}
                        </span>
                      </div>
                    </div>

                    {/* Tracker Section (Timeline) */}
                    <div className="py-4 px-1">
                      {/* Timeline Header (For mobile context) */}
                      <span className="text-[10px] font-extrabold text-[#8a726d]/60 uppercase tracking-widest block mb-6">
                        Order Journey
                      </span>

                      {/* Desktop Horizontal Tracker */}
                      <div className="hidden md:block relative select-none">
                        {/* Connecting Line Track */}
                        <div className="absolute top-5 left-8 right-8 h-1 bg-[#ede7e2] rounded-full z-0" />

                        {/* Active Colored Progress Line */}
                        <div
                          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-yellow-400 via-blue-500 via-orange-500 to-green-500 animate-gradient rounded-full z-0 transition-all duration-500"
                          style={{
                            width: `${(currentStepIdx / (STEPS.length - 1)) * 88}%`,
                          }}
                        />

                        {/* Steps Nodes */}
                        <div className="flex justify-between items-center relative z-10">
                          {STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            const isFuture = idx > currentStepIdx;

                            // Determine glowing rings colors
                            let glowColor = '';
                            if (step.color === 'yellow') glowColor = 'rgba(234, 179, 8, 0.4)';
                            if (step.color === 'blue') glowColor = 'rgba(59, 130, 246, 0.4)';
                            if (step.color === 'orange') glowColor = 'rgba(249, 115, 22, 0.4)';
                            if (step.color === 'green') glowColor = 'rgba(34, 197, 94, 0.4)';

                            return (
                              <div key={step.key} className="flex flex-col items-center group relative cursor-pointer">
                                {/* Circle Node */}
                                <div
                                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                    ? `bg-gradient-to-br ${step.themeClass} text-white shadow-md hover:scale-110`
                                    : isCurrent
                                      ? `bg-gradient-to-br ${step.themeClass} text-white hover:scale-110`
                                      : 'bg-white border-2 border-gray-300 text-gray-400 hover:border-gray-400'
                                    }`}
                                  style={{
                                    animation: isCurrent ? 'pulseGlow 2s infinite' : 'none',
                                    '--glow-color': glowColor,
                                    transform: isCurrent ? 'scale(1.15)' : 'none',
                                  }}
                                >
                                  {isCompleted ? (
                                    <Check size={18} className="stroke-[3]" />
                                  ) : (
                                    <span className="text-lg">{step.icon}</span>
                                  )}
                                </div>

                                {/* Step Name Label */}
                                <div className="mt-3 flex flex-col items-center">
                                  <span className={`text-xs font-bold transition-all duration-200 ${isCurrent ? 'text-[#2d211e]' : 'text-[#8a726d]'}`}>
                                    {step.name}
                                  </span>
                                </div>

                                {/* Custom Glow Ring on Hover */}
                                <div className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 bg-[#8c5e5e]/5 transition-opacity duration-300 pointer-events-none -z-10" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mobile Vertical Tracker */}
                      <div className="block md:hidden relative pl-8 select-none">
                        {/* Connecting Line Track */}
                        <div className="absolute top-4 left-4 bottom-4 w-1 bg-[#ede7e2] rounded-full z-0" />

                        {/* Active Colored Progress Line */}
                        <div
                          className="absolute top-4 left-4 w-1 bg-gradient-to-b from-yellow-400 via-blue-500 via-orange-500 to-green-500 animate-gradient rounded-full z-0 transition-all duration-500"
                          style={{
                            height: `${(currentStepIdx / (STEPS.length - 1)) * 88}%`,
                          }}
                        />

                        {/* Steps Nodes */}
                        <div className="flex flex-col gap-8 relative z-10">
                          {STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            const isFuture = idx > currentStepIdx;

                            // Determine glowing rings colors
                            let glowColor = '';
                            if (step.color === 'yellow') glowColor = 'rgba(234, 179, 8, 0.4)';
                            if (step.color === 'blue') glowColor = 'rgba(59, 130, 246, 0.4)';
                            if (step.color === 'orange') glowColor = 'rgba(249, 115, 22, 0.4)';
                            if (step.color === 'green') glowColor = 'rgba(34, 197, 94, 0.4)';

                            return (
                              <div key={step.key} className="flex items-center gap-4 group cursor-pointer text-left">
                                {/* Circle Node */}
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isCompleted
                                    ? `bg-gradient-to-br ${step.themeClass} text-white shadow-md`
                                    : isCurrent
                                      ? `bg-gradient-to-br ${step.themeClass} text-white scale-110`
                                      : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}
                                  style={{
                                    animation: isCurrent ? 'pulseGlow 2s infinite' : 'none',
                                    '--glow-color': glowColor,
                                  }}
                                >
                                  {isCompleted ? (
                                    <Check size={14} className="stroke-[3]" />
                                  ) : (
                                    <span className="text-base">{step.icon}</span>
                                  )}
                                </div>

                                {/* Step Text */}
                                <div>
                                  <span className={`text-xs font-bold block ${isCurrent ? 'text-[#2d211e]' : 'text-[#8a726d]'}`}>
                                    {step.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Status Description Info Box */}
                    <div className={`p-4 rounded-xl border flex gap-3 items-start text-xs font-medium leading-relaxed shadow-sm transition-all duration-300 ${order.currentSubStatus?.toUpperCase() === 'PENDING' ? 'bg-yellow-50/70 border-yellow-100 text-yellow-800' :
                      order.currentSubStatus?.toUpperCase() === 'START' ? 'bg-blue-50/70 border-blue-100 text-blue-800' :
                        order.currentSubStatus?.toUpperCase() === 'STOP' ? 'bg-orange-50/70 border-orange-100 text-orange-850' :
                          order.currentSubStatus?.toUpperCase() === 'COMPLETED' ? 'bg-green-50/70 border-green-100 text-green-800' :
                            'bg-gray-50 border-gray-150 text-gray-700'
                      }`}>
                      <span className="text-lg">📢</span>
                      <p>{getStatusDescription(order.currentSubStatus)}</p>
                    </div>

                    {/* Order Summary footer section */}
                    <div className="bg-[#FAF8F6] rounded-xl border border-[#ede7e2] p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-[#8c5e5e] border border-[#ede7e2]">
                          <ShoppingBag size={15} />
                        </div>
                        <div>
                          <span className="text-[#8a726d] block font-medium">Order Total</span>
                          <span className="font-extrabold text-[#2d211e]">
                            Rs. {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-x border-[#ede7e2] pt-3 sm:pt-0 sm:px-4">
                        <div className="p-2 bg-white rounded-lg text-[#8c5e5e] border border-[#ede7e2]">
                          <CreditCard size={15} />
                        </div>
                        <div>
                          <span className="text-[#8a726d] block font-medium">Payment Method</span>
                          <span className="font-bold text-[#2d211e]">Online Card Payment</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <div className="p-2 bg-white rounded-lg text-[#8c5e5e] border border-[#ede7e2]">
                          <Clock size={15} />
                        </div>
                        <div>
                          <span className="text-[#8a726d] block font-medium">
                            {isOrderCompleted ? 'Delivery Date' : 'Estimated Delivery'}
                          </span>
                          <span className="font-bold text-[#2d211e]">
                            {getEstimatedDelivery(order.orderDate, order.currentSubStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersModal;
