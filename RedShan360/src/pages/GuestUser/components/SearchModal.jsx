import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import { getProductImage } from '../../../utils/imageHelper';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [productsList, setProductsList] = useState([]);

  // Fetch real database products whenever modal opens
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const dbProducts = response.data || [];
        const mapped = dbProducts.map((p) => {
          const numPrice = Number(p.price) || 0;
          return {
            id: p.productId,
            productId: p.productId,
            title: p.productName || 'Unnamed Arrangement',
            subtitle: p.categoryName || '',
            category: p.categoryName || 'Bouquet',
            price: `Rs ${numPrice.toFixed(2)}`,
            numericPrice: numPrice,
            image: getProductImage(p),
            description: p.description || ''
          };
        });
        setProductsList(mapped);
      } catch (err) {
        console.error('Failed to fetch products for search modal:', err);
      }
    };
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // 300ms Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Manage rendering, scroll locks, and inputs on open/close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      
      // 1. Clear previous search text and suggestions
      setInputValue('');
      setSearchTerm('');
      
      // 2. Lock body scrolling
      document.body.style.overflow = 'hidden';
      
      // 3. Reset scroll position to top and autofocus input
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else if (shouldRender) {
      // 4. Trigger close scale and fade transitions
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        // Restore body scrolling
        document.body.style.overflow = '';
      }, 200); // 200ms transition delay

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, shouldRender]);

  // Make sure body scrolling is restored on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Popular searches (first 9 products for clean 3x3 layout)
  const popularProducts = productsList.slice(0, 9);

  // Search filter logic
  const filteredResults = productsList.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const subtitleMatch = product.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || subtitleMatch || categoryMatch || descMatch;
  });

  // Handle click on overlay outside popup container
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Click handler for product items
  const handleItemClick = (id) => {
    setInputValue('');
    setSearchTerm('');
    onClose();
    // Force scroll restore instantly when clicking a product
    document.body.style.overflow = '';
    navigate(`/product/${id}`);
  };

  // Highlight matching keyword
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={index} className="bg-[#8c5e5e]/15 text-[#8c5e5e] font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (!shouldRender) return null;

  // React Portal: render directly inside document.body to bypass relative container transforms
  return createPortal(
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 transition-opacity duration-200 ease-in-out ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered Modal Container */}
      <div
        ref={modalRef}
        className={`bg-[#fcf9f8] w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-[90%] md:max-w-[750px] lg:max-w-[800px] rounded-none sm:rounded-2xl border border-[#d9d2d0]/30 shadow-2xl p-6 sm:p-8 flex flex-col justify-start relative overflow-hidden text-left transition-all duration-200 ease-in-out ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ boxSizing: 'border-box' }}
      >
        {/* Elegant Floral Watermark Background */}
        <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-[#8c5e5e]/5 pointer-events-none select-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C50 0 35 25 35 50C35 75 50 100 50 100C50 100 65 75 65 50C65 25 50 0 50 0ZM50 10C55 28 60 48 50 90C40 48 45 28 50 10Z" />
            <path d="M50 30C40 40 20 45 10 50C25 55 40 60 50 70C50 70 45 55 45 50C45 45 50 30 50 30Z" opacity="0.6" />
            <path d="M50 30C60 40 80 45 90 50C75 55 60 60 50 70C50 70 55 55 55 50C55 45 50 30 50 30Z" opacity="0.6" />
          </svg>
        </div>

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#8c5e5e]" />
            <span className="text-[10px] tracking-[0.25em] font-bold text-[#8c5e5e] uppercase">
              Curated Botanical Finder
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f4f0ed] text-[#1a1a1a]/65 hover:text-[#8c5e5e] transition-all"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative mb-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3.5 border-b-2 border-[#d9d2d0]/65 focus-within:border-[#8c5e5e] transition-colors duration-300 pb-2">
            <Search size={20} className="text-[#1a1a1a]/45" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search bouquets, flowers, head dresses..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  onClose();
                  document.body.style.overflow = '';
                  navigate(`/shop?search=${encodeURIComponent(inputValue.trim())}`);
                }
              }}
              className="w-full bg-transparent outline-none text-base md:text-lg font-playfair text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 tracking-wide"
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="text-xs text-[#1a1a1a]/45 hover:text-[#8c5e5e] transition-colors uppercase font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-1 z-10 custom-scrollbar"
        >
          
          {/* A. Popular Searches (default state when input is empty) */}
          {!inputValue.trim() ? (
            <div className="pb-4">
              <h4 className="text-[11px] uppercase tracking-widest font-black text-[#1a1a1a]/50 mb-5 flex items-center gap-1.5">
                Popular Searches
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {popularProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleItemClick(product.id)}
                    className="group bg-white border border-[#d9d2d0]/25 rounded-xl p-3 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container with scale zoom */}
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#f4f0ed] mb-3 relative border border-[#d9d2d0]/10">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-[#f5e6e8] text-[#8c5e5e] text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full shadow-xs">
                          Popular
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-[#1a1a1a] leading-snug group-hover:text-[#8c5e5e] transition-colors truncate font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {product.title}
                      </h5>
                      <p className="text-[9px] font-semibold text-[#1a1a1a]/40 uppercase mt-0.5 tracking-wider">
                        {product.category}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#d9d2d0]/15 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#8c5e5e] font-mono">
                        {product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : /* B. Live Search Results (filtering state) */
          filteredResults.length > 0 ? (
            <div className="space-y-3 pb-4">
              <h4 className="text-[11px] uppercase tracking-widest font-black text-[#1a1a1a]/50 mb-4">
                Found {filteredResults.length} Matching {filteredResults.length === 1 ? 'Arrangement' : 'Arrangements'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredResults.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleItemClick(product.id)}
                    className="group flex bg-white border border-[#d9d2d0]/25 rounded-xl p-3.5 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer items-stretch gap-4 animate-fade-in-stagger relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-[#f4f0ed] rounded-lg overflow-hidden border border-[#d9d2d0]/15 shadow-xs shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 text-left">
                      <div>
                        <h5 className="font-bold text-sm text-[#1a1a1a] truncate leading-tight group-hover:text-[#8c5e5e] transition-colors font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {highlightText(product.title, searchTerm)}
                        </h5>
                        <p className="text-[10px] font-semibold text-[#1a1a1a]/40 uppercase mt-0.5 tracking-wider">
                          Category: <span className="text-[#1a1a1a]/65 font-bold">{product.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-[#8c5e5e] font-mono">
                          {product.price}
                        </span>
                        
                        {/* Discount Badge if available */}
                        {product.discountPercent && (
                          <span className="bg-red-50 text-red-500 font-bold text-[8px] tracking-widest px-1.5 py-0.5 rounded-sm">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* C. Empty Search Results */
            <div className="text-center py-16 bg-[#faf8f6] rounded-xl border border-[#d9d2d0]/15 max-w-md mx-auto my-4 shadow-xs">
              <AlertCircle size={36} className="mx-auto text-[#1a1a1a]/20 mb-3" />
              <h5 className="font-bold text-sm text-[#1a1a1a] mb-1 font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                No flowers found
              </h5>
              <p className="text-xs text-[#1a1a1a]/45 mb-6 max-w-[250px] mx-auto leading-relaxed">
                We couldn't find any arrangements matching "{searchTerm}". Try exploring other terms.
              </p>
              <button
                onClick={() => {
                  setInputValue('');
                  setSearchTerm('');
                  onClose();
                  // Force restore body scrolling
                  document.body.style.overflow = '';
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-semibold text-[10px] tracking-wider uppercase rounded-sm shadow-sm transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;
