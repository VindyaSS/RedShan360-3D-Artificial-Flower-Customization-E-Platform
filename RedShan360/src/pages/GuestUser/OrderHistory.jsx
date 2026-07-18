import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BouquetPreview from '../../components/bouquet/BouquetPreview';
import api from '../../services/api';
import { BOUQUET_STYLE_CONFIG } from '../../components/bouquet/bouquetStyleConfig';
import { 
  ShoppingBag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText,
  AlertCircle
} from 'lucide-react';

const OrderHistory = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [stemsDatabase, setStemsDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Retrieve user from localStorage
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user in OrderHistory:', e);
    }
  }

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Fetch initial list of orders and stems database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/api/orders'),
          api.get('/api/products')
        ]);
        
        setOrders(ordersRes.data);
        
        // Filter out non-flower selections for stemsDatabase
        const stems = productsRes.data.filter(p => p.categoryName === 'premium-blooms' || p.categoryName === 'wrapping-accents' || p.categoryName === 'bouquet-styles');
        setStemsDatabase(stems);
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("Failed to retrieve order history. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch expanded order details on demand
  const handleToggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    if (orderDetails[orderId]) {
      setExpandedOrderId(orderId);
      return;
    }

    try {
      setDetailLoadingId(orderId);
      const res = await api.get(`/api/orders/${orderId}`);
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: res.data
      }));
      setExpandedOrderId(orderId);
    } catch (err) {
      console.error("Error loading order details:", err);
    } finally {
      setDetailLoadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'ORDER_CONFIRMED' || upper === 'SUCCESS' || upper === 'PAID' || upper === 'DELIVERED') {
      return <CheckCircle2 size={16} className="text-green-500" />;
    }
    return <Clock size={16} className="text-orange-500" />;
  };

  const getStatusClass = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'ORDER_CONFIRMED' || upper === 'SUCCESS' || upper === 'PAID' || upper === 'DELIVERED') {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    return 'bg-orange-50 text-orange-700 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] text-[#563c37] flex flex-col font-sans animate-fade-in-page">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-page {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Navbar */}
      <Navbar
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      {/* Header Banner */}
      <div className="pt-32 pb-12 text-center bg-gradient-to-br from-[#ea580c]/10 via-[#f97316]/5 to-transparent border-b border-[#f0ebe4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316]/10 text-[#ea580c] text-xs font-bold uppercase tracking-wider mb-4 border border-[#f97316]/20">
            <ShoppingBag size={12} className="text-[#ea580c]" />
            <span>Redshan Flora Customer Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Orders
          </h1>
          <p className="text-xs md:text-sm text-[#563c37]/70 max-w-2xl mx-auto leading-relaxed">
            Track historical custom bouquets, preview 3D layouts, and view transaction status records.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col gap-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#563c37]/65">Loading orders history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50/50 rounded-2xl border border-red-100 max-w-2xl mx-auto px-6">
            <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-red-950 mb-1">Network Error</h3>
            <p className="text-xs text-red-700/80 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="py-2.5 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider"
            >
              Retry Connection
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#f0ebe4] max-w-2xl mx-auto w-full px-6 flex flex-col items-center shadow-xs">
            <ShoppingBag size={48} className="text-[#563c37]/20 mb-4" />
            <h3 className="font-bold text-lg text-[#563c37] mb-1">No Orders Found</h3>
            <p className="text-xs text-[#563c37]/65 max-w-sm mb-6 leading-relaxed">
              It looks like you haven't placed any orders yet. Design a custom bouquet or shop our collection to begin!
            </p>
            <button 
              onClick={() => window.location.href = '/shop'} 
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-[#ea580c] hover:from-[#ea580c] text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Shop Collection
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              const details = orderDetails[order.orderId];
              const isDetailLoading = detailLoadingId === order.orderId;
              
              return (
                <div 
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-[#f0ebe4] shadow-[0_4px_25px_rgba(86,60,55,0.01)] overflow-hidden transition-all hover:shadow-[0_6px_30px_rgba(86,60,55,0.03)] text-left"
                >
                  {/* Order Card Header */}
                  <div 
                    onClick={() => handleToggleExpand(order.orderId)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#faf8f6]/30 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                          Order Number
                        </span>
                        <span className="font-bold text-[#563c37] text-sm">
                          #ORDER-{order.orderId}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                          Order Date
                        </span>
                        <span className="text-xs font-semibold text-[#563c37]/80">
                          {formatDate(order.orderDate)}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                          Total Amount
                        </span>
                        <span className="font-extrabold text-[#ea580c] text-sm">
                          Rs. {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${getStatusClass(order.paymentStatus)}`}>
                        {getStatusIcon(order.paymentStatus)}
                        <span>{order.paymentStatus}</span>
                      </div>

                      <div className="p-1 rounded-full hover:bg-orange-50 text-[#563c37]/50 hover:text-[#ea580c]">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {isExpanded && (
                    <div className="border-t border-[#f5efeb] bg-[#faf8f6]/20 p-5 sm:p-8 animate-slide-up flex flex-col gap-8">
                      {isDetailLoading ? (
                        <div className="flex items-center justify-center py-10 gap-2.5">
                          <div className="w-6 h-6 border-3 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#563c37]/60">Loading design...</span>
                        </div>
                      ) : details ? (
                        <div className="flex flex-col gap-8">
                          
                          {/* Standard Items Section */}
                          {details.items && details.items.length > 0 && (
                            <div>
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#563c37]/60 mb-4 flex items-center gap-1.5 border-b border-[#f5efeb] pb-2">
                                <FileText size={14} />
                                <span>Standard Products ({details.items.length})</span>
                              </h4>
                              <div className="flex flex-col gap-4">
                                {details.items.map((item, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#f0ebe4] gap-4"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-16 bg-[#f5efeb] rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                        {item.imageUrl ? (
                                          <img 
                                            src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080/images/${item.imageUrl}`} 
                                            alt={item.productName} 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#563c37]/35 font-bold uppercase">
                                            No Img
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-xs text-[#563c37]">
                                          {item.productName}
                                        </h5>
                                        <p className="text-[10px] font-semibold text-[#563c37]/50 mt-0.5">
                                          Rs. {item.price.toFixed(2)} x {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-extrabold text-xs text-[#563c37]">
                                      Rs. {item.lineTotal.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Custom Bouquet Snapshot Section */}
                          {details.bouquetSnapshot ? (
                            <div>
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#563c37]/60 mb-4 flex items-center gap-1.5 border-b border-[#f5efeb] pb-2">
                                <Info size={14} />
                                <span>Custom 3D Bouquet Curation</span>
                              </h4>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                {/* Left Side: 3D Preview Canvas */}
                                <div className="lg:col-span-7 bg-[#f5efeb]/40 rounded-2xl overflow-hidden border border-[#f0ebe4] min-h-[400px] relative shadow-inner">
                                  <BouquetPreview 
                                    snapshot={details.bouquetSnapshot} 
                                    stemsDatabase={stemsDatabase} 
                                  />
                                </div>

                                {/* Right Side: Snapshot breakdown pricing and options */}
                                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#f0ebe4] flex flex-col justify-between shadow-[0_4px_20px_rgba(86,60,55,0.02)]">
                                  <div className="flex flex-col gap-5">
                                    <div>
                                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200/20">
                                        Snapshot Version: {details.bouquetSnapshot.snapshotVersion || 1}
                                      </span>
                                      <h4 className="font-extrabold text-lg text-[#563c37] mt-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Bouquet Design Specs
                                      </h4>
                                    </div>

                                    {/* Specifications Grid */}
                                    <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#faf8f6] py-4">
                                      <div>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">Size</span>
                                        <span className="font-bold text-[#563c37]">{details.bouquetSnapshot.size?.label} Size</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">Style</span>
                                        <span className="font-bold text-[#563c37]">{details.bouquetSnapshot.style === 'spiral-handtied' ? 'Spiral Hand-tied' : 'Classic Dome'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">Bouquet Style</span>
                                        <span className="font-bold text-[#563c37]">
                                          {BOUQUET_STYLE_CONFIG[details.bouquetSnapshot.bouquetStyle]?.label || details.bouquetSnapshot.bouquetStyle || 'Round'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">Wrapping Paper</span>
                                        <span className="font-bold text-[#563c37]">{details.bouquetSnapshot.wrappingId || 'None'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">Ribbon Accent</span>
                                        <span className="font-bold text-[#563c37]">{details.bouquetSnapshot.ribbonId || 'None'}</span>
                                      </div>
                                    </div>

                                    {/* Flower summary list */}
                                    <div>
                                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-2">Flowers Used</span>
                                      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                                        {details.bouquetSnapshot.flowerSummary?.map((f, i) => (
                                          <div key={i} className="flex justify-between text-xs font-semibold text-[#563c37]/80 py-1.5 border-b border-[#fdfbf9]">
                                            <span>{f.productName} x{f.quantity}</span>
                                            <span>Rs. {f.lineTotal.toFixed(2)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Pricing Breakdown details */}
                                  <div className="mt-6 pt-5 border-t border-[#f5efeb] flex flex-col gap-3 font-semibold text-xs">
                                    <div className="flex justify-between text-[#563c37]/75 font-medium">
                                      <span>Flowers Subtotal</span>
                                      <span>Rs. {details.bouquetSnapshot.pricing?.flowerSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#563c37]/75 font-medium">
                                      <span>Size Adjustment ({details.bouquetSnapshot.size?.multiplier}x)</span>
                                      <span>+Rs. {details.bouquetSnapshot.pricing?.sizeAdjustment.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#563c37]/75 font-medium">
                                      <span>Scaled Flower Subtotal</span>
                                      <span>Rs. {details.bouquetSnapshot.pricing?.scaledFlowerTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#563c37]/75 font-medium">
                                      <span>Service Charge</span>
                                      <span>Rs. {details.bouquetSnapshot.pricing?.serviceCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#563c37] font-bold text-sm border-t border-[#faf8f6] pt-3 mt-1">
                                      <span>Bouquet Grand Total</span>
                                      <span className="text-[#ea580c]">Rs. {details.bouquetSnapshot.pricing?.grandTotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}

                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrderHistory;
