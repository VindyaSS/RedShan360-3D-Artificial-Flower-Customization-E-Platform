import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { arrangeBouquet, relaxOverlaps } from '../../components/bouquet/LayoutEngine';
import BouquetCanvas from '../../components/bouquet/BouquetCanvas';
import CartDrawer from '../GuestUser/components/CartDrawer';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Trash2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Camera, 
  Calendar, 
  Truck,
  ArrowRight,
  Sparkles,
  Shuffle
} from 'lucide-react';

// Predefined stems database with rich details and local/system images
const STEMS_DATABASE = [
  ...products.filter(p => p.type === 'single-stem').map(p => ({
    id: p.id.toString(),
    name: p.title,
    category: 'premium-blooms',
    price: p.numericPrice ? p.numericPrice / 100 : 20.00,
    image: p.image,
    color: p.colors[0]?.hex || '#a82c2c',
    description: p.description
  })),
  {
    id: 'spiral-handtied',
    name: 'Hand-tied Spiral Style',
    category: 'bouquet-styles',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#bfa38a',
    description: 'European spiral binding styling structure'
  },
  {
    id: 'classic-dome',
    name: 'Classic Dome Style',
    category: 'bouquet-styles',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#dfcfbe',
    description: 'Traditional symmetric rounded arrangement structure'
  },
  {
    id: 'silver-eucalyptus',
    name: 'Silver Dollar Eucalyptus',
    category: 'decorative-foliage',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#8da89d',
    description: 'Sage green rounded coin leaves'
  },
  {
    id: 'emerald-fern',
    name: 'Emerald Fern Leaf',
    category: 'decorative-foliage',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#5c8774',
    description: 'Delicate branching feathery deep green fern'
  },
  {
    id: 'velvet-ribbon',
    name: 'Velvet Burgundy Ribbon',
    category: 'wrapping-accents',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#5c2c2c',
    description: 'Plush velvet ribbon around the vase neck'
  },
  {
    id: 'kraft-paper',
    name: 'Kraft Paper Wrapping',
    category: 'wrapping-accents',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#d2b48c',
    description: 'Minimalist rustic brown paper wraps'
  }
];

