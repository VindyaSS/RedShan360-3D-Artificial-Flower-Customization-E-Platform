import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import LoginModal from './LoginModal';
import LoginRequiredModal from './LoginRequiredModal';
import api, { cartApi } from '../../../services/api';
import { getProductImage } from '../../../utils/imageHelper';
import MyOrdersModal from './MyOrdersModal';

const Navbar = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, navItems, onWishlistClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);

  // Dynamic state
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dbProductsList, setDbProductsList] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  // Synchronize cart and wishlist counts
  const updateCounts = async () => {
    let standardCount = 0;

    // Read standard products from backend if user is logged in
    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user in Navbar:', e);
      }
    }

    if (currentUser) {
      try {
        const response = await cartApi.getCart();
        standardCount = response.data.totalItems || 0;
      } catch (error) {
        console.error('Error fetching standard cart count:', error);
      }
    }

    // Read custom bouquets from localStorage
    let customCount = 0;
    const savedCart = localStorage.getItem('redshan360_cart');
    if (savedCart) {
      try {
        const cartList = JSON.parse(savedCart);
        // Only keep custom bouquet items in local storage
        const customItems = cartList.filter((item) => item.isCustom);
        customCount = customItems.reduce((acc, item) => acc + item.quantity, 0);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }

    setCartCount(standardCount + customCount);

    // Wishlist Count from database if logged in
    const savedUserWL = localStorage.getItem('user');
    let user = null;
    if (savedUserWL && savedUserWL !== 'undefined' && savedUserWL !== 'null') {
      try {
        user = JSON.parse(savedUserWL);
      } catch (e) {
        console.error('Failed to parse user in Navbar:', e);
      }
    }
    const userId = user ? (user.id || user.userId) : null;

    if (userId) {
      try {
        const response = await api.get(`/api/wishlist/count/${userId}`);
        setWishlistCount(response.data.count);
      } catch (error) {
        console.error('Error fetching wishlist count:', error);
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateCounts();

    const handleOpenCart = () => {
      const savedUser = localStorage.getItem('user');
      let currentUser = null;
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          currentUser = JSON.parse(savedUser);
        } catch (e) {
          console.error(e);
        }
      }
      if (currentUser) {
        setIsCartOpen(true);
      } else {
        setIsLoginRequiredOpen(true);
      }
    };

    const handleShowLoginRequired = () => {
      setIsLoginRequiredOpen(true);
    };

    // Listen to custom events from details/shop pages
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('auth-updated', updateCounts);
    window.addEventListener('open-cart', handleOpenCart);
    window.addEventListener('show-login-required', handleShowLoginRequired);

    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('auth-updated', updateCounts);
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('show-login-required', handleShowLoginRequired);
    };
  }, []);

  // Load products list from backend for search autocomplete
  useEffect(() => {
    const loadSearchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const dbProducts = response.data || [];
        const mapped = dbProducts.map((p) => ({
          id: p.productId,
          productId: p.productId,
          title: p.productName || 'Unnamed Arrangement',
          subtitle: p.categoryName || '',
          description: p.description || '',
          image: getProductImage(p),
          price: `Rs ${(Number(p.price) || 0).toFixed(2)}`
        }));
        setDbProductsList(mapped);
      } catch (err) {
        console.error('Failed to fetch products for Navbar search:', err);
      }
    };
    loadSearchProducts();
  }, []);

  // Handle autocomplete search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = dbProductsList.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit results to 5 items

    setSearchResults(filtered);
  }, [searchQuery, dbProductsList]);

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

  // Body scroll lock effect for mobile menu (preserves and restores original overflow)
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Click outside listener for profile dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileProfileDropdownRef.current && !mobileProfileDropdownRef.current.contains(event.target)) {
        setIsMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event('auth-updated'));
    navigate('/login');
  };

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
    if (lowerItem === 'about') return '/about';
    if (lowerItem === 'contact') return '/contact';
    return `/guestUserDashboard#${lowerItem}`;
  };

  const handleNavClick = (item, e) => {
    if (item.toLowerCase() === 'customization') {
      const savedUser = localStorage.getItem('user');
      let currentUser = null;
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          currentUser = JSON.parse(savedUser);
        } catch (e) {
          console.error(e);
        }
      }
      if (!currentUser) {
        e.preventDefault();
        setIsLoginRequiredOpen(true);
        setMobileMenuOpen(false);
        return;
      }
    }
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
    <>
      <nav
        className={`fixed top-0 w-full z-50 h-[80px] flex items-center transition-all duration-300 ${isScrolled ? 'bg-[#faf8f6]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full h-full flex items-center">
          <div className="flex justify-between items-center w-full h-full gap-4">
            <Link to="/guestUserDashboard" className="flex-shrink-0 flex items-center">
              <h1 className="text-[24px] md:text-[26px] font-bold tracking-tight text-[#1a1a1a] font-playfair leading-none">
                Redshan Flora
              </h1>
            </Link>

            {/* Desktop Nav Links (lg breakpoint: >=1024px) */}
            <div className="hidden lg:flex items-center gap-8 h-full">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={getRoute(item)}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 relative py-1 flex items-center leading-none ${isActive(item)
                    ? 'text-[#8c5e5e] after:content-[\'\'] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#8c5e5e]'
                    : 'text-[#1a1a1a]/75 hover:text-[#8c5e5e]'
                    }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop Search & Icons (lg breakpoint: >=1024px) */}
            <div className="hidden lg:flex items-center gap-3 h-full">

              {/* Desktop Search Icon Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#f4f0ed] text-[#1a1a1a] hover:text-[#8c5e5e] hover:scale-110 transition-all duration-300 relative group"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Favorite / Wishlist Badge Button */}
              <button
                onClick={() => {
                  const savedUser = localStorage.getItem('user');
                  let currentUser = null;
                  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                    try {
                      currentUser = JSON.parse(savedUser);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  if (currentUser) {
                    navigate('/wishlist');
                  } else {
                    setIsLoginRequiredOpen(true);
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
                onClick={() => {
                  const savedUser = localStorage.getItem('user');
                  let currentUser = null;
                  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                    try {
                      currentUser = JSON.parse(savedUser);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  if (currentUser) {
                    setIsCartOpen(true);
                  } else {
                    setIsLoginRequiredOpen(true);
                  }
                }}
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
              <div ref={profileDropdownRef} className="relative">
                <button
                  onClick={() => {
                    const savedUser = localStorage.getItem('user');
                    let currentUser = null;
                    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                      try {
                        currentUser = JSON.parse(savedUser);
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    if (currentUser) {
                      setIsProfileOpen(!isProfileOpen);
                    } else {
                      setIsLoginOpen(true);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors duration-300 ${isProfileOpen ? 'bg-[#f4f0ed]' : 'hover:bg-[#f4f0ed]'
                    }`}
                  aria-label="person"
                >
                  <User size={18} className="text-[#1a1a1a] hover:scale-110 transition-transform duration-200" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-sm shadow-xl z-50 py-1.5 text-left animate-fade-in text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/85 font-sans" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMyOrdersOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f4f0ed] hover:text-[#8c5e5e] transition-colors duration-200"
                    >
                      My Orders
                    </button>
                    <div className="border-t border-[#d9d2d0]/30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/loyalty-points');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f4f0ed] hover:text-[#8c5e5e] transition-colors duration-200"
                    >
                      Loyalty Points
                    </button>
                    <div className="border-t border-[#d9d2d0]/30 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-[#f4f0ed] text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet Triggers (<1024px) */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300 text-[#1a1a1a]"
                aria-label="Search"
              >
                <Search size={20} className="hover:scale-110 transition-transform duration-200" />
              </button>

              <button
                onClick={() => {
                  const savedUser = localStorage.getItem('user');
                  let currentUser = null;
                  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                    try {
                      currentUser = JSON.parse(savedUser);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  if (currentUser) {
                    setIsCartOpen(true);
                  } else {
                    setIsLoginRequiredOpen(true);
                  }
                }}
                className="relative p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300 text-[#1a1a1a]"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full transition-colors duration-300 text-[#1a1a1a] hover:bg-[#f4f0ed]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Backdrop Overlay (<1024px) */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 top-[80px] bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          />
        )}

        {/* Mobile Navigation Drawer Panel (<1024px) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-[80px] left-0 w-full bg-[#faf8f6] border-t border-[#d9d2d0]/40 shadow-2xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto py-5 px-6 animate-slide-down text-left">
            {/* Nav Items */}
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={getRoute(item)}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`block text-sm uppercase tracking-widest font-semibold py-1 transition-colors ${isActive(item) ? 'text-[#8c5e5e]' : 'text-[#1a1a1a] hover:text-[#8c5e5e]'
                    }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cart side drawer overlay */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Search Modal Overlay */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Login Modal Overlay */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

        {/* Login Required Modal Overlay */}
        <LoginRequiredModal isOpen={isLoginRequiredOpen} onClose={() => setIsLoginRequiredOpen(false)} />

        {/* My Orders Modal Overlay */}
        <MyOrdersModal isOpen={isMyOrdersOpen} onClose={() => setIsMyOrdersOpen(false)} />
      </nav>
      {/* Reusable structural spacer to ensure page content starts below the fixed navbar */}
      <div className="h-[80px] w-full shrink-0" />
    </>
  );
};

export default Navbar;
