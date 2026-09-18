/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { arrangeBouquet, relaxOverlaps } from '../../components/bouquet/LayoutEngine';
import { BOUQUET_SIZE_CONFIG } from '../../components/bouquet/sizeConfig';
import { getPriceBreakdown } from '../../components/bouquet/PriceEngine';
import BouquetCanvas from '../../components/bouquet/BouquetCanvas';
import CartDrawer from '../GuestUser/components/CartDrawer';
import Navbar from '../GuestUser/components/Navbar';
import { BOUQUET_STYLE_OPTIONS, BOUQUET_STYLE_CONFIG } from '../../components/bouquet/bouquetStyleConfig';

import {
  Search,
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
  Truck,
  ArrowRight,
  Sparkles,
  Shuffle
} from 'lucide-react';

// Predefined stems database with rich details and local/system images
const generateCustomBouquetId = () => 'custom-' + Date.now();

const FIXED_CUSTOMIZATION_OPTIONS = [
  {
    id: 'spiral-handtied',
    name: 'Hand-tied Spiral Style',
    category: 'bouquet-styles',
    price: 4500.00,
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#bfa38a',
    description: 'European spiral binding styling structure'
  },
  {
    id: 'classic-dome',
    name: 'Classic Dome Style',
    category: 'bouquet-styles',
    price: 3000.00,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#dfcfbe',
    description: 'Traditional symmetric rounded arrangement structure'
  },
  {
    id: 'silver-eucalyptus',
    name: 'Silver Dollar Eucalyptus',
    category: 'decorative-foliage',
    price: 2400.00,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#8da89d',
    description: 'Sage green rounded coin leaves'
  },
  {
    id: 'emerald-fern',
    name: 'Emerald Fern Leaf',
    category: 'decorative-foliage',
    price: 1800.00,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#5c8774',
    description: 'Delicate branching feathery deep green fern'
  },
  {
    id: 'velvet-ribbon',
    name: 'Velvet Burgundy Ribbon',
    category: 'wrapping-accents',
    price: 2100.00,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#5c2c2c',
    description: 'Plush velvet ribbon around the vase neck'
  },
  {
    id: 'kraft-paper',
    name: 'Light Red Wrapping Paper',
    category: 'wrapping-accents',
    price: 1200.00,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#e27b7b',
    description: 'Soft romantic light red tissue wrap'
  },
  {
    id: 'luxury-mesh',
    name: 'White Wrapping Paper',
    category: 'wrapping-accents',
    price: 1800.00,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=150&h=150&q=80',
    color: '#ffffff',
    description: 'Elegant minimalist matte white wrap'
  }
];

// Centralized occasion mapping
const OCCASION_SUBCATEGORY_MAP = {
  ANNIVERSARY: 7,
  BIRTHDAY: 8,
  CONVOCATION: 9
};

const OCCASION_OPTIONS = [
  { key: 'ANNIVERSARY', label: 'Anniversary' },
  { key: 'BIRTHDAY', label: 'Birthday' },
  { key: 'CONVOCATION', label: 'Convocation' }
];

