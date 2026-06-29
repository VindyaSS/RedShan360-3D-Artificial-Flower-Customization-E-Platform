import { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { products } from '../../../data/products';
import { triggerPayHereCheckout } from '../../../utils/payhere';
import api from '../../../services/api';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const drawerRef = useRef(null);

  // Load cart items from local storage and filter out invalid/stale products
  const loadCart = () => {
    const savedCart = localStorage.getItem('redshan360_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const filteredCart = parsedCart.filter((item) => item.isCustom || products.some((p) => p.id === item.id));
      setCartItems(filteredCart);
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    // Listen for cart updates
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  // Scroll Management: Lock body scroll and apply blur class when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cart-open');
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove('cart-open');
      };
    }
  }, [isOpen]);

  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle quantity changes
  const updateQuantity = (id, selectedColor, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.selectedColor === selectedColor) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('redshan360_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Remove item from cart
  const removeItem = (id, selectedColor) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.selectedColor === selectedColor)
    );

    setCartItems(updatedCart);
    localStorage.setItem('redshan360_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = item.numericPrice || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  // Trigger PayHere Payment Gateway Checkout Flow
  const handleCheckout = async () => {
    if (cartItems.length === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      // Initialize payment session on the backend
      const response = await api.post('/api/checkout', {
        items: cartItems.map((item) => ({
          id: typeof item.id === 'string' && item.id.startsWith('custom') ? null : Number(item.id),
          title: item.title,
          quantity: item.quantity,
          isCustom: item.isCustom || false,
          numericPrice: item.numericPrice || 0,
          bouquetDesign: item.bouquetDesign || null
        })),
        currency: "LKR"
      });

      const checkoutData = response.data;

      triggerPayHereCheckout({
        merchantId: checkoutData.merchantId,
        orderId: checkoutData.orderId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        hash: checkoutData.hash,
        itemsName: checkoutData.itemsName,
        callbacks: {
          onCompleted: async (completedOrderId) => {
            try {
              // Verify the payment status securely on the backend
              const statusResponse = await api.get(`/api/checkout/status/${completedOrderId}`);
              if (statusResponse.data.status === "SUCCESS") {
                alert(`Payment successful! Order ID: ${completedOrderId}`);
                localStorage.removeItem('redshan360_cart');
                setCartItems([]);
                window.dispatchEvent(new Event('cart-updated'));
                onClose();
              } else {
                alert("Payment failed or was declined. Please try again.");
              }
            } catch (error) {
              console.error("Failed to verify payment status:", error);
              alert("Payment verification failed. Please check your payment status.");
            }
          },
          onDismissed: () => {
            console.log("Payment cancelled (modal closed).");
          },
          onError: (error) => {
            console.error("PayHere error:", error);
            alert("Payment failed. Please try again.");
          }
        }
      });
    } catch (error) {
      console.error("Failed to initialize checkout session:", error);
      alert(error.response?.data?.message || "An error occurred while initializing checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-container fixed inset-0 z-[100] overflow-hidden font-sans">
      
      {/* 1. Backdrop Overlay (isolated z-40 blur layer) */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 animate-fade-in z-40" 
      />

      {/* 2. Drawer Panel (strictly constrained to h-screen and max-h-screen, with flex-col) */}
      <div 
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#fcf9f8] h-screen max-h-screen shadow-2xl flex flex-col border-l border-[#d9d2d0]/20 z-50 animate-slide-left text-left"
      >
        
        {/* Drawer Header (Fixed Height) */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#d9d2d0]/30 bg-[#faf8f6] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#8c5e5e]" />
            <h2 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Cart
            </h2>
            <span className="bg-[#8c5e5e]/10 text-[#8c5e5e] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#f4f0ed] rounded-full text-[#1a1a1a]/60 hover:text-[#8c5e5e] transition-all"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content (Scrollable, takes all remaining space) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#fcf9f8]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
              <ShoppingBag size={48} className="text-[#1a1a1a]/15" />
              <div>
                <p className="text-sm font-bold text-[#1a1a1a]/70">Your cart is empty</p>
                <p className="text-xs text-[#1a1a1a]/40 mt-1">Browse our collection to add items</p>
              </div>
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-medium text-xs tracking-wider uppercase rounded-sm transition-all duration-300 shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#d9d2d0]/25">
              {cartItems.map((item, index) => {
                const itemPrice = item.numericPrice || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                return (
                  <div key={`${item.id}-${item.selectedColor}-${index}`} className="flex items-stretch gap-4 py-5 first:pt-0 last:pb-0 bg-transparent">
                    
                    {/* Left: Product Image */}
                    <div className="w-20 h-24 bg-[#f4f0ed] rounded-sm overflow-hidden flex-shrink-0 border border-[#d9d2d0]/15 shadow-sm">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Middle: Product Title, Color, and Quantity Pill */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
                      <div>
                        <h3 className="font-bold text-sm text-[#1a1a1a] truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-semibold text-[#1a1a1a]/55 uppercase mt-0.5">
                          Color: <span className="font-black text-[#1d1b1a]">{item.selectedColor}</span>
                        </p>
                      </div>

                      {/* Spacious Pill Shape Quantity Controls */}
                      <div className="flex items-center border border-[#d9d2d0] rounded-full w-fit bg-white shadow-xs mt-2 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                          className="px-2.5 py-1 hover:bg-[#f4f0ed] text-[#1a1a1a]/65 hover:text-[#8c5e5e] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold select-none text-[#1a1a1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                          className="px-2.5 py-1 hover:bg-[#f4f0ed] text-[#1a1a1a]/65 hover:text-[#8c5e5e] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Right: Clear Price Display at top, and Trash/Delete at bottom */}
                    <div className="flex flex-col justify-between items-end text-right pl-1 flex-shrink-0">
                      <p className="text-xs font-bold text-[#8c5e5e] font-mono">
                        Rs ${(itemPrice * item.quantity).toFixed(2)}
                      </p>
                      
                      <button 
                        onClick={() => removeItem(item.id, item.selectedColor)}
                        className="text-[#1a1a1a]/40 hover:text-red-500 p-1.5 transition-colors mt-auto rounded-full hover:bg-red-50/50"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer (Fixed Height, Pins to Bottom) */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#d9d2d0]/40 bg-[#faf8f6] p-6 space-y-4 flex-shrink-0">
            
            {/* Subtotal and Total Prices */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1a1a]/60">
                <span>Shipping</span>
                <span className="text-[#8c5e5e] uppercase tracking-widest text-[9px] font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#1a1a1a]">Subtotal</span>
                <span className="text-lg font-bold text-[#8c5e5e] font-mono" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Rs {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-3.5 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] ${
                  isProcessing 
                    ? 'bg-[#8c5e5e]/75 cursor-not-allowed' 
                    : 'bg-[#8c5e5e] hover:bg-[#7d4d50]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Initializing Checkout...</span>
                  </>
                ) : (
                  <span>Proceed to Checkout</span>
                )}
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-3.5 border border-[#d9d2d0] hover:border-[#8c5e5e] bg-transparent hover:bg-[#8c5e5e]/5 text-[#1a1a1a]/85 hover:text-[#8c5e5e] text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-300 active:scale-[0.99]"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
