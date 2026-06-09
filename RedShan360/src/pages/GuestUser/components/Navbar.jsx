import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { products } from '../../../data/products';
import CartDrawer from './CartDrawer';

const Navbar = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, navItems, onWishlistClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);

  // Dynamic state
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize cart and wishlist counts
  const updateCounts = () => {
    // Cart Count
    const savedCart = localStorage.getItem('redshan360_cart');
    if (savedCart) {
      const cartList = JSON.parse(savedCart);
      // Filter out cart items that do not correspond to active products
      const validItems = cartList.filter((item) => item.isCustom || products.some((p) => p.id === item.id));
      const count = validItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }

    // Wishlist Count
    const savedWishlist = localStorage.getItem('redshan360_wishlist');
    if (savedWishlist) {
      const wishlistObj = JSON.parse(savedWishlist);
      // Only count wishlisted items that correspond to valid active product IDs
      const count = Object.keys(wishlistObj).filter(
        (key) => wishlistObj[key] === true && products.some((p) => p.id === Number(key))
      ).length;
      setWishlistCount(count);
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateCounts();

    const handleOpenCart = () => setIsCartOpen(true);

    // Listen to custom events from details/shop pages
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('open-cart', handleOpenCart);

    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  // Handle autocomplete search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit results to 5 items

    setSearchResults(filtered);
  }, [searchQuery]);

  // Click outside listener for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (productId) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/product/${productId}`);
  };

  // Nav Item route resolver
  const getRoute = (item) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem === 'home') return '/guestUserDashboard';
    if (lowerItem === 'shop') return '/shop';
    if (lowerItem === 'customization') return '/customization';
    return `/guestUserDashboard#${lowerItem}`;
  };

  const handleNavClick = (item, e) => {
    const route = getRoute(item);
    if (route.startsWith('/guestUserDashboard#')) {
      // If we are already on home page, scroll to element
      if (location.pathname === '/' || location.pathname === '/guestUserDashboard') {
        e.preventDefault();
        const elementId = route.split('#')[1];
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (item) => {
    const route = getRoute(item);
    if (route === '/guestUserDashboard' && (location.pathname === '/' || location.pathname === '/guestUserDashboard')) {
      return true;
    }
    return location.pathname === route;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-[80px] transition-all duration-300 ${
        isScrolled ? 'bg-[#faf8f6]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-[80px] gap-4">
          <Link to="/guestUserDashboard" className="flex-shrink-0">
            <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight text-[#1a1a1a] font-playfair">
              RedShan<span className="text-[#8c5e5e] italic font-normal">360</span>
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item}
                to={getRoute(item)}
                onClick={(e) => handleNavClick(item, e)}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 relative py-1.5 ${
                  isActive(item)
                    ? 'text-[#8c5e5e] after:content-[\'\'] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-[1.5px] after:bg-[#8c5e5e]'
                    : 'text-[#1a1a1a]/75 hover:text-[#8c5e5e]'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop Search & Icons */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Search Input Container */}
            <div ref={searchContainerRef} className="relative">
              <div className="flex items-center gap-2 bg-[#f4f0ed] rounded-sm px-4 py-2 w-60 border border-[#1a1a1a]/5 focus-within:border-[#8c5e5e]/30 transition-all duration-300">
                <Search size={14} className="text-[#1a1a1a]/60" />
                <input
                  type="text"
                  placeholder="Search arrangements..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full bg-transparent outline-none text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/45 font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#1a1a1a]/40 hover:text-[#8c5e5e] transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Autocomplete Search Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-[#fcf9f8] border border-[#d9d2d0]/50 rounded-sm shadow-xl z-50 py-2 max-h-96 overflow-y-auto animate-fade-in text-left">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#1a1a1a]/40 px-4 py-1.5 border-b border-[#d9d2d0]/20 mb-1">
                    Search Results
                  </p>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchResultClick(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f4f0ed] transition-colors duration-200 text-left"
                    >
                      <img
                        src={product.image}
                        alt=""
                        className="w-10 h-12 object-cover rounded-sm bg-luxury-beige flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1a1a1a] truncate">{product.title}</p>
                        <p className="text-[10px] text-[#1a1a1a]/50 truncate">{product.subtitle}</p>
                        <p className="text-xs font-bold text-[#8c5e5e] mt-0.5">{product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite / Wishlist Badge Button */}
            <button
              onClick={() => {
                if (onWishlistClick) {
                  onWishlistClick();
                } else {
                  navigate('/shop?wishlist=true');
                }
              }}
              className="p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300 relative"
              aria-label="Wishlist"
            >
              <Heart size={18} className="text-[#1a1a1a]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center px-1 animate-scale-up">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Badge Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300" 
              aria-label="shopping_cart"
            >
              <ShoppingCart size={18} className="text-[#1a1a1a]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button className="p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300" aria-label="person">
              <User size={18} className="text-[#1a1a1a]" />
            </button>
          </div>

          {/* Hamburger Menu Trigger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="transition-colors duration-300 text-[#1a1a1a]" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-4 bg-[#faf8f6] border-t border-gray-100 px-4 text-left">
            {navItems.map((item) => (
              <Link
                key={item}
                to={getRoute(item)}
                onClick={(e) => handleNavClick(item, e)}
                className={`block text-sm uppercase tracking-widest font-semibold ${
                  isActive(item) ? 'text-[#8c5e5e]' : 'text-[#1a1a1a] hover:text-[#8c5e5e]'
                }`}
              >
                {item}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/shop');
                }}
                className="p-2 rounded-full bg-[#f4f0ed]" 
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/shop?wishlist=true');
                }}
                className="p-2 rounded-full bg-[#f4f0ed] relative" 
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="relative p-2 rounded-full bg-[#f4f0ed]" 
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button className="p-2 rounded-full bg-[#f4f0ed]" aria-label="Profile">
                <User size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart side drawer overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