export default function BoquetCustomization() {
  // Page states
  const [selectedStems, setSelectedStems] = useState([]); // Array of { stemId, quantity }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('ANNIVERSARY');
  const [bouquetSize, setBouquetSize] = useState('MEDIUM');
  const [bouquetStyle, setBouquetStyle] = useState('ROUND');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic products states
  const [backendFlowers, setBackendFlowers] = useState([]);
  const [loadingFlowers, setLoadingFlowers] = useState(true);
  const [flowersError, setFlowersError] = useState(null);

  const stemsDatabase = useMemo(() => {
    return [...backendFlowers, ...FIXED_CUSTOMIZATION_OPTIONS];
  }, [backendFlowers]);

  const activeSizeConfig = useMemo(() => {
    return BOUQUET_SIZE_CONFIG[bouquetSize];
  }, [bouquetSize]);

  const currentFlowerCount = useMemo(() => {
    return selectedStems.reduce((sum, item) => {
      const dbItem = stemsDatabase.find(s => String(s.id) === String(item.stemId));
      if (dbItem && dbItem.category === 'premium-blooms') {
        return sum + item.quantity;
      }
      return sum;
    }, 0);
  }, [selectedStems, stemsDatabase]);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Fetch individual flowers on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchStems = async () => {
      setLoadingFlowers(true);
      setFlowersError(null);
      try {
        const response = await api.get('/api/products', { signal: controller.signal });
        const data = response.data || [];
        
        // Filter by category_id === 3
        const filtered = data.filter(p => {
          const categoryId = p.categoryId !== undefined ? p.categoryId : p.category_id;
          return Number(categoryId) === 3;
        });

        // Map to frontend structure
        const mapped = filtered.map(p => {
          const productId = p.productId !== undefined ? p.productId : p.product_id;
          const productName = p.productName !== undefined ? p.productName : p.product_name;
          const imageUrl = p.imageUrl !== undefined ? p.imageUrl : p.image_url;
          const modelUrl = p.modelUrl !== undefined ? p.modelUrl : p.model_url;
          const stockQuantity = p.stockQuantity !== undefined ? p.stockQuantity : p.stock_quantity;
          const subCategoryId = p.subCategoryId !== undefined ? p.subCategoryId : p.sub_category_id;
          const categoryId = p.categoryId !== undefined ? p.categoryId : p.category_id;

          return {
            id: String(productId),
            productId: Number(productId),
            name: productName || 'Unnamed Flower',
            category: 'premium-blooms',
            categoryId: Number(categoryId),
            subCategoryId: subCategoryId ? Number(subCategoryId) : null,
            price: Number(p.price) || 1500.00,
            stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
            image: imageUrl || '/images/product-placeholder.png',
            modelUrl: modelUrl || null,
            description: p.description || ""
          };
        });

        if (isMounted) {
          setBackendFlowers(mapped);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && isMounted) {
          console.error('Error fetching stems:', err);
          setFlowersError('Failed to load botanicals. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoadingFlowers(false);
        }
      }
    };

    fetchStems();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      return relaxOverlaps(updated, stemsDatabase, 10, activeSizeConfig);
    });
  };

  // Compute selected options from selectedStems array
  const selectedStyle = useMemo(() => {
    const hasSpiral = selectedStems.some(s => s.stemId === 'spiral-handtied');
    return hasSpiral ? 'spiral-handtied' : 'classic-dome';
  }, [selectedStems]);

  const wrappingId = useMemo(() => {
    const wrap = selectedStems.find(s => {
      const dbItem = stemsDatabase.find(item => String(item.id) === String(s.stemId));
      return dbItem?.category === 'wrapping-accents' && s.stemId !== 'velvet-ribbon';
    });
    return wrap ? wrap.stemId : null;
  }, [selectedStems, stemsDatabase]);

  const ribbonId = useMemo(() => {
    const hasRibbon = selectedStems.some(s => s.stemId === 'velvet-ribbon');
    return hasRibbon ? 'velvet-ribbon' : null;
  }, [selectedStems]);

  // Sync selectedStems quantities to 3D individual flowers array
  useEffect(() => {
    setFlowers((prevFlowers) => {
      let updatedFlowers = [...prevFlowers];

      // Filter out non-flower selections from stems database (exclude styles/ribbons/wraps)
      const validStems = selectedStems.filter(s => {
        const dbItem = stemsDatabase.find(item => String(item.id) === String(s.stemId));
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
        }
      });

      // 3. Clear non-selected items from state
      const validStemIds = validStems.map(s => s.stemId);
      updatedFlowers = updatedFlowers.filter(f => validStemIds.includes(f.stemId));

      // Always arrange coordinates to apply scaled size config parameters (radius, height, spacing) correctly
      return arrangeBouquet(updatedFlowers, {
        bindingStyle: selectedStyle,
        stemsDatabase,
        sizeConfig: activeSizeConfig,
        bouquetStyle
      });
    });
  }, [selectedStems, selectedStyle, stemsDatabase, activeSizeConfig, bouquetStyle]);

  // Check if selected occasion has any database flowers
  const hasOccasionFlowers = useMemo(() => {
    const selectedSubCategoryId = OCCASION_SUBCATEGORY_MAP[selectedOccasion];
    return stemsDatabase.some(flower => 
      flower.category === 'premium-blooms' &&
      flower.subCategoryId !== null &&
      flower.subCategoryId !== undefined &&
      !isNaN(Number(flower.subCategoryId)) &&
      Number(flower.subCategoryId) === selectedSubCategoryId
    );
  }, [stemsDatabase, selectedOccasion]);

  // Search and filter stems
  const filteredStems = useMemo(() => {
    const selectedSubCategoryId = OCCASION_SUBCATEGORY_MAP[selectedOccasion];
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return stemsDatabase.filter(flower => {
      // 1. Search query filtering (applies to all stems)
      const flowerName = String(flower.name ?? '').toLowerCase();
      const flowerDescription = String(flower.description ?? '').toLowerCase();

      const matchesSearch =
        flowerName.includes(normalizedSearch) ||
        flowerDescription.includes(normalizedSearch);
      if (!matchesSearch) return false;

      // 2. Occasion filtering (applies ONLY to premium-blooms category)
      if (flower.category === 'premium-blooms') {
        if (flower.subCategoryId === null || flower.subCategoryId === undefined || isNaN(Number(flower.subCategoryId))) {
          return false;
        }
        return Number(flower.subCategoryId) === selectedSubCategoryId;
      }

      // 3. Other categories bypass occasion filtering
      return true;
    });
  }, [stemsDatabase, selectedOccasion, searchQuery]);

  // Toggle category expand/collapse
  const toggleCategory = (categoryKey) => {
    setActiveCategory(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const handleSizeChange = (newSizeKey) => {
    if (newSizeKey === bouquetSize) return;

    const targetConfig = BOUQUET_SIZE_CONFIG[newSizeKey];
    if (currentFlowerCount > targetConfig.maxFlowers) {
      const excess = currentFlowerCount - targetConfig.maxFlowers;
      triggerToast(
        `${targetConfig.label} supports up to ${targetConfig.maxFlowers} flowers. Remove ${excess} flower${excess > 1 ? 's' : ''} before selecting this size.`
      );
      return;
    }

    setBouquetSize(newSizeKey);
    triggerToast(`Bouquet size updated to ${targetConfig.label}`);
  };

  // Add a stem to the customizer selection
  const handleAddStem = (stemId) => {
    const dbItem = stemsDatabase.find(s => String(s.id) === String(stemId));
    const isFlower = dbItem && dbItem.category === 'premium-blooms';

    if (isFlower) {
      const maxFlowers = activeSizeConfig.maxFlowers;
      if (currentFlowerCount >= maxFlowers) {
        triggerToast(`Limit reached: ${activeSizeConfig.label} size supports up to ${maxFlowers} flowers.`);
        return;
      }
    }

    setSelectedStems(prev => {
      const existing = prev.find(item => String(item.stemId) === String(stemId));
      if (existing) {
        return prev.map(item =>
          String(item.stemId) === String(stemId) ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { stemId, quantity: 1 }];
      }
    });
  };

  // Remove or decrement a stem from the selection
  const handleRemoveStem = (stemId) => {
    setSelectedStems(prev => {
      const existing = prev.find(item => String(item.stemId) === String(stemId));
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(item =>
          String(item.stemId) === String(stemId) ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => String(item.stemId) !== String(stemId));
      }
    });
  };

  // Complete removal of a stem category
  const handleClearStem = (stemId) => {
    setSelectedStems(prev => prev.filter(item => String(item.stemId) !== String(stemId)));
  };

  const handleSelectWrapping = (id) => {
    setSelectedStems(prev => {
      const wrappingIds = ['kraft-paper', 'luxury-mesh'];
      const filtered = prev.filter(item => !wrappingIds.includes(item.stemId));

      const isAlreadySelected = prev.some(item => item.stemId === id);
      if (isAlreadySelected) {
        return filtered;
      }
      return [...filtered, { stemId: id, quantity: 1 }];
    });
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
    const customBouquetId = generateCustomBouquetId();

    // Map selected stems to descriptive names
    const selectedStemsDetails = selectedStems
      .map(item => {
        const dbItem = stemsDatabase.find(s => String(s.id) === String(item.stemId));
        return dbItem ? `${item.quantity}x ${dbItem.name}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const customBouquetItem = {
      id: customBouquetId,
      isCustom: true,
      title: 'Custom Bouquet Arrangement',
      price: 'Rs. ' + priceBreakdown.grandTotal.toFixed(2),
      numericPrice: priceBreakdown.grandTotal,
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
        bouquetStyle: bouquetStyle,
        wrappingId,
        ribbonId,
        sizeKey: bouquetSize,
        sizeLabel: activeSizeConfig.label,
        maxFlowers: activeSizeConfig.maxFlowers,
        radiusMultiplier: activeSizeConfig.radiusMultiplier,
        heightMultiplier: activeSizeConfig.heightMultiplier,
        spacingMultiplier: activeSizeConfig.spacingMultiplier,
        priceMultiplier: activeSizeConfig.priceMultiplier,
        priceBreakdown: {
          flowerSubtotal: priceBreakdown.flowerSubtotal,
          sizeMultiplier: priceBreakdown.sizeMultiplier,
          sizeAdjustment: priceBreakdown.sizeAdjustment,
          scaledFlowerTotal: priceBreakdown.scaledFlowerTotal,
          serviceCharge: priceBreakdown.serviceCharge,
          grandTotal: priceBreakdown.grandTotal
        }
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
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const priceBreakdown = useMemo(() => {
    return getPriceBreakdown(selectedStems, stemsDatabase, bouquetSize, activeSizeConfig);
  }, [selectedStems, stemsDatabase, bouquetSize, activeSizeConfig]);

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    const absVal = Math.abs(num).toFixed(2);
    return num < 0 ? `-Rs. ${absVal}` : `Rs. ${absVal}`;
  };

  // Map category tags for rendering
  const categoriesList = [
    { key: 'premium-blooms', label: 'PREMIUM BLOOMS' }
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

      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        navItems={navItems} 
      />

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

          {/* Bouquet Size Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-[#563c37]/60">
              Bouquet Size
            </span>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(BOUQUET_SIZE_CONFIG).map((sizeKey) => {
                const config = BOUQUET_SIZE_CONFIG[sizeKey];
                const isActive = bouquetSize === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    type="button"
                    onClick={() => handleSizeChange(sizeKey)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? 'bg-[#563c37] text-white border-[#563c37] shadow-sm'
                        : 'bg-[#fdfbf9]/40 border-[#ece7e2] text-[#563c37] hover:border-[#8c5e5e]/30'
                    }`}
                  >
                    <span className="text-xs font-bold">{config.label}</span>
                    <span className={`text-[9px] mt-0.5 ${isActive ? 'text-white/70' : 'text-[#563c37]/50'}`}>
                      Up to {config.maxFlowers} flowers
                    </span>
                    <span className={`text-[9px] mt-0.5 font-semibold ${isActive ? 'text-white/80' : 'text-[#8c5e5e]'}`}>
                      {config.priceMultiplier}x price
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion Selection Buttons */}
          <div className="flex gap-2 p-1 bg-[#fdfbf9] border border-[#ece7e2] rounded-xl">
            {OCCASION_OPTIONS.map((option) => {
              const isActive = selectedOccasion === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => setSelectedOccasion(option.key)}
                  className={`flex-1 text-[10px] font-bold py-2 px-1 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-[#563c37] text-white shadow-sm'
                      : 'text-[#563c37]/60 hover:text-[#563c37] hover:bg-[#f5efeb]/40'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
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

          {loadingFlowers ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#563c37]/60">
              <div className="w-8 h-8 border-3 border-[#563c37]/20 border-t-[#8c5e5e] rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-semibold uppercase tracking-wider">Curation Loading...</p>
            </div>
          ) : flowersError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-red-500/80 px-4">
              <p className="text-xs font-semibold">{flowersError}</p>
            </div>
          ) : (
            /* Categories list accordion */
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
                        !hasOccasionFlowers ? (
                          <p className="text-[11px] text-[#563c37]/60 italic py-1">No flowers are available for this occasion.</p>
                        ) : (
                          <p className="text-[11px] text-[#563c37]/60 italic py-1">No flowers match your search.</p>
                        )
                      ) : (
                        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1.5 scroll-smooth custom-scrollbar">
                          {categoryStems.map((stem) => {
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
                                    +Rs {stem.price.toFixed(2)}
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
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
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
                stemsDatabase={stemsDatabase}
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
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isSwapMode
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
                    const dbItem = stemsDatabase.find(s => String(s.id) === String(item.stemId));
                    if (!dbItem) return null;

                    return (
                      <div key={item.stemId} className="flex justify-between items-center py-2 border-b border-[#fdfbf9] last:border-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#563c37] truncate">{dbItem.name}</h4>
                          <span className="text-[10px] text-[#563c37]/55 uppercase tracking-wide">
                            {item.quantity} × Rs {dbItem.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#563c37]">
                            Rs {(dbItem.price * item.quantity).toFixed(2)}
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
                <span>FLOWER SUBTOTAL</span>
                <span className="text-[#563c37]">{formatCurrency(priceBreakdown.flowerSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>BOUQUET SIZE</span>
                <span className="text-[#563c37] uppercase">{priceBreakdown.sizeLabel} ({priceBreakdown.sizeMultiplier}X)</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>SIZE ADJUSTMENT</span>
                <span className="text-[#563c37]">{formatCurrency(priceBreakdown.sizeAdjustment)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>ADJUSTED FLOWER TOTAL</span>
                <span className="text-[#563c37]">{formatCurrency(priceBreakdown.scaledFlowerTotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#563c37]/65">
                <span>SERVICE CHARGE</span>
                <span className="text-[#563c37]">{formatCurrency(priceBreakdown.serviceCharge)}</span>
              </div>

              <div className="border-t border-[#fdfbf9] my-1" />

              {/* Total price */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#563c37]/50 block mb-0.5">
                    Estimated Total
                  </span>
                  <span className="text-3xl font-extrabold text-[#563c37] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {formatCurrency(priceBreakdown.grandTotal)}
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