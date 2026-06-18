import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Star, Heart } from 'lucide-react';
import { products } from '../../data/products';

const CategoryPage = () => {
  const { slug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  // Load wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('redshan360_wishlist');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('redshan360_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
  };

  // Sync wishlist from other pages
  useEffect(() => {
    const handleWishlistUpdated = () => {
      const saved = localStorage.getItem('redshan360_wishlist');
      setWishlist(saved ? JSON.parse(saved) : {});
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdated);
  }, []);

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
          title: 'Head Dresses',
          tagline: 'MAJESTIC GRACE',
          description: 'Delicate floral accessories, headpieces, and crowns for weddings and special collections.'
        };
      case 'wedding-collections':
        return {
          title: 'Wedding Collections',
          tagline: 'OPULENT BLOOMS',
          description: 'Grand centerpieces and majestic floral sets curated specifically for your dream day.'
        };
      case 'individual-flowers':
        return {
          title: 'Individual Flowers',
          tagline: 'EXOTIC ALLURE',
          description: 'Premium single-stem floral masterpieces tailored for bespoke vases and minimalist spaces.'
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

  // Filter products belonging to selected category and subcategory
  const filteredProducts = products.filter((product) => {
    switch (slug) {
      case 'bouquets':
        if (product.type !== 'bouquet') return false;
        if (activeSubcategory) {
          return product.subcategory === activeSubcategory;
        }
        return true;
      case 'head-dresses':
        return (product.category === 'dried' || product.type === 'arrangement') && product.type !== 'single-stem';
      case 'wedding-collections':
        return (product.category === 'velvet' || product.type === 'centerpiece') && product.type !== 'single-stem';
      case 'individual-flowers':
        return product.type === 'single-stem';
      default:
        return false;
    }
  });

  const handleAddToCart = (product) => {
    const savedCart = localStorage.getItem('redshan360_cart');
    const cartList = savedCart ? JSON.parse(savedCart) : [];

    // Use default color of product if available
    const defaultColor = product.colors?.[0]?.name || 'Default';
    
    // Check if item already exists with the same color
    const existingItemIndex = cartList.findIndex(
      (item) => item.id === product.id && item.selectedColor === defaultColor
    );

    if (existingItemIndex > -1) {
      cartList[existingItemIndex].quantity += 1;
    } else {
      cartList.push({
        id: product.id,
        title: product.title,
        price: product.price,
        numericPrice: product.numericPrice,
        image: product.image,
        selectedColor: defaultColor,
        quantity: 1,
      });
    }

    localStorage.setItem('redshan360_cart', JSON.stringify(cartList));
    window.dispatchEvent(new Event('cart-updated'));
    window.dispatchEvent(new Event('open-cart'));
  };

  const subcategories = [
    { name: 'Anniversary', value: 'anniversary', image: '/images/cat_roses.png', tag: 'CELEBRATE LOVE' },
    { name: 'Birthday', value: 'birthday', image: '/images/cat_peonies.png', tag: 'CHEERFUL BLOOMS' },
    { name: 'Convocation', value: 'convocation', image: '/images/about_hero.png', tag: 'SUCCESS & HONOR' }
  ];

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
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-[120px] pb-20">

        {/* Breadcrumb */}
        {slug === 'bouquets' ? (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span className="text-[#1a1a1a]/30">&gt;</span>
            <span className="text-[#8c5e5e]">Bouquets</span>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
            <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8c5e5e]">{categoryDetails.title}</span>
          </nav>
        )}

        {/* Category Banner */}
        {slug === 'bouquets' ? (
          <div className="relative rounded-sm overflow-hidden mb-12 min-h-[320px] flex items-center shadow-sm border border-[#d9d2d0]/20 bg-cover bg-center text-left" style={{ backgroundImage: "url('/images/hero_bouquet.png')" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#1a1a1a]/55 backdrop-blur-[1px]" />
            {/* Banner Content */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f5e6e8] font-bold mb-3">
                {categoryDetails.tagline}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {categoryDetails.title}
              </h1>
              <p className="text-sm text-white/95 leading-relaxed font-light mb-6">
                {categoryDetails.description}
              </p>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/85 bg-white/10 backdrop-blur-sm rounded-full py-1 px-4 inline-block">
                Showing {filteredProducts.length} premium arrangements
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
              Showing {filteredProducts.length} premium arrangements
            </p>
          </div>
        )}

        {/* Bouquet Subcategories Section */}
        {slug === 'bouquets' && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-6 text-left">
              Shop Bouquet Subcategory
            </h2>
            
            {/* Desktop and Tablet grid, Mobile scrollable flex row */}
            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0">
              {subcategories.map((sub, idx) => {
                const isActive = activeSubcategory === sub.value;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSubcategory(isActive ? null : sub.value)}
                    className={`group relative flex-shrink-0 w-[240px] sm:w-auto aspect-[16/10] rounded-sm overflow-hidden shadow-sm cursor-pointer transition-all duration-300 border-2 ${
                      isActive ? 'border-[#8c5e5e] ring-2 ring-[#8c5e5e]/20' : 'border-transparent hover:border-[#8c5e5e]/40'
                    }`}
                  >
                    <img 
                      src={sub.image} 
                      alt={sub.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-colors duration-300" />
                    
                    {/* Active State Overlay Indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-[#8c5e5e]/20 backdrop-blur-[0.5px] transition-colors" />
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <h4 className="text-lg md:text-xl text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {sub.name}
                      </h4>
                      <p className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-white/90 font-medium mt-0.5">
                        {sub.tag}
                      </p>
                    </div>

                    {/* Tiny badge indicating selection */}
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-[#8c5e5e] text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-sm">
                        SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Helper/Indicator for scrollability */}
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
        {filteredProducts.length === 0 ? (
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
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col font-sans relative">
                {/* Product Image Container */}
                <div className="relative overflow-hidden bg-[#f4f0ed] rounded-sm aspect-[3/4] mb-4 border border-[#d9d2d0]/15 shadow-sm">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
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
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white flex items-center justify-center transition-colors duration-300 z-10"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      size={16}
                      className={`transition-colors duration-300 ${wishlist[product.id]
                        ? 'fill-[#8c5e5e] text-[#8c5e5e]'
                        : 'text-[#1a1a1a]/75 hover:text-[#8c5e5e]'
                        }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-start gap-2 mb-1">
                  <Link to={`/product/${product.id}`} className="hover:text-[#8c5e5e] transition-colors min-w-0">
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
