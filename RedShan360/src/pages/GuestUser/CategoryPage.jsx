import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Star, Heart } from 'lucide-react';
import { products } from '../../data/products';

const CategoryPage = () => {
  const { slug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Resolve category display details
  const getCategoryDetails = (categorySlug) => {
    switch (categorySlug) {
      case 'bouquets':
        return {
          title: 'Bouquets',
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

  // Filter products belonging to selected category
  const filteredProducts = products.filter((product) => {
    switch (slug) {
      case 'bouquets':
        return product.type === 'bouquet';
      case 'head-dresses':
        return product.category === 'dried' || product.type === 'arrangement';
      case 'wedding-collections':
        return product.category === 'velvet' || product.type === 'centerpiece';
      case 'individual-flowers':
        return product.type === 'single-stem';
      default:
        return false;
    }
  });

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
        <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-8 uppercase text-left">
          <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#8c5e5e]">{categoryDetails.title}</span>
        </nav>

        {/* Category Banner */}
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

                <p className="text-sm font-bold text-[#8c5e5e] mt-auto">
                  {product.price}
                </p>
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
