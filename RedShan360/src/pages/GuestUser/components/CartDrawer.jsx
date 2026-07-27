import { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { products } from '../../../data/products';
import { triggerPayHereCheckout } from '../../../utils/payhere';
import api, { cartApi } from '../../../services/api';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const drawerRef = useRef(null);
  const [loyaltyCheckout, setLoyaltyCheckout] = useState(null);
  const [applyMembershipDiscount, setApplyMembershipDiscount] = useState(false);
  const [applyRedeemPoints, setApplyRedeemPoints] = useState(false);

  // Load cart items from API + local storage
  const loadCart = async () => {
    let standardItems = [];
    
    // 1. Fetch standard products if logged in
    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user in CartDrawer:', e);
      }
    }
    
    if (currentUser) {
      const currentUserId = currentUser.id || currentUser.userId;
      try {
        const [cartResponse, loyaltyResponse] = await Promise.all([
          cartApi.getCart(),
          api.get(`/api/loyalty/redeem/${currentUserId}`).catch(err => {
            console.error('Failed to load loyalty checkout details:', err);
            return { data: null };
          })
        ]);
        
        const items = cartResponse.data.items || [];
        standardItems = items.map((item) => {
          const productDetail = products.find((p) => p.id === item.productId);
          return {
            ...item,
            image: productDetail ? productDetail.image : '/images/peonies_vase.png'
          };
        });
        
        if (loyaltyResponse.data) {
          setLoyaltyCheckout(loyaltyResponse.data);
        }
      } catch (error) {
        console.error('Error fetching standard cart items:', error);
      }
    } else {
      setLoyaltyCheckout(null);
    }

    // 2. Fetch custom bouquets from local storage
    let customItems = [];
    const savedCart = localStorage.getItem('redshan360_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        customItems = parsedCart.filter((item) => item.isCustom);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }

    setCartItems([...standardItems, ...customItems]);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const updateQuantity = async (id, selectedColor, delta) => {
    const item = cartItems.find((i) => i.id === id && i.selectedColor === selectedColor);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    if (item.isCustom) {
      const updatedCart = cartItems.map((i) => {
        if (i.id === id && i.selectedColor === selectedColor) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      setCartItems(updatedCart);
      const customOnlyItems = updatedCart.filter((item) => item.isCustom);
      localStorage.setItem('redshan360_cart', JSON.stringify(customOnlyItems));
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      try {
        await cartApi.updateQuantity(item.id, newQty);
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      } catch (error) {
        console.error('Failed to update quantity:', error);
        alert('Failed to update item quantity.');
      }
    }
  };

  // Remove item from cart
  const removeItem = async (id, selectedColor) => {
    const item = cartItems.find((i) => i.id === id && i.selectedColor === selectedColor);
    if (!item) return;

    if (item.isCustom) {
      const updatedCart = cartItems.filter(
        (i) => !(i.id === id && i.selectedColor === selectedColor)
      );
      setCartItems(updatedCart);
      const customOnlyItems = updatedCart.filter((item) => item.isCustom);
      localStorage.setItem('redshan360_cart', JSON.stringify(customOnlyItems));
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      try {
        await cartApi.removeFromCart(item.id);
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      } catch (error) {
        console.error('Failed to remove item:', error);
        alert('Failed to remove item from cart.');
      }
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = item.numericPrice || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  // Calculate checkout discounts
  const membershipDiscountVal = applyMembershipDiscount && loyaltyCheckout ? (subtotal * (loyaltyCheckout.membershipDiscount || 0)) / 100 : 0;
  const redeemDiscountVal = applyRedeemPoints && loyaltyCheckout ? (loyaltyCheckout.redeemDiscount || 0) : 0;
  const finalTotal = Math.max(0, subtotal - membershipDiscountVal - redeemDiscountVal);

  // Trigger PayHere Payment Gateway Checkout Flow
  const handleCheckout = async () => {
    if (cartItems.length === 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      const savedUser = localStorage.getItem('user');
      let currentUser = null;
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        currentUser = JSON.parse(savedUser);
      }
      const currentUserId = currentUser ? (currentUser.id || currentUser.userId) : null;

      // Initialize payment session on the backend
      const response = await api.post('/api/checkout', {
        items: cartItems.map((item) => {
          if (item.isCustom && item.bouquetDesign) {
            const rawFlowers = item.bouquetDesign.flowers || [];
            const flowersMapped = rawFlowers.map(f => {
              const pid = Number(f.stemId);
              const pX = f.position ? Number(f.position[0]) : 0;
              const pY = f.position ? Number(f.position[1]) : 0;
              const pZ = f.position ? Number(f.position[2]) : 0;

              const rX = f.rotation ? Number(f.rotation[0]) : 0;
              const rY = f.rotation ? Number(f.rotation[1]) : 0;
              const rZ = f.rotation ? Number(f.rotation[2]) : 0;

              const sX = f.scale ? Number(f.scale[0]) : 1.0;
              const sY = f.scale ? Number(f.scale[1]) : 1.0;
              const sZ = f.scale ? Number(f.scale[2]) : 1.0;

              return {
                instanceId: String(f.flowerId || f.id),
                productId: pid,
                position: { x: pX, y: pY, z: pZ },
                rotation: { x: rX, y: rY, z: rZ },
                scale: { x: sX, y: sY, z: sZ },
                isManuallyEdited: !!f.isManuallyEdited
              };
            });

            return {
              id: null,
              title: item.title,
              quantity: item.quantity,
              isCustom: true,
              numericPrice: item.numericPrice || 0,
              bouquetDesign: {
                style: item.bouquetDesign.style || '',
                bouquetStyle: item.bouquetDesign.bouquetStyle || 'ROUND',
                wrappingId: item.bouquetDesign.wrappingId || '',
                ribbonId: item.bouquetDesign.ribbonId || '',
                sizeKey: item.bouquetDesign.sizeKey || '',
                flowers: flowersMapped
              }
            };
          }

          return {
            id: Number(item.productId),
            title: item.title,
            quantity: item.quantity,
            isCustom: false,
            numericPrice: item.numericPrice || 0,
            bouquetDesign: null
          };
        }),
        currency: "LKR",
        discountAmount: membershipDiscountVal + redeemDiscountVal
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
                
                // If points were redeemed, call the POST /api/loyalty/redeem endpoint to deduct them in the DB!
                if (applyRedeemPoints && loyaltyCheckout && loyaltyCheckout.redeemablePoints > 0 && currentUserId) {
                  try {
                    await api.post('/api/loyalty/redeem', {
                      userId: currentUserId,
                      points: loyaltyCheckout.redeemablePoints
                    });
                  } catch (e) {
                    console.error('Failed to deduct redeemed loyalty points:', e);
                  }
                }

                alert(`Payment successful! Order ID: ${completedOrderId}`);
                
                // Clear custom items from local storage
                localStorage.removeItem('redshan360_cart');
                
                // Remove standard items from database in a loop
                const standardItems = cartItems.filter((i) => !i.isCustom);
                for (const item of standardItems) {
                  try {
                    await cartApi.removeFromCart(item.id);
                  } catch (e) {
                    console.error('Failed to clear item from backend cart:', item.id, e);
                  }
                }

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
      const errMsg = error.response?.data?.message;
      if (errMsg === "Insufficient stock.") {
        alert("Sorry, this product does not have enough stock available.");
      } else {
        alert(errMsg || "An error occurred while initializing checkout. Please try again.");
      }
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
                        {item.bouquetDesign?.sizeLabel && (
                          <p className="text-[10px] font-semibold text-[#1a1a1a]/55 uppercase mt-0.5">
                            Bouquet Size: <span className="font-black text-[#1d1b1a]">{item.bouquetDesign.sizeLabel}</span>
                          </p>
                        )}
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
          <div className="border-t border-[#d9d2d0]/40 bg-[#faf8f6] p-6 space-y-4 flex-shrink-0 overflow-y-auto max-h-[50vh]">
            
            {/* Loyalty Points Section */}
            {loyaltyCheckout && (
              <div className="bg-[#fdfbf9] p-3 rounded-lg border border-[#d9d2d0]/30 space-y-2 text-xs text-[#563c37] mb-2">
                <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-wider text-[#ea580c] mb-1">
                  <span>Loyalty Checkout Benefits</span>
                  <span>🥈 {loyaltyCheckout.membership}</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none font-semibold">
                    <input 
                      type="checkbox" 
                      checked={applyMembershipDiscount}
                      onChange={(e) => setApplyMembershipDiscount(e.target.checked)}
                      className="rounded border-gray-300 text-[#ea580c] focus:ring-[#ea580c] w-4 h-4 cursor-pointer"
                    />
                    <span>Apply Membership Discount ({loyaltyCheckout.membershipDiscount}%)</span>
                  </label>
                  <span className="font-mono font-bold text-[#ea580c]">-Rs.{((subtotal * (loyaltyCheckout.membershipDiscount || 0)) / 100).toFixed(2)}</span>
                </div>
                {loyaltyCheckout.redeemablePoints > 0 && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none font-semibold">
                      <input 
                        type="checkbox" 
                        checked={applyRedeemPoints}
                        onChange={(e) => setApplyRedeemPoints(e.target.checked)}
                        className="rounded border-gray-300 text-[#ea580c] focus:ring-[#ea580c] w-4 h-4 cursor-pointer"
                      />
                      <span>Redeem Loyalty Points ({loyaltyCheckout.redeemablePoints} pts)</span>
                    </label>
                    <span className="font-mono font-bold text-green-600">-Rs.{loyaltyCheckout.redeemDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Subtotal and Total Prices */}
            <div className="space-y-2 border-b border-[#d9d2d0]/25 pb-3">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1a1a]/60">
                <span>Shipping</span>
                <span className="text-[#8c5e5e] uppercase tracking-widest text-[9px] font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1a1a]/60">
                <span>Order Total</span>
                <span className="font-mono">Rs {subtotal.toFixed(2)}</span>
              </div>
              {applyMembershipDiscount && (
                <div className="flex justify-between items-center text-xs font-semibold text-orange-600">
                  <span>Membership Discount</span>
                  <span className="font-mono">-Rs.{membershipDiscountVal.toFixed(2)}</span>
                </div>
              )}
              {applyRedeemPoints && (
                <div className="flex justify-between items-center text-xs font-semibold text-green-600">
                  <span>Redeem Discount</span>
                  <span className="font-mono">-Rs.{redeemDiscountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-[#1a1a1a]">Final Total</span>
                <span className="text-lg font-bold text-[#8c5e5e] font-mono" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Rs {finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-1 space-y-2">
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