export default function BoquetCustomization() {
  const navigate = useNavigate();

  // Page states
  const [selectedStems, setSelectedStems] = useState([]); // Array of { stemId, quantity }
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const headerRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Synchronize cart count from localStorage and listen to updates
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('redshan360_cart');
      if (savedCart) {
        const cartList = JSON.parse(savedCart);
        const validItems = cartList.filter((item) => item.isCustom || products.some((p) => p.id === item.id));
        setCartCount(validItems.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleOpenCart = () => setIsCartOpen(true);

    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('open-cart', handleOpenCart);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  // Synchronize wishlist count
  useEffect(() => {
    const updateWishlistCount = () => {
      const savedWishlist = localStorage.getItem('redshan360_wishlist');
      if (savedWishlist) {
        const wishlistObj = JSON.parse(savedWishlist);
        const count = Object.keys(wishlistObj).filter(
          (key) => wishlistObj[key] === true && products.some((p) => p.id === Number(key))
        ).length;
        setWishlistCount(count);
      } else {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();

    window.addEventListener('wishlist-updated', updateWishlistCount);
    return () => {
      window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []);

  // Click outside listener for profile and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };
  const [activeCategory, setActiveCategory] = useState({
    'premium-blooms': true,
    'bouquet-styles': false,
    'decorative-foliage': false,
    'wrapping-accents': false
  });

  // 3D Canvas states
  const [zoomLevel, setZoomLevel] = useState('normal'); // 'normal' or 'zoomed'
  const [rotationDegree, setRotationDegree] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [flowers, setFlowers] = useState([]);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [isSwapMode, setIsSwapMode] = useState(false);
  const [selectedSwapFlowerId, setSelectedSwapFlowerId] = useState(null);

  // Swap locations of two flowers
  const swapFlowers = (id1, id2) => {
    setFlowers(prevFlowers => {
      const f1 = prevFlowers.find(f => f.id === id1);
      const f2 = prevFlowers.find(f => f.id === id2);

      if (!f1 || !f2) return prevFlowers;

      const updated = prevFlowers.map(f => {
        if (f.id === id1) {
          return {
            ...f,
            position: [...f2.position],
            rotation: [...f2.rotation],
            scale: [...f2.scale],
            isManuallyEdited: true // Lock positions post-swap
          };
        }
        if (f.id === id2) {
          return {
            ...f,
            position: [...f1.position],
            rotation: [...f1.rotation],
            scale: [...f1.scale],
            isManuallyEdited: true // Lock positions post-swap
          };
        }
        return f;
      });

      triggerToast('Flowers swapped successfully!');
      setSelectedSwapFlowerId(null);
      return updated;
    });
  };

  // Selection coordination handler for standard and swap modes
  const handleSelectFlower = (flowerId) => {
    if (!flowerId) {
      if (!isSwapMode) setSelectedFlowerId(null);
      return;
    }

    if (isSwapMode) {
      if (!selectedSwapFlowerId) {
        setSelectedSwapFlowerId(flowerId);
        triggerToast('Select second flower to swap');
      } else {
        if (selectedSwapFlowerId === flowerId) {
          setSelectedSwapFlowerId(null);
        } else {
          swapFlowers(selectedSwapFlowerId, flowerId);
        }
      }
    } else {
      setSelectedFlowerId(flowerId);
    }
  };

  // Update position and rotation for manually edited flowers
  const handleUpdateFlowerTransform = (flowerId, position, rotation) => {
    setFlowers(prevFlowers => {
      const updated = prevFlowers.map(f => {
        if (f.id === flowerId) {
          return {
            ...f,
            position,
            rotation,
            isManuallyEdited: true
          };
        }
        return f;
      });
      return relaxOverlaps(updated, STEMS_DATABASE, 10);
    });
  };

  // Compute selected options from selectedStems array
  const selectedStyle = useMemo(() => {
    const hasSpiral = selectedStems.some(s => s.stemId === 'spiral-handtied');
    return hasSpiral ? 'spiral-handtied' : 'classic-dome';
  }, [selectedStems]);

  const wrappingId = useMemo(() => {
    const wrap = selectedStems.find(s => {
      const dbItem = STEMS_DATABASE.find(item => item.id === s.stemId);
      return dbItem?.category === 'wrapping-accents' && s.stemId !== 'velvet-ribbon';
    });
    return wrap ? wrap.stemId : null;
  }, [selectedStems]);

  const ribbonId = useMemo(() => {
    const hasRibbon = selectedStems.some(s => s.stemId === 'velvet-ribbon');
    return hasRibbon ? 'velvet-ribbon' : null;
  }, [selectedStems]);

  // Sync selectedStems quantities to 3D individual flowers array
  useEffect(() => {
    setFlowers((prevFlowers) => {
      let updatedFlowers = [...prevFlowers];
      let needsRearrange = false;

      // Filter out non-flower selections from stems database (exclude styles/ribbons/wraps)
      const validStems = selectedStems.filter(s => {
        const dbItem = STEMS_DATABASE.find(item => item.id === s.stemId);
        return dbItem && dbItem.category !== 'bouquet-styles' && dbItem.category !== 'wrapping-accents';
      });

      // 1. Add missing flower instances
      validStems.forEach((item) => {
        const currentCount = updatedFlowers.filter(f => f.stemId === item.stemId).length;
        const diff = item.quantity - currentCount;
        
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            updatedFlowers.push({
              id: `${item.stemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              stemId: item.stemId,
              position: [0, 2.5, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              isManuallyEdited: false
            });
          }
          needsRearrange = true;
        }
      });

      // 2. Remove excess flower instances
      const targetQuantities = {};
      validStems.forEach(item => {
        targetQuantities[item.stemId] = item.quantity;
      });

      const groupedFlowers = {};
      updatedFlowers.forEach(f => {
        if (!groupedFlowers[f.stemId]) groupedFlowers[f.stemId] = [];
        groupedFlowers[f.stemId].push(f);
      });

      Object.keys(groupedFlowers).forEach(stemId => {
        const targetCount = targetQuantities[stemId] || 0;
        const currentCount = groupedFlowers[stemId].length;
        const diff = currentCount - targetCount;

        if (diff > 0) {
          // Prioritize removing non-manually edited ones
          groupedFlowers[stemId].sort((a, b) => {
            if (a.isManuallyEdited && !b.isManuallyEdited) return -1;
            if (!a.isManuallyEdited && b.isManuallyEdited) return 1;
            return 0;
          });

          for (let i = 0; i < diff; i++) {
            const toRemove = groupedFlowers[stemId].pop();
            updatedFlowers = updatedFlowers.filter(f => f.id !== toRemove.id);
          }
          needsRearrange = true;
        }
      });

      // 3. Clear non-selected items from state
      const validStemIds = validStems.map(s => s.stemId);
      const preCleanupCount = updatedFlowers.length;
      updatedFlowers = updatedFlowers.filter(f => validStemIds.includes(f.stemId));
      if (updatedFlowers.length !== preCleanupCount) {
        needsRearrange = true;
      }

      if (needsRearrange) {
        return arrangeBouquet(updatedFlowers, selectedStyle, STEMS_DATABASE);
      }
      return updatedFlowers;
    });
  }, [selectedStems, selectedStyle]);

  // Search and filter stems
  const filteredStems = useMemo(() => {
    return STEMS_DATABASE.filter(stem => 
      stem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stem.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Toggle category expand/collapse
  const toggleCategory = (categoryKey) => {
    setActiveCategory(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Add a stem to the customizer selection
  const handleAddStem = (stemId) => {
    setSelectedStems(prev => {
      const existing = prev.find(item => item.stemId === stemId);
      if (existing) {
        return prev.map(item => 
          item.stemId === stemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { stemId, quantity: 1 }];
      }
    });
  };

  // Remove or decrement a stem from the selection
  const handleRemoveStem = (stemId) => {
    setSelectedStems(prev => {
      const existing = prev.find(item => item.stemId === stemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(item => 
          item.stemId === stemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => item.stemId !== stemId);
      }
    });
  };

  // Complete removal of a stem category
  const handleClearStem = (stemId) => {
    setSelectedStems(prev => prev.filter(item => item.stemId !== stemId));
  };

  // Canvas Toolbar operations
  const handleReset = () => {
    setSelectedStems([]);
    setFlowers([]);
    setSelectedFlowerId(null);
    setIsSwapMode(false);
    setSelectedSwapFlowerId(null);
    setRotationDegree(0);
    setZoomLevel('normal');
    triggerToast('Interactive canvas has been reset');
  };

  const handleZoom = () => {
    setZoomLevel(prev => prev === 'normal' ? 'zoomed' : 'normal');
    triggerToast(zoomLevel === 'normal' ? 'Zoomed in on arrangement' : 'Restored default zoom view');
  };

  const handleRotate = () => {
    setRotationDegree(prev => prev + 90);
    triggerToast('Rotating interactive canvas');
  };

  const handleCameraSnapshot = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 400);
    triggerToast('📸 Arrangement snapshot saved to your collection!');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? '' : prev);
    }, 3000);
  };

  // Cart action
  const handleAddToCart = () => {
    const savedCart = localStorage.getItem('redshan360_cart');
    const cartList = savedCart ? JSON.parse(savedCart) : [];

    // Generate a unique ID for this specific curation
    const customBouquetId = 'custom-' + Date.now();

    // Map selected stems to descriptive names
    const selectedStemsDetails = selectedStems
      .map(item => {
        const dbItem = STEMS_DATABASE.find(s => s.id === item.stemId);
        return dbItem ? `${item.quantity}x ${dbItem.name}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const customBouquetItem = {
      id: customBouquetId,
      isCustom: true,
      title: 'Custom Bouquet Arrangement',
      price: '$' + estimatedTotal.toFixed(2),
      numericPrice: estimatedTotal,
      image: '/images/peonies_vase.png',
      selectedColor: selectedStemsDetails || 'Custom Curation',
      quantity: 1,
      // Save full custom 3D bouquet configuration!
      bouquetDesign: {
        flowers: flowers.map(f => ({
          flowerId: f.id,
          stemId: f.stemId,
          position: f.position,
          rotation: f.rotation,
          scale: f.scale,
          isManuallyEdited: f.isManuallyEdited
        })),
        style: selectedStyle,
        wrappingId,
        ribbonId
      }
    };

    cartList.push(customBouquetItem);

    localStorage.setItem('redshan360_cart', JSON.stringify(cartList));

    // Dispatch events to trigger UI reactivity
    window.dispatchEvent(new Event('cart-updated'));
    window.dispatchEvent(new Event('open-cart'));

    triggerToast('🛒 Custom arrangement added to shopping cart!');
  };

  // Price calculations
  const basePrice = 45.00; // Crystal Vase (Base)
  const botanicalSelectionPrice = useMemo(() => {
    return selectedStems.reduce((sum, item) => {
      const dbItem = STEMS_DATABASE.find(s => s.id === item.stemId);
      return sum + (dbItem ? dbItem.price * item.quantity : 0);
    }, 0);
  }, [selectedStems]);

  const estimatedTotal = basePrice + botanicalSelectionPrice;

  // Map category tags for rendering
  const categoriesList = [
    { key: 'premium-blooms', label: 'PREMIUM BLOOMS' },
    { key: 'bouquet-styles', label: 'BOUQUET STYLES' },
    { key: 'decorative-foliage', label: 'DECORATIVE FOLIAGE' },
    { key: 'wrapping-accents', label: 'WRAPPING & ACCENTS' }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf9] text-[#563c37] flex flex-col relative" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
      
      {/* SHUTTER FLASH OVERLAY */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[9999] opacity-90 transition-opacity duration-300 animate-pulse pointer-events-none" />
      )}

      {/* FLOATING ACTION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#563c37] text-white text-sm font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 animate-bounce border border-[#4a322e]">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header ref={headerRef} className="bg-[#fdfbf9] h-[80px] border-b border-[#f0ebe4] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 h-full flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/guestUserDashboard" className="text-[26px] md:text-[28px] font-bold tracking-tight text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
              RedShan<span className="text-[#8c5e5e] italic font-normal">360</span>
            </a>
          </div>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/guestUserDashboard" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Home</a>
            <a href="/shop" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Shop</a>
            <a href="/customization" className="text-xs uppercase tracking-widest font-bold text-[#563c37] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[2px] after:bg-[#563c37]">Customization</a>
            <a href="/about" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">About</a>
            <a href="/contact" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Contact</a>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-5">
            <button className="p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300" aria-label="Search items">
              <Search size={20} />
            </button>

            {/* Wishlist Button */}
            <a 
              href="/shop?wishlist=true"
              className="relative p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#563c37] text-[9px] text-white font-bold flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </a>
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300" 
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#563c37] text-[9px] text-white font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Button with Dropdown */}
            <div ref={profileDropdownRef} className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300"
                aria-label="Profile"
              >
                <User size={20} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#fdfbf9] border border-[#ece7e2] rounded-lg shadow-lg z-50 py-1 text-left animate-fadeIn">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#563c37] hover:bg-[#f5efeb] transition-colors duration-200 font-semibold uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#563c37] transition-colors duration-300" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-4 bg-[#fdfbf9] border-t border-[#f0ebe4] px-6 text-left absolute top-[80px] left-0 w-full shadow-lg z-50 animate-fadeIn">
            <a href="/guestUserDashboard" onClick={() => setMobileMenuOpen(false)} className="block text-xs uppercase tracking-widest font-semibold text-[#563c37] hover:text-[#8c5e5e] py-1">Home</a>
            <a href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-xs uppercase tracking-widest font-semibold text-[#563c37] hover:text-[#8c5e5e] py-1">Shop</a>
            <a href="/customization" onClick={() => setMobileMenuOpen(false)} className="block text-xs uppercase tracking-widest font-bold text-[#8c5e5e] py-1">Customization</a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-xs uppercase tracking-widest font-semibold text-[#563c37] hover:text-[#8c5e5e] py-1">About</a>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-xs uppercase tracking-widest font-semibold text-[#563c37] hover:text-[#8c5e5e] py-1">Contact</a>
            
            <div className="flex items-center gap-4 pt-4 border-t border-[#f0ebe4]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/shop');
                }}
                className="p-2 rounded-full bg-[#f5efeb] text-[#563c37]"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <a 
                href="/shop?wishlist=true"
                onClick={() => setMobileMenuOpen(false)}
                className="relative p-2 rounded-full bg-[#f5efeb] text-[#563c37]"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#563c37] text-[9px] text-white font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="relative p-2 rounded-full bg-[#f5efeb] text-[#563c37]"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#563c37] text-[9px] text-white font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-[#f5efeb] text-[#563c37]"
                aria-label="Logout"
                title="Logout"
              >
                <User size={18} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: BOTANICALS SELECTOR */}
        <section className="lg:col-span-3 order-2 lg:order-1 bg-white rounded-[24px] border border-[#f0ebe4] p-4 sm:p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col gap-6 self-stretch">
          <div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#563c37] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Botanicals
            </h2>
            <p className="text-xs text-[#563c37]/60 leading-relaxed font-medium">
              Select individual stems to curate your piece.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center bg-[#fdfbf9] border border-[#ece7e2] rounded-lg px-3 py-2.5">
            <Search size={14} className="text-[#563c37]/40 mr-2" />
            <input 
              type="text" 
              placeholder="Search stems"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-[#563c37] placeholder:text-[#563c37]/40"
            />
          </div>

          {/* Categories list accordion */}
          <div className="flex flex-col gap-2">
            {categoriesList.map((category) => {
              const categoryStems = filteredStems.filter(s => s.category === category.key);
              const isExpanded = activeCategory[category.key];

              return (
                <div key={category.key} className="border-b border-[#fdfbf9] pb-3 last:border-0 last:pb-0">
                  <button 
                    onClick={() => toggleCategory(category.key)}
                    className="flex justify-between items-center w-full text-left font-bold text-xs tracking-wider uppercase text-[#563c37] py-3 hover:text-[#8c5e5e] transition-colors duration-300"
                  >
                    <span>{category.label}</span>
                    {isExpanded ? <ChevronUp size={14} className="text-[#563c37]/60" /> : <ChevronDown size={14} className="text-[#563c37]/60" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 flex flex-col gap-4 animate-fadeIn">
                      {categoryStems.length === 0 ? (
                        <p className="text-[11px] text-[#563c37]/40 italic py-1">No stems match your search.</p>
                      ) : (
                        categoryStems.map((stem) => {
                          const quantitySelected = selectedStems.find(s => s.stemId === stem.id)?.quantity || 0;

                          return (
                            <div key={stem.id} className="flex items-center gap-3 bg-[#fdfbf9]/70 p-2 rounded-xl border border-[#f5efeb] hover:border-[#8c5e5e]/25 transition-all">
                              <img 
                                src={stem.image} 
                                alt={stem.name} 
                                className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm border border-[#ece7e2]"
                              />
                              <div className="flex-grow min-w-0">
                                <h4 className="text-xs font-bold text-[#563c37] truncate">{stem.name}</h4>
                                <p className="text-[10px] text-[#563c37]/50 leading-tight truncate">{stem.description}</p>
                                <span className="text-xs font-semibold text-[#8c5e5e] mt-1 inline-block">
                                  +${stem.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {quantitySelected > 0 && (
                                  <>
                                    <button 
                                      onClick={() => handleRemoveStem(stem.id)}
                                      className="w-8 h-8 sm:w-6 sm:h-6 rounded-full border border-[#ece7e2] flex items-center justify-center hover:bg-[#563c37] hover:text-white hover:border-[#563c37] transition-colors text-sm sm:text-xs text-[#563c37] active:scale-95"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-bold text-[#563c37] w-4 text-center">{quantitySelected}</span>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleAddStem(stem.id)}
                                  className="w-8 h-8 sm:w-6 sm:h-6 rounded-full border border-[#ece7e2] flex items-center justify-center hover:bg-[#563c37] hover:text-white hover:border-[#563c37] transition-colors text-sm sm:text-xs text-[#563c37] active:scale-95"
                                  aria-label="Add stem"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* MIDDLE PANEL: 3D INTERACTIVE CANVAS */}
        <section className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-6 items-center w-full">
          <div className="w-full bg-[#fcf9f6] rounded-[24px] border border-[#f0ebe4] p-4 sm:p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            
            {/* Header info inside canvas */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c5e5e]" />
                <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#563c37]/50">
                  Interactive Canvas
                </span>
              </div>
            </div>

            {/* 3D Viewport wrapper */}
            <div className="flex-grow flex items-center justify-center relative select-none h-[300px] sm:h-[400px] md:h-[480px]">
              <BouquetCanvas
                flowers={flowers}
                wrappingId={wrappingId}
                ribbonId={ribbonId}
                stemsDatabase={STEMS_DATABASE}
                selectedFlowerId={selectedFlowerId}
                selectedSwapFlowerId={selectedSwapFlowerId}
                isSwapMode={isSwapMode}
                onSelectFlower={handleSelectFlower}
                onUpdateFlowerTransform={handleUpdateFlowerTransform}
              />
            </div>

            {/* FLOATING CONTROLS TOOLBAR */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-[#ece7e2] rounded-full p-2.5 shadow-lg flex items-center gap-4 z-20">
              <button 
                onClick={handleReset}
                className="w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-[#563c37]/65 hover:text-[#563c37] hover:bg-[#fdfbf9] transition-all"
                title="Reset arrangement"
                aria-label="Reset arrangement"
              >
                <RotateCcw size={16} />
              </button>

              <button 
                onClick={handleZoom}
                className="w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-[#563c37]/65 hover:text-[#563c37] hover:bg-[#fdfbf9] transition-all"
                title="Toggle zoom"
                aria-label="Toggle zoom"
              >
                {zoomLevel === 'zoomed' ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              </button>

              <button 
                onClick={() => {
                  setIsSwapMode(prev => {
                    const next = !prev;
                    if (next) {
                      setSelectedFlowerId(null); // Clear normal selection
                      setSelectedSwapFlowerId(null);
                      triggerToast('Swap Mode Enabled: Click two flowers to swap');
                    } else {
                      setSelectedSwapFlowerId(null);
                      triggerToast('Swap Mode Disabled');
                    }
                    return next;
                  });
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isSwapMode 
                    ? 'bg-[#563c37] text-white shadow-md' 
                    : 'bg-transparent text-[#563c37]/65 hover:text-[#563c37] hover:bg-[#fdfbf9]'
                }`}
                title="Swap flower positions"
                aria-label="Swap flower positions"
              >
                <Shuffle size={16} />
              </button>

              <button 
                onClick={handleRotate}
                className="w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-[#563c37]/65 hover:text-[#563c37] hover:bg-[#fdfbf9] transition-all"
                title="Rotate bouquet"
                aria-label="Rotate bouquet"
              >
                <RefreshCw size={16} className={rotationDegree > 0 ? "transition-transform" : ""} />
              </button>

              <div className="h-6 w-[1px] bg-[#ece7e2]" />

              <button 
                onClick={handleCameraSnapshot}
                className="w-10 h-10 rounded-full bg-[#563c37] hover:bg-[#8c5e5e] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                title="Take snapshot"
                aria-label="Take snapshot"
              >
                <Camera size={18} />
              </button>
            </div>

          </div>
        </section>

        {/* RIGHT PANEL: ARRANGEMENT SUMMARY */}
        <section className="lg:col-span-3 order-3 lg:order-3 flex flex-col gap-6 self-stretch">
          
          {/* Main summary card */}
          <div className="bg-white rounded-[24px] border border-[#f0ebe4] p-4 sm:p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col gap-6 flex-grow">
            <div>
              <h2 className="text-2xl sm:text-[26px] font-bold text-[#563c37] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Arrangement
              </h2>
              <p className="text-xs text-[#563c37]/60 font-medium">
                Artisanal Curation
              </p>
            </div>

            {/* Checklist / Selection items */}
            <div className="flex-grow flex flex-col justify-start min-h-[160px]">
              {selectedStems.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-[#e8dfd8] rounded-2xl bg-[#fdfbf9]/60 my-auto text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5efeb] flex items-center justify-center mb-3 text-[#8c5e5e]/80">
                    {/* Flower/leaf simple outline icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-60">
                      <path d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2ZM12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11Z" fill="currentColor" fillOpacity="0.05" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold italic text-[#563c37]/50 leading-relaxed max-w-[170px]">
                    Your canvas is waiting. Add some stems to begin your piece.
                  </p>
                </div>
              ) : (
                // List of selection items
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedStems.map((item) => {
                    const dbItem = STEMS_DATABASE.find(s => s.id === item.stemId);
                    if (!dbItem) return null;

                    return (
                      <div key={item.stemId} className="flex justify-between items-center py-2 border-b border-[#fdfbf9] last:border-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#563c37] truncate">{dbItem.name}</h4>
                          <span className="text-[10px] text-[#563c37]/55 uppercase tracking-wide">
                            {item.quantity} × ${dbItem.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#563c37]">
                            ${(dbItem.price * item.quantity).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => handleClearStem(item.stemId)}
                            className="text-[#563c37]/40 hover:text-[#8c5e5e] transition-colors"
                            aria-label={`Remove all ${dbItem.name}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[#fdfbf9] pt-4 flex flex-col gap-3">
              {/* Pricing list */}
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>CRYSTAL VASE (BASE)</span>
                <span className="text-[#563c37]">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>BOTANICAL SELECTION</span>
                <span className="text-[#563c37]">${botanicalSelectionPrice.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#fdfbf9] my-1" />

              {/* Total price */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#563c37]/50 block mb-0.5">
                    Estimated Total
                  </span>
                  <span className="text-3xl font-extrabold text-[#563c37] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    ${estimatedTotal.toFixed(2)}
                  </span>
                </div>
                
                {/* Free shipping badge */}
                <div className="bg-[#f5efeb] text-[#563c37] text-[8px] font-extrabold tracking-widest uppercase rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-[#ece3dc]">
                  <Truck size={10} className="text-[#8c5e5e]" />
                  <span>Complimentary Shipping</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#563c37] hover:bg-[#4a322e] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#563c37]/5"
              >
                <span>Add to Cart</span>
                <ArrowRight size={14} />
              </button>
              
              <span className="text-[9px] font-extrabold tracking-[0.18em] text-[#563c37]/45 text-center uppercase block mt-1">
                Secure Artisanal Delivery Guaranteed
              </span>
            </div>

          </div>

          {/* Delivery timeline card */}
          <div className="bg-white rounded-2xl border border-[#f0ebe4] p-4 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#fdfbf9] border border-[#f5efeb] flex items-center justify-center flex-shrink-0 text-[#8c5e5e]">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-[9px] font-extrabold tracking-wider uppercase text-[#563c37]/50">
                Earliest Delivery
              </h4>
              <p className="text-xs text-[#563c37] leading-normal font-medium mt-0.5">
                Order in <strong className="text-[#563c37] font-bold">4h 20m</strong> for Friday delivery
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#fcf9f6] text-[#563c37] border-t border-[#f0ebe4] pt-16 pb-10 px-6 md:px-12 lg:px-16 mt-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <h3 className="text-2xl font-bold tracking-tight text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                RedShan360
              </h3>
              <p className="text-xs text-[#563c37]/60 leading-relaxed max-w-sm font-medium">
                Dedicated to the preservation of botanical beauty through high-fidelity silk artistry and architectural floral design.
              </p>
            </div>

            {/* Column 2: Collections navigation */}
            <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4">
              <h4 className="text-[9px] font-extrabold tracking-widest text-[#563c37]/45 uppercase">
                Collections
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[#563c37]/85">
                <li><a href="/shop" className="hover:text-[#8c5e5e] transition-colors">The Rose Vault</a></li>
                <li><a href="/shop" className="hover:text-[#8c5e5e] transition-colors">Ethereal Orchids</a></li>
                <li><a href="/shop" className="hover:text-[#8c5e5e] transition-colors">Verdant Greenery</a></li>
                <li><a href="/shop" className="hover:text-[#8c5e5e] transition-colors">Seasonal Curations</a></li>
              </ul>
            </div>

            {/* Column 3: Support links */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h4 className="text-[9px] font-extrabold tracking-widest text-[#563c37]/45 uppercase">
                Support
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold text-[#563c37]/85">
                <li><a href="/about" className="hover:text-[#8c5e5e] transition-colors">Sustainability</a></li>
                <li><a href="/shipping" className="hover:text-[#8c5e5e] transition-colors">Shipping & Returns</a></li>
                <li><a href="/care" className="hover:text-[#8c5e5e] transition-colors">Care Instructions</a></li>
                <li><a href="/terms" className="hover:text-[#8c5e5e] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h4 className="text-[9px] font-extrabold tracking-widest text-[#563c37]/45 uppercase">
                Stay Inspired
              </h4>
              <div className="relative flex items-center border-b border-[#563c37]/20 pb-1.5 focus-within:border-[#563c37] transition-colors">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-transparent border-none outline-none text-xs text-[#563c37] placeholder:text-[#563c37]/30 w-full pr-6"
                />
                <button 
                  onClick={() => triggerToast('Subscribed to newsletter!')}
                  className="absolute right-0 hover:text-[#8c5e5e] transition-colors text-[#563c37]/80"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-[#f0ebe4] pt-8 flex items-center justify-center">
            <span className="text-[9px] font-bold tracking-widest text-[#563c37]/40 uppercase text-center">
              © 2024 REDSHAN360. ALL RIGHTS RESERVED.
            </span>
          </div>

        </div>
      </footer>

      {/* Shared Cart Drawer Overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
}
