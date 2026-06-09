import React, { useState, useMemo, useEffect } from 'react';
import { products } from '../../data/products';
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
  Sparkles
} from 'lucide-react';

// Predefined stems database with rich details and Unsplash image URLs
const STEMS_DATABASE = [
  {
    id: 'crimson-rose',
    name: 'Crimson Rose',
    category: 'premium-blooms',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#a82c2c',
    description: 'Deep red, layered classical velvet rose'
  },
  {
    id: 'blushing-peony',
    name: 'Blushing Peony',
    category: 'premium-blooms',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#f0cbd0',
    description: 'Delicate light pink ruffled peony blossom'
  },
  {
    id: 'ethereal-orchid',
    name: 'Ethereal Orchid',
    category: 'premium-blooms',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#f5e6f5',
    description: 'Graceful white and amethyst cascading orchid'
  },
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
  // Page states
  const [selectedStems, setSelectedStems] = useState([]); // Array of { stemId, quantity }
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      image: '/peonies_vase.png',
      selectedColor: selectedStemsDetails || 'Custom Curation',
      quantity: 1,
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
      <header className="bg-[#fdfbf9] h-[80px] flex items-center justify-between px-6 md:px-12 lg:px-16 sticky top-0 z-40">
        <div className="flex-shrink-0">
          <a href="/guestUserDashboard" className="text-[26px] md:text-[28px] font-bold tracking-tight text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            RedShan<span className="text-[#8c5e5e] italic font-normal">360</span>
          </a>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/guestUserDashboard" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Home</a>
          <a href="/shop" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Shop</a>
          <a href="/customization" className="text-xs uppercase tracking-widest font-bold text-[#563c37] transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[2px] after:bg-[#563c37]">Customization</a>
          <a href="/about" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">About</a>
          <a href="/contact" className="text-xs uppercase tracking-widest font-semibold text-[#563c37]/75 hover:text-[#563c37] transition-colors duration-300">Contact</a>
        </nav>

        <div className="flex items-center gap-5">
          <button className="p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300" aria-label="Search items">
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#563c37] hover:text-[#8c5e5e] transition-colors duration-300" 
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-[16px] rounded-full bg-[#563c37] text-[9px] text-white font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: BOTANICALS SELECTOR */}
        <section className="lg:col-span-3 bg-white rounded-[24px] border border-[#f0ebe4] p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col gap-6 self-stretch">
          <div>
            <h2 className="text-[26px] font-bold text-[#563c37] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                              <div className="flex items-center gap-1.5">
                                {quantitySelected > 0 && (
                                  <>
                                    <button 
                                      onClick={() => handleRemoveStem(stem.id)}
                                      className="w-5 h-5 rounded-full border border-[#ece7e2] flex items-center justify-center hover:bg-[#563c37] hover:text-white hover:border-[#563c37] transition-colors text-xs text-[#563c37]"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="text-xs font-bold text-[#563c37] w-4 text-center">{quantitySelected}</span>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleAddStem(stem.id)}
                                  className="w-5 h-5 rounded-full border border-[#ece7e2] flex items-center justify-center hover:bg-[#563c37] hover:text-white hover:border-[#563c37] transition-colors text-xs text-[#563c37]"
                                  aria-label="Add stem"
                                >
                                  <Plus size={10} />
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
        <section className="lg:col-span-6 flex flex-col gap-6 items-center w-full">
          <div className="w-full bg-[#fcf9f6] rounded-[24px] border border-[#f0ebe4] p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col relative h-[600px] overflow-hidden">
            
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
            <div className="flex-grow flex items-center justify-center relative select-none">
              
              {/* Silhouette template inside center (renders when canvas has no stems) */}
              {selectedStems.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                  <svg width="240" height="240" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#563c37]">
                    <circle cx="50" cy="40" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="38" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="62" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="32" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <circle cx="68" cy="50" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <path d="M50 45 V 85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M42 46 L 25 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M58 46 L 75 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                </div>
              )}

              {/* Graphic bouquet viewer */}
              <div 
                className="relative flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel === 'zoomed' ? 1.25 : 1.0})`,
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                <div 
                  className="relative flex flex-col items-center justify-center w-[300px] h-[380px]"
                  style={{
                    transform: `rotate(${rotationDegree}deg)`,
                    transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                >
                  
                  {/* BOUQUET STYLES VISUALIZATIONS */}
                  {selectedStems.map((selection, idx) => {
                    const dbItem = STEMS_DATABASE.find(s => s.id === selection.stemId);
                    if (!dbItem || dbItem.category !== 'bouquet-styles') return null;

                    // Base design overlay depending on selected bouquet style structure
                    const isClassicDome = dbItem.id === 'classic-dome';
                    return (
                      <div 
                        key={selection.stemId}
                        className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-40`}
                      >
                        {isClassicDome ? (
                          // Semi-transparent classic dome grid guide
                          <svg width="240" height="240" viewBox="0 0 100 100" fill="none" className="text-[#8c5e5e]">
                            <path d="M10 50 A 40 40 0 0 1 90 50 Z" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
                            <path d="M20 50 A 30 30 0 0 1 80 50 Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" fill="none" />
                          </svg>
                        ) : (
                          // Spiral structure guides
                          <svg width="240" height="240" viewBox="0 0 100 100" fill="none" className="text-[#563c37]">
                            <path d="M50 50 C 40 30, 20 20, 10 15" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3"/>
                            <path d="M50 50 C 60 30, 80 20, 90 15" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3"/>
                            <path d="M50 50 C 35 40, 15 45, 5 40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3"/>
                            <path d="M50 50 C 65 40, 85 45, 95 40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3"/>
                          </svg>
                        )}
                      </div>
                    );
                  })}

                  {/* STEMS LAYERS */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="280" height="280" viewBox="0 0 100 100" className="overflow-visible">
                      
                      {/* Foliage Back-Layer (Emerald Fern or Eucalyptus back leaves) */}
                      {selectedStems.map((selection, idx) => {
                        const dbItem = STEMS_DATABASE.find(s => s.id === selection.stemId);
                        if (!dbItem || dbItem.category !== 'decorative-foliage') return null;

                        const stemsCount = selection.quantity;
                        const isFern = dbItem.id === 'emerald-fern';
                        const color = dbItem.color;

                        return Array.from({ length: Math.min(stemsCount * 2, 8) }).map((_, stemIdx) => {
                          const angle = ((stemIdx * 45) + (isFern ? 15 : 30)) * Math.PI / 180;
                          const length = 45;
                          const x2 = 50 + length * Math.sin(angle);
                          const y2 = 65 - length * Math.cos(angle);

                          return (
                            <g key={`${selection.stemId}-${stemIdx}`} className="opacity-80 transition-all duration-300">
                              {/* Branch line */}
                              <line x1="50" y1="65" x2={x2} y2={y2} stroke={color} strokeWidth="1.2" />
                              
                              {/* Foliage leaves */}
                              {isFern ? (
                                // Fern branching leaves
                                Array.from({ length: 6 }).map((_, leafIdx) => {
                                  const t = (leafIdx + 1) / 7;
                                  const leafX = 50 + (length * t) * Math.sin(angle);
                                  const leafY = 65 - (length * t) * Math.cos(angle);
                                  const rot = (angle * 180 / Math.PI);
                                  return (
                                    <path 
                                      key={leafIdx}
                                      d="M -1,-2 C -3,-1 -3,1 -1,2 C 1,2 3,1 3,-1 Z"
                                      transform={`translate(${leafX}, ${leafY}) rotate(${rot + 90}) scale(0.8)`}
                                      fill={color}
                                    />
                                  );
                                })
                              ) : (
                                // Eucalyptus round leaves
                                Array.from({ length: 4 }).map((_, leafIdx) => {
                                  const t = (leafIdx + 1) / 5;
                                  const leafX = 50 + (length * t) * Math.sin(angle);
                                  const leafY = 65 - (length * t) * Math.cos(angle);
                                  return (
                                    <circle 
                                      key={leafIdx}
                                      cx={leafX}
                                      cy={leafY}
                                      r="2.5"
                                      fill={color}
                                      stroke="#a4c4b6"
                                      strokeWidth="0.3"
                                    />
                                  );
                                })
                              )}
                            </g>
                          );
                        });
                      })}

                      {/* Main Flower Stems (Rose/Peony/Orchid stems pointing down) */}
                      {selectedStems.map((selection) => {
                        const dbItem = STEMS_DATABASE.find(s => s.id === selection.stemId);
                        if (!dbItem || dbItem.category !== 'premium-blooms') return null;

                        return Array.from({ length: selection.quantity }).map((_, fIdx) => {
                          const shift = ((fIdx - (selection.quantity - 1) / 2) * 12);
                          const x2 = 50 + shift;
                          const y2 = 25 + Math.abs(shift) * 0.4;
                          return (
                            <line 
                              key={`${selection.stemId}-${fIdx}`}
                              x1="50" 
                              y1="65" 
                              x2={x2} 
                              y2={y2} 
                              stroke="#6a8270" 
                              strokeWidth="1.5" 
                            />
                          );
                        });
                      })}
                    </svg>
                  </div>

                  {/* FLOWER HEADS (Rendered dynamically in absolute position layers above stems) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="280" height="280" viewBox="0 0 100 100" className="overflow-visible">
                      {selectedStems.map((selection) => {
                        const dbItem = STEMS_DATABASE.find(s => s.id === selection.stemId);
                        if (!dbItem || dbItem.category !== 'premium-blooms') return null;

                        const isRose = dbItem.id === 'crimson-rose';
                        const isPeony = dbItem.id === 'blushing-peony';
                        const isOrchid = dbItem.id === 'ethereal-orchid';
                        const color = dbItem.color;

                        return Array.from({ length: selection.quantity }).map((_, fIdx) => {
                          // Flower placement calculations: spiral layout based on index
                          const order = fIdx + 1;
                          const radius = order === 1 ? 0 : 18 + (order * 2.5);
                          const angle = (order * 115) * Math.PI / 180;
                          
                          const fx = 50 + radius * Math.cos(angle);
                          const fy = 42 + radius * Math.sin(angle);

                          return (
                            <g key={`${selection.stemId}-${fIdx}`} className="transition-all duration-500 scale-[1.1] hover:scale-[1.25]">
                              {isRose && (
                                // Crimson Rose detailed petal vector
                                <g transform={`translate(${fx}, ${fy})`}>
                                  <circle cx="0" cy="0" r="7.5" fill={color} />
                                  <path d="M-6,-2 C-7,-5 -4,-8 0,-8 C4,-8 7,-5 6,-2 C5,1 2,2 0,2 C-2,2 -5,1 -6,-2 Z" fill="#8f1b1b" />
                                  <path d="M-4,4 C-7,2 -7,-2 -4,-4 C-1,-6 4,-5 5,-2 C6,1 4,4 1,5 C-1,5 -3,5 -4,4 Z" fill="#751515" opacity="0.9" />
                                  <path d="M-3,-1 C-3,-3 -1,-4 1,-4 C3,-4 4,-2 3,0 C2,1 1,2 0,2 C-1,2 -2,1 -3,-1 Z" fill="#b83c3c" />
                                  <circle cx="0" cy="-0.5" r="1.5" fill="#e25c5c" />
                                </g>
                              )}
                              {isPeony && (
                                // Fluffy Blushing Peony
                                <g transform={`translate(${fx}, ${fy})`}>
                                  <circle cx="0" cy="0" r="9.5" fill={color} stroke="#fcdde1" strokeWidth="0.3" />
                                  {/* Ruffled peony petals */}
                                  {Array.from({ length: 8 }).map((_, petalIdx) => {
                                    const rot = petalIdx * 45;
                                    return (
                                      <path 
                                        key={petalIdx}
                                        d="M -3.5,-5.5 C -5.5,-3.5 -5.5,-0.5 -3.5,1.5 C -1.5,2.5 1.5,1.5 2.5,-0.5 C 3.5,-2.5 2.5,-5.5 0.5,-6.5 Z"
                                        transform={`rotate(${rot}) scale(0.85)`}
                                        fill={color}
                                        opacity="0.85"
                                        stroke="#f2bcc4"
                                        strokeWidth="0.2"
                                      />
                                    );
                                  })}
                                  <circle cx="0" cy="0" r="3.2" fill="#e89bb0" />
                                  <circle cx="0" cy="0" r="1.5" fill="#fbe3b5" />
                                </g>
                              )}
                              {isOrchid && (
                                // Ethereal Orchid
                                <g transform={`translate(${fx}, ${fy}) rotate(15)`}>
                                  {/* Back sepals */}
                                  <path d="M0,0 L-7,-7 C-9,-5 -9,-1 -6,2 Z" fill="#ffffff" stroke="#ecd7ec" strokeWidth="0.3" />
                                  <path d="M0,0 L7,-7 C9,-5 9,-1 6,2 Z" fill="#ffffff" stroke="#ecd7ec" strokeWidth="0.3" />
                                  <path d="M0,0 L0,9 C-3,11 3,11 0,9 Z" fill="#ffffff" stroke="#ecd7ec" strokeWidth="0.3" />
                                  {/* Wing petals */}
                                  <path d="M-1,-2 C-5,-5 -8,-2 -6,2 C-4,6 -1,4 -1,-2 Z" transform="rotate(-30)" fill={color} />
                                  <path d="M1,-2 C5,-5 8,-2 6,2 C4,6 1,4 1,-2 Z" transform="rotate(30)" fill={color} />
                                  {/* Orchid Lip/Center */}
                                  <path d="M-2.5,0 C-3.5,2.5 -1.5,5.5 0,5.5 C1.5,5.5 3.5,2.5 2.5,0 Z" fill="#c070c0" />
                                  <circle cx="0" cy="1.5" r="1.2" fill="#ffd700" />
                                </g>
                              )}
                            </g>
                          );
                        });
                      })}
                    </svg>
                  </div>

                  {/* VASE GRAPHIC AND WATER (Rendered on top so stems are inside the glass) */}
                  <div className="absolute bottom-6 flex flex-col items-center justify-center pointer-events-none">
                    <svg width="120" height="150" viewBox="0 0 100 125" className="overflow-visible">
                      <defs>
                        {/* Shimmer gradient for crystal vase */}
                        <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                          <stop offset="30%" stopColor="#eef7f9" stopOpacity="0.35"/>
                          <stop offset="70%" stopColor="#d5edf1" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#a8d3da" stopOpacity="0.75"/>
                        </linearGradient>
                        <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#a5dce4" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="#78c9d4" stopOpacity="0.35"/>
                        </linearGradient>
                      </defs>

                      {/* Water Level */}
                      <path 
                        d="M 22,62 C 22,62 30,65 50,65 C 70,65 78,62 78,62 L 72,112 C 72,112 65,116 50,116 C 35,116 28,112 28,112 Z" 
                        fill="url(#water-grad)"
                      />

                      {/* Stems inside the water (refraction overlay) */}
                      {selectedStems.length > 0 && (
                        <g opacity="0.45" stroke="#485c4d" strokeWidth="1.8" strokeLinecap="round">
                          <line x1="45" y1="63" x2="40" y2="105" />
                          <line x1="53" y1="63" x2="58" y2="108" />
                          <line x1="50" y1="63" x2="49" y2="112" />
                        </g>
                      )}

                      {/* Vase Body */}
                      <path 
                        d="M 28,32 C 28,32 35,36 50,36 C 65,36 72,32 72,32 L 78,60 C 82,78 74,115 72,116 C 70,117 65,120 50,120 C 35,120 30,117 28,116 C 26,115 18,78 22,60 Z" 
                        fill="url(#glass-grad)" 
                        stroke="#ffffff" 
                        strokeWidth="1.2"
                      />

                      {/* Vase Neck Highlights */}
                      <ellipse cx="50" cy="34" rx="21" ry="3.5" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
                      <ellipse cx="50" cy="34" rx="15" ry="2" fill="none" stroke="#a3d5dd" strokeWidth="0.5" opacity="0.5" />

                      {/* Reflections and Shines */}
                      <path d="M 25,62 Q 22,85 32,110" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                      <path d="M 75,62 Q 78,85 68,110" fill="none" stroke="#a3d5dd" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                      <path d="M 45,117 Q 50,119 55,117" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />

                      {/* WRAPPING & ACCENTS LAYER ON VASE */}
                      {selectedStems.map((selection) => {
                        const dbItem = STEMS_DATABASE.find(s => s.id === selection.stemId);
                        if (!dbItem || dbItem.category !== 'wrapping-accents') return null;

                        const isRibbon = dbItem.id === 'velvet-ribbon';
                        const color = dbItem.color;

                        return (
                          <g key={selection.stemId} className="transition-all duration-300">
                            {isRibbon ? (
                              // Bow Ribbon on Neck
                              <g transform="translate(50, 48)">
                                <ellipse cx="0" cy="0" rx="14" ry="3.5" fill={color} stroke="#ffffff" strokeWidth="0.3" />
                                {/* Bow wings */}
                                <path d="M0,0 C -8,-6 -14,-4 -12,2 C -10,6 -4,2 0,0 Z" fill={color} stroke="#3b1b1b" strokeWidth="0.3" />
                                <path d="M0,0 C 8,-6 14,-4 12,2 C 10,6 4,2 0,0 Z" fill={color} stroke="#3b1b1b" strokeWidth="0.3" />
                                {/* Ribbon Tails */}
                                <path d="M-2,0 L -8,18 L -3,18 Z" fill={color} />
                                <path d="M2,0 L 8,18 L 3,18 Z" fill={color} />
                                <circle cx="0" cy="0" r="3" fill="#8f4545" />
                              </g>
                            ) : (
                              // Wrapping paper envelope at the lower half
                              <path 
                                d="M 12,65 L 28,124 L 50,128 L 72,124 L 88,65 C 88,65 50,75 12,65 Z" 
                                fill={color} 
                                opacity="0.85" 
                                stroke="#b09572" 
                                strokeWidth="0.5"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                </div>
              </div>

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
        <section className="lg:col-span-3 flex flex-col gap-6 self-stretch">
          
          {/* Main summary card */}
          <div className="bg-white rounded-[24px] border border-[#f0ebe4] p-6 shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col gap-6 flex-grow">
            <div>
              <h2 className="text-[26px] font-bold text-[#563c37] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
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
