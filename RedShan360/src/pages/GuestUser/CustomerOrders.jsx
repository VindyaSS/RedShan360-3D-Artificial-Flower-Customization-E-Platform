import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import api from '../../services/api';
import { getProductImageUrl } from '../../utils/imageHelper';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';

const CustomerOrders = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      console.error('Failed to parse user in CustomerOrders:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Fetch orders by userId
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/orders/my-orders/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching my-orders:", err);
        setError("Failed to retrieve order tracking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

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

  const getSubStatusBadge = (status) => {
    const upper = (status || '').toUpperCase();
    if (upper === 'PENDING') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200">
          Pending
        </span>
      );
    }
    if (upper === 'START') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
          Start
        </span>
      );
    }
    if (upper === 'STOP') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
          Stop
        </span>
      );
    }
    if (upper === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 border border-gray-200">
        {status || 'Unknown'}
      </span>
    );
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
      <div className="pt-32 pb-12 text-center bg-gradient-to-br from-[#8c5e5e]/10 via-[#ea580c]/5 to-transparent border-b border-[#f0ebe4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c5e5e]/10 text-[#8c5e5e] text-xs font-bold uppercase tracking-wider mb-4 border border-[#8c5e5e]/20">
            <ShoppingBag size={12} className="text-[#8c5e5e]" />
            <span>Order Tracking & Curation Status</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Orders
          </h1>
          <p className="text-xs md:text-sm text-[#563c37]/70 max-w-2xl mx-auto leading-relaxed">
            Track processing phases, check real-time workshop sub-status updates, and review order histories.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col gap-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#8c5e5e]/30 border-t-[#8c5e5e] rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#563c37]/65">Loading orders history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50/50 rounded-2xl border border-red-100 max-w-2xl mx-auto px-6 w-full">
            <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-red-950 mb-1">Retrieval Issue</h3>
            <p className="text-xs text-red-700/80 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="py-2.5 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#f0ebe4] max-w-2xl mx-auto w-full px-6 flex flex-col items-center shadow-xs">
            <ShoppingBag size={48} className="text-[#563c37]/20 mb-4" />
            <h3 className="font-bold text-lg text-[#563c37] mb-1">No Orders</h3>
            <p className="text-xs text-[#563c37]/65 max-w-sm mb-6 leading-relaxed">
              You haven't placed any orders yet.
            </p>
            <button 
              onClick={() => window.location.href = '/shop'} 
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#8c5e5e] to-[#a36d6d] hover:from-[#7a5050] text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Shop Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 animate-slide-up">
            {orders.map((order) => (
              <div 
                key={order.orderId}
                className="bg-white rounded-2xl border border-[#f0ebe4] p-6 shadow-sm flex flex-col gap-6 text-left"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#f5efeb] pb-4 gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                        Order ID
                      </span>
                      <span className="font-bold text-[#563c37] text-sm">
                        #ORDER-{order.orderId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                        Order Date
                      </span>
                      <span className="text-xs font-semibold text-[#563c37]/80 flex items-center gap-1">
                        <Calendar size={12} className="text-[#563c37]/60" />
                        {formatDate(order.orderDate)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                        Total Amount
                      </span>
                      <span className="font-extrabold text-[#ea580c] text-sm">
                        Rs. {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                        Main Status
                      </span>
                      <span className="text-xs font-bold text-[#563c37] px-2 py-0.5 bg-[#f5efeb] rounded">
                        {order.mainStatus}
                      </span>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block mb-0.5">
                        Sub Status
                      </span>
                      {getSubStatusBadge(order.currentSubStatus)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#563c37]/50 block">
                    Order Items
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items && order.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl border border-[#f0ebe4] bg-[#fcfbfa]/50"
                      >
                        <div className="w-16 h-20 bg-[#f5efeb] rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          {item.productName === 'Customized Bouquet' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-[#8c5e5e] font-extrabold bg-[#8c5e5e]/5 p-2 text-center">
                              <ShoppingBag size={18} className="mb-1" />
                              3D BOUQUET
                            </div>
                          ) : (
                            <img 
                              src={getProductImageUrl(item.imageUrl)} 
                              alt={item.productName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/product-placeholder.png";
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-[#563c37] line-clamp-1">
                            {item.productName}
                          </h4>
                          <p className="text-[10px] font-semibold text-[#563c37]/50 mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-[10px] font-bold text-[#8c5e5e] mt-0.5">
                            Rs. {item.price ? item.price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerOrders;
