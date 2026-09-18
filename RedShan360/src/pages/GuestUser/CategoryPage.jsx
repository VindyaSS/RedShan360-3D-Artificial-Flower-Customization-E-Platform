import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Star, Heart } from 'lucide-react';
import { products } from '../../data/products';
import api, { cartApi } from '../../services/api';
import { getProductImageUrl } from '../../utils/imageHelper';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  // Wishlist state loaded from database
  const [wishlist, setWishlist] = useState({});

  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in CategoryPage:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  const fetchWishlist = async () => {
    if (userId) {
      try {
        const response = await api.get(`/api/wishlist/user/${userId}`);
        const wishlistMap = {};
        response.data.forEach((item) => {
          wishlistMap[item.productId] = item.wishlistId;
        });
        setWishlist(wishlistMap);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const toggleWishlist = async (id) => {
    if (!userId) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }

    const wishlistId = wishlist[id];

    if (wishlistId) {
      // Remove from database
      try {
        await api.delete(`/api/wishlist/${wishlistId}`);
        setWishlist((prev) => {
          const updated = { ...prev };
          delete updated[id];
          window.dispatchEvent(new Event('wishlist-updated'));
          return updated;
        });
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Add to database
      try {
        const response = await api.post('/api/wishlist', {
          userId,
          productId: id
        });
        const newWishlistId = response.data.data.wishlistId;
        setWishlist((prev) => {
          const updated = { ...prev, [id]: newWishlistId };
          window.dispatchEvent(new Event('wishlist-updated'));
          return updated;
        });
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  // Sync wishlist from other pages
  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdated);
  }, [userId]);

  // Reset subcategory when page category slug changes
  useEffect(() => {
    setActiveSubcategory(null);
  }, [slug]);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Resolve category display details
  const getCategoryDetails = (categorySlug) => {
    switch (categorySlug) {
      case 'bouquets':
        return {
          title: 'Bouquets Collection',
          tagline: 'THE ETERNAL MUSE',
          description: 'Meticulously crafted silk & velvet arrangements designed to stand the test of time.'
        };
      case 'head-dresses':
        return {
          title: 'Head Dresse Collection',
          tagline: 'MAJESTIC GRACE',
          description: 'Discover handcrafted artificial flower head dresses designed for weddings, birthdays, and special occasions.'
        };
      case 'wedding-collections':
        return {
          title: 'Wedding Collections',
          tagline: 'OPULENT BLOOMS',
          description: 'Grand centerpieces and majestic floral sets curated specifically for your dream day.'
        };
      case 'individual-flowers':
        return {
          title: 'Individual Flowers Collection',
          tagline: 'EXOTIC ALLURE',
          description: 'Explore our collection of handcrafted artificial flowers designed for birthdays, anniversaries, graduations, and special occasions.'
        };
      default:
        return {
          title: 'Botanical Collection',
          tagline: 'CURATED LUXURY',
          description: 'Explore our hyper-realistic, hand-crafted premium artificial floral collections.'
        };
    }
  };

  const categoryDetails = getCategoryDetails(slug);

  const [dbProducts, setDbProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch real category products from backend API
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoadingProducts(true);
      const categoryIdMap = {
        'bouquets': 1,
        'head-dresses': 2,
        'individual-flowers': 3
      };
      const catId = categoryIdMap[slug];

      try {
        let endpoint = '/api/products';
        if (catId) {
          endpoint = `/api/products/category/${catId}`;
        }
        const response = await api.get(endpoint);
        let fetchedItems = response.data || [];

        // Filter by active subcategory if selected
        if (activeSubcategory) {
          fetchedItems = fetchedItems.filter((p) => {
            const subName = (p.subCategoryName || '').toLowerCase();
            return subName.includes(activeSubcategory.toLowerCase());
          });
        }

        const mapped = fetchedItems.map((p) => {
          const numPrice = Number(p.price) || 0;
          return {
            productId: p.productId,
            id: p.productId,
            title: p.productName || 'Unnamed Arrangement',
            productName: p.productName || 'Unnamed Arrangement',
            subtitle: p.subCategoryName ? `${p.categoryName || ''} • ${p.subCategoryName}` : (p.categoryName || ''),
            price: `Rs ${numPrice.toFixed(2)}`,
            numericPrice: numPrice,
            rating: 4.8,
            reviewCount: 15,
            imageUrl: p.imageUrl,
            image: getProductImageUrl(p.imageUrl),
            stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 10,
            categoryName: p.categoryName || '',
            subCategoryName: p.subCategoryName || ''
          };
        });

        setDbProducts(mapped);
      } catch (err) {
        console.error('Error fetching category products from backend:', err);
        setDbProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, activeSubcategory]);

  const displayProducts = dbProducts;

  const handleAddToCart = async (product) => {
    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage in CategoryPage handleAddToCart:', e);
      }
    }
    if (!currentUser) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }

    const defaultColor = 'Default';
    try {
      await cartApi.addToCart(product.productId, 1, defaultColor);
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart'));
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  const getSubcategories = (categorySlug) => {
    if (categorySlug === 'bouquets') {
      return [
        { name: 'Anniversary', value: 'anniversary', image: '/images/cat_roses.png', tag: 'CELEBRATE LOVE' },
        { name: 'Birthday', value: 'birthday', image: '/images/cat_peonies.png', tag: 'CHEERFUL BLOOMS' },
        { name: 'Convocation', value: 'convocation', image: '/images/con3.png', tag: 'SUCCESS & HONOR' }
      ];
    } else if (categorySlug === 'head-dresses') {
      return [
        { name: 'Weddings', value: 'wedding', image: '/images/cat_headdress_wedding.png', tag: 'BRIDAL MAJESTY' },
        { name: 'Birthday', value: 'birthday', image: '/images/cat_headdress_birthday.png', tag: 'CELEBRATE GRACE' }
      ];
    } else if (categorySlug === 'individual-flowers') {
      return [
        { name: 'Convocation', value: 'convocation', image: '/images/cat_individual_convocation.png', tag: 'ACADEMIC PRIDE' },
        { name: 'Anniversary', value: 'anniversary', image: '/images/cat_individual_anniversary.png', tag: 'ETERNAL DEVOTION' },
        { name: 'Birthday', value: 'birthday', image: '/images/cat_individual_birthday.png', tag: 'CELEBRATE LIFE' }
      ];
    }
    return [];
  };

  const subcategories = getSubcategories(slug);

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a]" style={{ fontFamily: 'Inter, Montserrat, sans-serif' }}>
      {/* Navbar */}
      <Navbar
        isScrolled={true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-20">

        {/* Breadcrumb */}
        {slug === 'bouquets' ? (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span className="text-[#1a1a1a]/30">&gt;</span>
            <span className="text-[#8c5e5e]">Bouquets</span>
          </nav>
        ) : slug === 'head-dresses' ? (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span className="text-[#1a1a1a]/30">&gt;</span>
            <span className="text-[#8c5e5e]">Head Dresses</span>
          </nav>
        ) : slug === 'individual-flowers' ? (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span className="text-[#1a1a1a]/30">&gt;</span>
            <span className="text-[#8c5e5e]">Individual Flowers</span>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8c5e5e]">{categoryDetails.title}</span>
          </nav>
        )}

        {/* Category Banner */}
        {(slug === 'bouquets' || slug === 'head-dresses' || slug === 'individual-flowers') ? (
          <div className="relative rounded-sm overflow-hidden mb-12 min-h-[480px] flex items-center shadow-sm border border-[#d9d2d0]/20 bg-[#170e0d] bg-cover bg-center md:bg-contain md:bg-right md:bg-no-repeat text-left" style={{ backgroundImage: slug === 'bouquets' ? "url('/images/luxury_bouquets_banner.png')" : slug === 'head-dresses' ? "url('/images/luxury_headdress_banner.png')" : "url('/images/3flowers.png')" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#170e0d]/60 md:bg-transparent md:bg-gradient-to-r md:from-[#170e0d] md:via-[#170e0d]/90 md:to-transparent backdrop-blur-[0.5px]" />
            {/* Banner Content */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f5e6e8] font-bold mb-3">
                {categoryDetails.tagline}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                {categoryDetails.title}
              </h1>
              <p className="text-sm text-white/95 leading-relaxed font-light mb-6">
                {categoryDetails.description}
              </p>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/85 bg-white/10 backdrop-blur-sm rounded-full py-1 px-4 inline-block">
                Showing {displayProducts.length} premium arrangements
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-8 border-b border-[#d9d2d0]/30 text-left mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2">
              {categoryDetails.tagline}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {categoryDetails.title}
            </h1>
            <p className="text-sm text-[#1a1a1a]/70 mt-3 max-w-2xl leading-relaxed">
              {categoryDetails.description}
            </p>
            <p className="text-xs font-semibold text-[#1a1a1a]/55 mt-4">
              Showing {displayProducts.length} premium arrangements
            </p>
          </div>
        )}

        {/* Subcategories Section */}
        {(slug === 'bouquets' || slug === 'head-dresses' || slug === 'individual-flowers') && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-6 text-left">
              Shop {slug === 'bouquets' ? 'Bouquet' : slug === 'head-dresses' ? 'Head Dress' : 'Individual Flower'} Subcategory
            </h2>

            {/* Desktop and Tablet grid, Mobile scrollable flex row */}
            <div className="flex flex-wrap justify-center gap-6">
              {subcategories.map((sub, idx) => {
                const isActive = activeSubcategory === sub.value;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSubcategory(isActive ? null : sub.value)}
                    className={`w-[180px] h-[52px] rounded-full border-[1.5px] flex items-center justify-center font-poppins font-semibold text-base transition-all duration-300
                      ${isActive
                        ? 'bg-[#6A8F72] text-white font-bold shadow-[0_4px_6px_rgba(0,0,0,0.08)] transform scale-105'
                        : 'bg-[#EAF4EC] border-[#C7D9CC] text-[#2F3E34] hover:bg-[#D7EBD9] hover:border-[#8FB89A] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] hover:-translate-y-1'}
                    `}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
            <div className="flex sm:hidden justify-between items-center text-[10px] text-[#1a1a1a]/40 mt-2">
              <span>← Swipe to view categories →</span>
              {activeSubcategory && (
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className="text-[#8c5e5e] font-semibold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtered Product Grid */}
        {loadingProducts ? (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#8c5e5e]/30 border-t-[#8c5e5e] rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Arrangements...</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#faf8f6] rounded-sm border border-[#d9d2d0]/10 mt-8">
            <Heart size={40} className="mx-auto text-[#1a1a1a]/20 mb-3" />
            <p className="text-sm font-medium text-[#1a1a1a]/55">
              No arrangements found in this category.
            </p>
            <Link
              to="/shop"
              className="mt-4 px-5 py-2.5 rounded-sm bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 inline-block"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {displayProducts.map((product) => (
              <div key={product.productId} className="group flex flex-col font-sans relative">
                {/* Product Image Container */}
                <div className="relative overflow-hidden bg-[#f4f0ed] rounded-sm aspect-[3/4] mb-4 border border-[#d9d2d0]/15 shadow-sm">
                  <Link to={`/product/${product.productId}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.productId);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white flex items-center justify-center transition-colors duration-300 z-10"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      size={16}
                      className={`transition-colors duration-300 ${wishlist[product.productId]
                        ? 'fill-[#8c5e5e] text-[#8c5e5e]'
                        : 'text-[#1a1a1a]/75 hover:text-[#8c5e5e]'
                        }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-start gap-2 mb-1">
                  <Link to={`/product/${product.productId}`} className="hover:text-[#8c5e5e] transition-colors min-w-0">
                    <h3 className="font-semibold text-[15px] text-[#1a1a1a] tracking-tight leading-snug truncate group-hover:text-[#8c5e5e] transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#1a1a1a]/80 shrink-0">
                    <Star size={12} className="fill-[#8c5e5e] text-[#8c5e5e]" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#1a1a1a]/50 mb-2">
                  {product.subtitle}
                </p>

                {/* Price & Add to Cart Button Container */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#d9d2d0]/20">
                  <p className="text-sm font-bold text-[#8c5e5e]">
                    {product.price}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-3 py-1.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all duration-300 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryPage;
