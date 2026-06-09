import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Star, Heart } from 'lucide-react';
import { products as initialProducts } from '../../data/products';


const Shop = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Wishlist state loaded from localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('redshan360_wishlist');
    return saved ? JSON.parse(saved) : {};
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [showWishlistOnly, setShowWishlistOnly] = useState(() => {
    return searchParams.get('wishlist') === 'true';
  });

  // Listen to url param ?wishlist=true and clean up
  useEffect(() => {
    if (searchParams.get('wishlist') === 'true') {
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);


  // Filter States
  const [selectedCategories, setSelectedCategories] = useState({
    silk: true,
    velvet: false,
    dried: false,
    vases: false
  });
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');

  // Page title / styling scroll effect listener
  const [isScrolled, setIsScrolled] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      // Keep solid navbar, but could dynamically adapt if needed
      setIsScrolled(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  const [productsState, setProductsState] = useState(initialProducts);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('redshan360_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
  };

  const handleCategoryChange = (key) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearAll = () => {
    setSelectedCategories({
      silk: false,
      velvet: false,
      dried: false,
      vases: false
    });
    setSelectedColor(null);
    setPriceRange(1000);
    setSelectedProductType(null);
  };

  const colors = [
    { id: 'pink', hex: '#e8b4b8', label: 'Pink' },
    { id: 'white', hex: '#ffffff', label: 'White', border: true },
    { id: 'burgundy', hex: '#6b3b3b', label: 'Burgundy' },
    { id: 'yellow', hex: '#fcebb6', label: 'Pale Yellow' },
    { id: 'grey', hex: '#c7b1a9', label: 'Greyish Pink' }
  ];

  const productTypes = [
    { id: 'bouquet', label: 'Bouquet' },
    { id: 'single-stem', label: 'Single Stem' },
    { id: 'arrangement', label: 'Arrangement' },
    { id: 'centerpiece', label: 'Centerpiece' }
  ];

  // Filter and Sort Logic
  const filteredProducts = initialProducts.filter((product) => {
    if (showWishlistOnly && !wishlist[product.id]) {
      return false;
    }
    const activeCategories = Object.keys(selectedCategories).filter(
      (key) => selectedCategories[key]
    );
    if (activeCategories.length > 0) {
      if (!selectedCategories[product.category]) {
        return false;
      }
    }
    if (selectedColor && product.color !== selectedColor) {
      return false;
    }
    if (product.numericPrice > priceRange) {
      return false;
    }
    if (selectedProductType && product.type !== selectedProductType) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.numericPrice - b.numericPrice;
    }
    if (sortBy === 'price-high') {
      return b.numericPrice - a.numericPrice;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return b.rating - a.rating; // default: popularity/rating desc
  });

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a]" style={{ fontFamily: 'Inter, Montserrat, sans-serif' }}>
      {/* Navbar - solid state on shop page */}
      <Navbar
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
        onWishlistClick={() => setShowWishlistOnly((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-[120px] pb-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Column */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="flex justify-between items-center pb-4 border-b border-[#d9d2d0]/50 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Filters
              </h2>
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-[#1a1a1a]/60 hover:text-[#8c5e5e] transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-4">
                Category
              </h3>
              <div className="space-y-3 font-sans">
                {[
                  { key: 'silk', label: 'Silk Collections' },
                  { key: 'velvet', label: 'Velvet Petals' },
                  { key: 'dried', label: 'Dried Everlastings' },
                  { key: 'vases', label: 'Artisanal Vases' }
                ].map((cat) => (
                  <label key={cat.key} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#1a1a1a]/80">
                    <input
                      type="checkbox"
                      checked={selectedCategories[cat.key]}
                      onChange={() => handleCategoryChange(cat.key)}
                      className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flower Color Filter */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-4">
                Flower Color
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(selectedColor === color.id ? null : color.id)}
                    className={`w-7 h-7 rounded-full transition-transform duration-200 relative ${selectedColor === color.id ? 'scale-110 ring-2 ring-[#8c5e5e] ring-offset-2' : 'hover:scale-105'
                      } ${color.border ? 'border border-[#d9d2d0]' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Filter by ${color.label}`}
                  />
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-4">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-[#eae6e3] rounded-lg appearance-none cursor-pointer accent-[#8c5e5e] focus:outline-none"
              />
              <div className="flex justify-between items-center text-xs font-semibold text-[#1a1a1a]/60 mt-2">
                <span>Rs500</span>
                <span>Rs50000+</span>
              </div>
              <div className="text-xs text-[#8c5e5e] font-semibold mt-1.5 text-center">
                Max Price: Rs{priceRange === 500 ? '5,0000+' : priceRange}
              </div>
            </div>

            {/* Product Type Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-[0.15em] font-bold text-[#1a1a1a]/55 mb-4">
                Product Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {productTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedProductType(selectedProductType === type.id ? null : type.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${selectedProductType === type.id
                      ? 'bg-[#8c5e5e] text-white'
                      : 'bg-[#f4f0ed] text-[#1a1a1a]/70 hover:bg-[#eae6e3]'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Column */}
          <main className="flex-1">

            {/* Header / Info Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 border-b border-[#d9d2d0]/30">
              <div>
                {showWishlistOnly && (
                  <button
                    onClick={() => setShowWishlistOnly(false)}
                    className="text-xs text-[#8c5e5e] hover:underline font-semibold mb-2 block"
                  >
                    &larr; Back to All Arrangements
                  </button>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {showWishlistOnly ? 'My Wishlist' : 'Botanical Collection'}
                </h1>
                <p className="text-xs font-medium text-[#1a1a1a]/60 mt-1 font-sans">
                  Showing {sortedProducts.length} of {showWishlistOnly ? Object.values(wishlist).filter(Boolean).length : initialProducts.length} {showWishlistOnly ? 'wishlisted' : 'premium'} arrangements
                </p>
              </div>

              <div className="flex items-center gap-2.5 font-sans">
                <span className="text-xs font-semibold text-[#1a1a1a]/60">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-[#8c5e5e] outline-none cursor-pointer border-b border-transparent hover:border-[#8c5e5e] pb-0.5 transition-all"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid / Wishlist Empty Placeholder */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-luxury-cream/50 rounded-sm border border-[#d9d2d0]/10 mt-8">
                <Heart size={40} className="mx-auto text-[#1a1a1a]/20 mb-3" />
                <p className="text-sm font-medium text-[#1a1a1a]/55">
                  {showWishlistOnly ? 'Your wishlist is empty.' : 'No arrangements match your filter criteria.'}
                </p>
                {showWishlistOnly ? (
                  <button
                    onClick={() => setShowWishlistOnly(false)}
                    className="mt-4 px-5 py-2.5 rounded-sm bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-medium text-xs tracking-wider uppercase transition-all duration-300"
                  >
                    Explore Arrangements
                  </button>
                ) : (
                  <button
                    onClick={handleClearAll}
                    className="mt-4 px-5 py-2.5 rounded-sm bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-medium text-xs tracking-wider uppercase transition-all duration-300"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-8">
                {sortedProducts.map((product) => (
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

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-16 font-sans">
                {/*<button className="w-9 h-9 rounded-full border border-[#d9d2d0]/60 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors" aria-label="Previous page">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-[#7d4d50] text-white flex items-center justify-center font-semibold text-sm">
                  1
                </button>
                <button className="w-9 h-9 rounded-full border border-[#d9d2d0]/60 text-[#1a1a1a]/70 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors font-semibold text-sm">
                  2
                </button>
                <button className="w-9 h-9 rounded-full border border-[#d9d2d0]/60 text-[#1a1a1a]/70 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors font-semibold text-sm">
                  3
                </button>
                <span className="text-[#1a1a1a]/40 text-xs px-1">...</span>
                <button className="w-9 h-9 rounded-full border border-[#d9d2d0]/60 text-[#1a1a1a]/70 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors font-semibold text-sm">
                  8
                </button>
                <button className="w-9 h-9 rounded-full border border-[#d9d2d0]/60 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors" aria-label="Next page">
                  <ChevronRight size={16} />
                </button>*/}
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;
