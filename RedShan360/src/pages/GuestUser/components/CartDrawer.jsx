import { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CreditCard, ShieldCheck, Calendar } from 'lucide-react';
import { triggerPayHereCheckout } from '../../../utils/payhere';
import api, { cartApi } from '../../../services/api';
import { getProductImage } from '../../../utils/imageHelper';
import { getBouquetImage, deleteBouquetImage } from '../../../utils/indexedDB';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const drawerRef = useRef(null);
  const [loyaltyCheckout, setLoyaltyCheckout] = useState(null);
  const [applyMembershipDiscount, setApplyMembershipDiscount] = useState(false);
  const [applyRedeemPoints, setApplyRedeemPoints] = useState(false);

  // Minimum Delivery Date (2 days in advance)
  const getMinDeliveryDate = () => {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDeliveryDate = getMinDeliveryDate();

  // New Checkout Steps & Customer Details State
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'shipping'
  const [saveInfo, setSaveInfo] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    deliveryDate: minDeliveryDate
  });

  // Pre-fill customer details from saved details or logged in user
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep('cart');
    } else {
      let initialDetails = {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        email: '',
        deliveryDate: minDeliveryDate
      };

      const savedDetails = localStorage.getItem('savedCustomerDetails');
      if (savedDetails) {
        try {
          initialDetails = { ...initialDetails, ...JSON.parse(savedDetails) };
        } catch (e) {
          console.error('Error loading saved customer details:', e);
        }
      }

      // Ensure delivery date is at least 2 days in advance
      if (!initialDetails.deliveryDate || initialDetails.deliveryDate < minDeliveryDate) {
        initialDetails.deliveryDate = minDeliveryDate;
      }

      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          const user = JSON.parse(savedUser);
          const nameParts = (user.name || user.username || '').split(' ');
          initialDetails = {
            firstName: initialDetails.firstName || user.firstName || nameParts[0] || '',
            lastName: initialDetails.lastName || user.lastName || nameParts.slice(1).join(' ') || '',
            phone: initialDetails.phone || user.phone || user.phoneNumber || '',
            email: initialDetails.email || user.email || '',
            address: initialDetails.address || user.address || '',
            city: initialDetails.city || user.city || '',
            postalCode: initialDetails.postalCode || user.postalCode || '',
            deliveryDate: initialDetails.deliveryDate || minDeliveryDate
          };
        } catch (e) {
          console.error('Error pre-filling customer details:', e);
        }
      }

      setCustomerDetails(initialDetails);
    }
  }, [isOpen]);

  const handleDetailChange = (field, value) => {
    setCustomerDetails((prev) => {
      const updated = { ...prev, [field]: value };
      if (saveInfo) {
        localStorage.setItem('savedCustomerDetails', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Load cart items from API + local storage
  const loadCart = async () => {
    let standardItems = [];

    // Fetch standard products if logged in
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
        const [cartResponse, dbProductsResponse, loyaltyResponse] = await Promise.all([
          cartApi.getCart(),
          api.get('/api/products').catch(() => ({ data: [] })),
          api.get(`/api/loyalty/redeem/${currentUserId}`).catch((err) => {
            console.error('Failed to load loyalty checkout details:', err);
            return { data: null };
          })
        ]);

        const dbProducts = dbProductsResponse.data || [];
        const items = cartResponse.data.items || [];
        standardItems = items.map((item) => {
          const dbProduct = dbProducts.find(
            (p) => Number(p.productId ?? p.id) === Number(item.productId ?? item.id)
          );
          const resolvedImg = getProductImage(dbProduct || item) || '/images/product-placeholder.png';
          return {
            ...item,
            image: resolvedImg
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

    // Fetch custom bouquets from local storage
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
    loadCart();

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
      const customId = item.customizationId || item.id;
      if (customId) {
        deleteBouquetImage(customId).catch((e) =>
          console.error('Error deleting IndexedDB image on item removal:', e)
        );
      }
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

  const clearCartAfterCheckout = async () => {
    localStorage.removeItem('redshan360_cart');
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
  };

  // Final Checkout Submission
  const handleFinalCheckout = async () => {
    if (cartItems.length === 0 || isProcessing) return;

    // Validate Customer Details Form
    if (
      !customerDetails.firstName.trim() ||
      !customerDetails.lastName.trim() ||
      !customerDetails.address.trim() ||
      !customerDetails.city.trim() ||
      !customerDetails.phone.trim() ||
      !customerDetails.email.trim() ||
      !customerDetails.deliveryDate
    ) {
      alert('Please fill in all required customer details (First Name, Last Name, Address, City, Phone, Email, Preferred Delivery Date).');
      return;
    }

    if (customerDetails.deliveryDate < minDeliveryDate) {
      alert(`Please select a delivery date starting from ${minDeliveryDate} (at least 5 days in advance).`);
      return;
    }

    if (saveInfo) {
      localStorage.setItem('savedCustomerDetails', JSON.stringify(customerDetails));
    } else {
      localStorage.removeItem('savedCustomerDetails');
    }

    setIsProcessing(true);
    try {
      const savedUser = localStorage.getItem('user');
      let currentUser = null;
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        currentUser = JSON.parse(savedUser);
      }
      const currentUserId = currentUser ? (currentUser.id || currentUser.userId) : null;
      const cartSnapshot = [...cartItems];

      // Initialize Online Payment session (PayHere) on the backend
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

          const prodId = item.productId !== undefined && item.productId !== null ? item.productId : item.id;
          return {
            id: Number(prodId),
            title: item.title,
            quantity: item.quantity,
            isCustom: false,
            numericPrice: item.numericPrice || 0,
            bouquetDesign: null
          };
        }),
        currency: "LKR",
        discountAmount: membershipDiscountVal + redeemDiscountVal,
        customerDetails: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          phone: customerDetails.phone,
          email: customerDetails.email,
          deliveryDate: customerDetails.deliveryDate || minDeliveryDate
        },
        address: `${customerDetails.address}${customerDetails.city ? ', ' + customerDetails.city : ''}`,
        phone: customerDetails.phone
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
            console.log('[DEBUG UPLOAD] 1. callbacks.onCompleted() called. completedOrderId:', completedOrderId);
            try {
              const statusResponse = await api.get(`/api/checkout/status/${completedOrderId}`);
              console.log('[DEBUG UPLOAD] 2. Checkout status response:', statusResponse.data, 'Is SUCCESS?:', statusResponse.data?.status === "SUCCESS");

              if (statusResponse.data?.status === "SUCCESS") {
                console.log('[DEBUG UPLOAD] 3. Current cart snapshot at moment of success:', cartSnapshot);
                const customItems = cartSnapshot.filter((i) => i.isCustom);
                console.log('[DEBUG UPLOAD] 4. Detected custom bouquet items:', customItems);

                const resolvedCustomerId = currentUser ? (currentUser.customerId || currentUser.id || currentUser.userId) : null;
                // FIX: Do NOT use completedOrderId from PayHere — that is PayHere's own
                // internal payment reference (e.g. 104), NOT your DB order ID.
                // checkoutData.orderId is "ORDER-100" (set by the backend), which reliably
                // contains the real order primary key. Extract the number from that instead.
                const numericOrderId = parseInt(String(checkoutData.orderId).replace(/[^0-9]/g, ''), 10);
                console.log('[DEBUG UPLOAD] 5. Resolved customerId:', resolvedCustomerId, '| Numeric orderId (from checkoutData):', numericOrderId, '| PayHere completedOrderId (ignored for upload):', completedOrderId);

                if (!resolvedCustomerId) {
                  console.error('[DEBUG UPLOAD] 5a. Error: No valid customer ID found in user session data. Skipping bouquet image upload.');
                } else {
                  for (const customItem of customItems) {
                    const targetCustomId = customItem.customizationId || customItem.id;
                    console.log('[DEBUG UPLOAD] 6. Each item customizationId or id:', targetCustomId);

                    if (!targetCustomId) {
                      console.warn('[DEBUG UPLOAD] 6a. Item skipped because targetCustomId is missing');
                      continue;
                    }

                    try {
                      const blob = await getBouquetImage(targetCustomId);
                      console.log('[DEBUG UPLOAD] 7. getBouquetImage returned Blob:', blob ? `Blob size: ${blob.size} bytes, type: ${blob.type}` : 'NULL/UNDEFINED');

                      if (blob) {
                        const formData = new FormData();
                        formData.append('image', blob, `custom_bouquet_${targetCustomId}.png`);
                        formData.append('customerId', String(resolvedCustomerId));
                        formData.append('orderId', String(numericOrderId));

                        console.log('[DEBUG UPLOAD] 8. Immediately before POST /api/customized-bouquets/upload-image', {
                          customerId: resolvedCustomerId,
                          orderId: numericOrderId,
                          fileName: `custom_bouquet_${targetCustomId}.png`
                        });

                        const uploadRes = await api.post('/api/customized-bouquets/upload-image', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });

                        console.log('[DEBUG UPLOAD] 9. Upload success response:', uploadRes.status, uploadRes.data);

                        if (uploadRes.status === 200 || uploadRes.status === 201) {
                          await deleteBouquetImage(targetCustomId);
                          console.log('[DEBUG UPLOAD] 10. Successfully deleted bouquet image from IndexedDB for targetCustomId:', targetCustomId);
                        }
                      } else {
                        console.warn(`[DEBUG UPLOAD] 7a. No Blob found in IndexedDB for customizationId ${targetCustomId}`);
                      }
                    } catch (uploadErr) {
                      console.error(`[DEBUG UPLOAD] 9. Upload error for customizationId ${targetCustomId}:`, uploadErr);
                      console.error(`[DEBUG UPLOAD] 9a. Upload HTTP error status:`, uploadErr.response?.status, `Response data:`, uploadErr.response?.data);
                    }

                  }
                }


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
                await clearCartAfterCheckout();
                setCheckoutStep('cart');
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

      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 animate-fade-in z-40"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#fcf9f8] h-screen max-h-screen shadow-2xl flex flex-col border-l border-[#d9d2d0]/20 z-50 animate-slide-left text-left"
      >

        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#d9d2d0]/30 bg-[#faf8f6] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {checkoutStep === 'shipping' ? (
              <button
                onClick={() => setCheckoutStep('cart')}
                className="p-1 hover:bg-[#f4f0ed] rounded-full text-[#1a1a1a] transition-all"
                aria-label="Back to Cart"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <ShoppingBag size={18} className="text-[#8c5e5e]" />
            )}
            <h2 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {checkoutStep === 'shipping' ? 'Checkout Details' : 'Your Cart'}
            </h2>
            {checkoutStep === 'cart' && (
              <span className="bg-[#8c5e5e]/10 text-[#8c5e5e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#f4f0ed] rounded-full text-[#1a1a1a]/60 hover:text-[#8c5e5e] transition-all"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* VIEW 1: CART ITEMS STEP */}
        {checkoutStep === 'cart' && (
          <>
            {/* Scrollable Cart Content */}
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

                        {/* Product Image */}
                        <div className="w-20 h-24 bg-[#f4f0ed] rounded-sm overflow-hidden flex-shrink-0 border border-[#d9d2d0]/15 shadow-sm">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Product Details */}
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

                          {/* Quantity Controls */}
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

                        {/* Price & Remove */}
                        <div className="flex flex-col justify-between items-end text-right pl-1 flex-shrink-0">
                          <p className="text-xs font-bold text-[#8c5e5e] font-mono">
                            Rs {(itemPrice * item.quantity).toFixed(2)}
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

            {/* Cart Footer */}
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

                {/* Subtotal Display */}
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

                {/* Proceed Button */}
                <div className="pt-1 space-y-2">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-3.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
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
          </>
        )}

        {/* VIEW 2: CUSTOMER DETAILS & PAYMENT FORM STEP */}
        {checkoutStep === 'shipping' && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto px-6 py-5 bg-[#fcf9f8] space-y-6">
            <div className="space-y-4">
              {/* Form Section Header */}
              <div className="border-b border-[#d9d2d0]/30 pb-3">
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#8c5e5e] mb-0.5">
                  Step 2 of 2
                </p>
                <h3 className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Customer Details
                </h3>
                <p className="text-xs text-[#1a1a1a]/60 mt-0.5">
                  Please provide your delivery information below.
                </p>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={customerDetails.firstName}
                      onChange={(e) => handleDetailChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={customerDetails.lastName}
                      onChange={(e) => handleDetailChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="32B, Sir Mohamed Macan Marker Mawatha"
                    value={customerDetails.address}
                    onChange={(e) => handleDetailChange('address', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Colombo"
                      value={customerDetails.city}
                      onChange={(e) => handleDetailChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                      Postal Code <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="00100"
                      value={customerDetails.postalCode}
                      onChange={(e) => handleDetailChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={customerDetails.phone}
                    onChange={(e) => handleDetailChange('phone', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={customerDetails.email}
                    onChange={(e) => handleDetailChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]/70 mb-1">
                    When would you like to get this Order? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={minDeliveryDate}
                    value={customerDetails.deliveryDate || minDeliveryDate}
                    onChange={(e) => handleDetailChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[#d9d2d0] focus:outline-none focus:border-[#8c5e5e] bg-white font-medium text-[#1a1a1a] cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
                    <Calendar size={12} className="text-[#8c5e5e]" />
                    Available from 5 days from today ({minDeliveryDate}).
                  </p>
                </div>

                {/* Save details checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveInformation"
                    checked={saveInfo}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSaveInfo(checked);
                      if (checked) {
                        localStorage.setItem('savedCustomerDetails', JSON.stringify(customerDetails));
                      } else {
                        localStorage.removeItem('savedCustomerDetails');
                      }
                    }}
                    className="w-4 h-4 rounded border-[#d9d2d0] accent-[#8c5e5e] cursor-pointer"
                  />
                  <label htmlFor="saveInformation" className="text-xs text-[#1a1a1a]/80 font-medium cursor-pointer select-none">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Section: Payment Methods */}
            <div className="border-t border-[#d9d2d0]/40 pt-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/80 mb-2">
                  Payment Method
                </h4>
                <div className="flex items-center justify-between p-3 rounded-sm border border-[#8c5e5e] bg-[#8c5e5e]/5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={18} className="text-[#8c5e5e]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a1a]">Online Payment Gateway</span>
                      <span className="text-[10px] text-gray-500 font-medium">Credit / Debit Card (Visa, MasterCard, AMEX)</span>
                    </div>
                  </div>
                  <ShieldCheck size={18} className="text-[#8c5e5e]" />
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center pt-2 border-t border-[#d9d2d0]/25">
                <span className="text-xs font-bold text-[#1a1a1a]">Final Order Amount</span>
                <span className="text-lg font-bold text-[#8c5e5e] font-mono" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Rs {finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Confirm Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleFinalCheckout}
                  disabled={isProcessing}
                  className={`w-full py-3.5 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] ${isProcessing
                    ? 'bg-[#8c5e5e]/75 cursor-not-allowed'
                    : 'bg-[#8c5e5e] hover:bg-[#7d4d50]'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay Now</span>
                  )}
                </button>

                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-2.5 text-xs text-[#1a1a1a]/65 font-bold hover:text-[#8c5e5e] transition-colors"
                >
                  Back to Shopping Cart
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
