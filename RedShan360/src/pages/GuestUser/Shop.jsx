import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Star, Heart, Eye, ShoppingCart, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Check, Info, AlertCircle, X } from 'lucide-react';
import api, { cartApi } from '../../services/api';

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Products and states
  const [productsState, setProductsState] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [dbSubCategories, setDbSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in Shop:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  // Fetch Wishlist
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

  // Sync wishlist updates from other pages
  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdated);
  }, [userId]);

  // Fetch master filter categories and subcategories from backend
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/subcategories')
        ]);
        setDbCategories(categoriesRes.data);
        setDbSubCategories(subcategoriesRes.data);
      } catch (error) {
        console.error('Error loading filter options from backend:', error);
        setError('Failed to load filter options. Please try again later.');
      }
    };
    loadFilters();
  }, []);

  // Fetch products according to active filters from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/api/products';

        const activeCat = dbCategories.find(c => c.categoryName === selectedCategories[0]);
        const activeSub = dbSubCategories.find(s => 
          s.subCategoryName === selectedSubcategories[0] && 
          (!activeCat || s.categoryId === activeCat.id)
        );

        if (activeCat && activeSub) {
          endpoint = `/api/products/category/${activeCat.id}/subcategory/${activeSub.id}`;
        } else if (activeCat) {
          endpoint = `/api/products/category/${activeCat.id}`;
        } else if (activeSub) {
          endpoint = `/api/products/subcategory/${activeSub.id}`;
        }

        const response = await api.get(endpoint);
        const dbProducts = response.data;

        const mapped = dbProducts.map((p) => {
          const numPrice = Number(p.price) || 0;
          const discountPct = Number(p.discountPercentage) || 0;
          let discPriceVal = null;
          if (discountPct > 0) {
            discPriceVal = numPrice * (1 - discountPct / 100);
          }

          const productCategory = dbCategories.find(c => c.id === p.categoryId);
          const productSubCategory = dbSubCategories.find(s => s.id === p.subCategoryId);

          return {
            id: p.productId,
            productId: p.productId,
            title: p.productName || 'Unnamed Arrangement',
            description: p.description || '',
            price: `Rs ${numPrice.toFixed(2)}`,
            numericPrice: numPrice,
            discountPercentage: discountPct,
            discountPrice: discPriceVal ? `Rs ${discPriceVal.toFixed(2)}` : null,
            discountNumericPrice: discPriceVal,
            stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 100,
            imageUrl: p.imageUrl || '/images/placeholder.png',
            image: p.imageUrl || '/images/placeholder.png',
            featured: false,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            categoryName: productCategory ? productCategory.categoryName : '',
            subCategoryName: productSubCategory ? productSubCategory.subCategoryName : '',
            rating: 4.8,
            reviewCount: 15,
            colors: [
              { name: 'Pastel Pink', hex: '#f5ccd4' },
              { name: 'Pale Yellow', hex: '#fbfbe3' },
              { name: 'Soft White', hex: '#ffffff' }
            ],
            thumbnails: [
              p.imageUrl || '/images/placeholder.png'
            ]
          };
        });

        setProductsState(mapped);
      } catch (err) {
        console.error('Error fetching products from backend:', err);
        setError('Failed to load arrangements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (dbCategories.length > 0) {
      fetchProducts();
    }
  }, [selectedCategories, selectedSubcategories, dbCategories, dbSubCategories]);

  const toggleWishlist = async (id) => {
    if (!userId) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }

    const wishlistId = wishlist[id];

    if (wishlistId) {
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

  const handleAddToCart = async (product) => {
    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage in handleAddToCart:', e);
      }
    }
    if (!currentUser) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }

    const defaultColor = product.colors?.[0]?.name || 'Pastel Pink';
    try {
      await cartApi.addToCart(product.id, 1, defaultColor);
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart'));
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  // Extract Categories and Subcategories from master lists
  const categoriesList = dbCategories.map((c) => c.categoryName);
  
  // Show subcategories filtered by active category if selected, otherwise show all unique subcategory names
  const activeCat = dbCategories.find(c => c.categoryName === selectedCategories[0]);
  const filteredSubcategories = activeCat 
    ? dbSubCategories.filter(s => s.categoryId === activeCat.id)
    : dbSubCategories;
  const subcategoriesList = [...new Set(filteredSubcategories.map((s) => s.subCategoryName).filter(Boolean))];

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? [] : [cat]
    );
    setSelectedSubcategories([]); // Clear subcategory when category changes
    setCurrentPage(1);
  };

  const handleSubcategoryToggle = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? [] : [sub]
    );
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange(50000);
    setInStockOnly(false);
    setMinRating(0);
    setOnSaleOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  // Search Param sync
  const searchKeyword = searchParams.get('search') || '';

  // Trigger brief fade transition on filter/sort change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timer);
  }, [selectedCategories, selectedSubcategories, priceRange, inStockOnly, minRating, onSaleOnly, sortBy, searchKeyword]);

  // Filtering Logic
  const filteredProducts = productsState.filter((product) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(keyword);
      const matchDesc = product.description.toLowerCase().includes(keyword);
      const matchCat = product.categoryName.toLowerCase().includes(keyword);
      const matchSub = product.subCategoryName.toLowerCase().includes(keyword);
      if (!matchTitle && !matchDesc && !matchCat && !matchSub) return false;
    }

    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryName)) {
      return false;
    }

    if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(product.subCategoryName)) {
      return false;
    }

    const activePrice = product.discountNumericPrice !== null ? product.discountNumericPrice : product.numericPrice;
    if (activePrice > priceRange) {
      return false;
    }

    if (inStockOnly && (product.stockQuantity <= 0 || product.status !== 'ACTIVE')) {
      return false;
    }

    if (product.rating < minRating) {
      return false;
    }

    if (onSaleOnly && product.discountPercentage <= 0) {
      return false;
    }

    return true;
  });

  // Sorting Logic (8 options)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountNumericPrice !== null ? a.discountNumericPrice : a.numericPrice;
    const priceB = b.discountNumericPrice !== null ? b.discountNumericPrice : b.numericPrice;

    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'best-selling':
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount;
      case 'popularity':
      default:
        if (b.featured !== a.featured) {
          return b.featured ? 1 : -1;
        }
        return b.rating - a.rating;
    }
  });

  // Pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    const scrollTarget = document.getElementById('shop-products-header');
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a]" style={{ fontFamily: 'Inter, Montserrat, sans-serif' }}>
      <Navbar
        isScrolled={true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-[120px] pb-20">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filters Sidebar - Desktop view */}
          <aside className="hidden lg:block w-64 shrink-0 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-[#d9d2d0]/50 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[#1a1a1a] font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                Filters
              </h2>
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-[#8c5e5e] hover:underline transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Category</h3>
              <div className="space-y-2">
                {categoriesList.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            {subcategoriesList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Subcategory</h3>
                <div className="space-y-2">
                  {subcategoriesList.map((sub) => (
                    <label key={sub} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub)}
                        onChange={() => handleSubcategoryToggle(sub)}
                        className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Price Range</h3>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1 bg-[#eae6e3] rounded-lg appearance-none cursor-pointer accent-[#8c5e5e] focus:outline-none"
              />
              <div className="flex justify-between items-center text-[10px] font-semibold text-[#1a1a1a]/50 mt-1">
                <span>Rs 500</span>
                <span>Rs 50,000</span>
              </div>
              <div className="text-xs font-bold text-[#8c5e5e] mt-2">
                Max Price: Rs {priceRange.toLocaleString()}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Availability</h3>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((stars) => (
                  <label key={stars} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                    <input
                      type="radio"
                      name="min-rating"
                      checked={minRating === stars}
                      onChange={() => {
                        setMinRating(stars);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                    />
                    <span className="flex items-center gap-1">
                      {stars}+ Stars
                      <span className="flex text-[#8c5e5e]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < stars ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'} />
                        ))}
                      </span>
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                  <input
                    type="radio"
                    name="min-rating"
                    checked={minRating === 0}
                    onChange={() => {
                      setMinRating(0);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                  />
                  <span>All Ratings</span>
                </label>
              </div>
            </div>

            {/* Discount Filter */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Discount</h3>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => {
                    setOnSaleOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] focus:ring-[#8c5e5e] accent-[#8c5e5e]"
                />
                <span>On Sale Only</span>
              </label>
            </div>
          </aside>

          {/* Products Column */}
          <main className="flex-1">
            {/* Header info / Sort dropdown */}
            <div id="shop-products-header" className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pb-4 border-b border-[#d9d2d0]/30 mb-8 text-left">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Shop All Flowers
                </h1>
                <p className="text-xs font-semibold text-[#1a1a1a]/60 mt-1 font-sans">
                  {searchKeyword ? (
                    <span>Showing {sortedProducts.length} of {productsState.length} arrangements matching "{searchKeyword}"</span>
                  ) : (
                    <span>Showing {sortedProducts.length} of {productsState.length} premium arrangements</span>
                  )}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2.5 justify-between sm:justify-end">
                {/* Mobile Filter toggle button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[#d9d2d0] rounded-sm text-xs font-bold text-[#1a1a1a]/70 hover:bg-[#f4f0ed]"
                >
                  <Filter size={14} />
                  Filters
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1a1a1a]/60">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-[#8c5e5e] outline-none cursor-pointer border-b border-transparent hover:border-[#8c5e5e] pb-0.5 transition-all"
                  >
                    <option value="popularity">Most Relevant</option>
                    <option value="best-selling">Best Selling</option>
                    <option value="title-asc">Alphabetically (A–Z)</option>
                    <option value="title-desc">Alphabetically (Z–A)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="date-asc">Date: Oldest to Newest</option>
                    <option value="date-desc">Date: Newest to Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {error ? (
              <div className="text-center py-24 bg-[#faf8f6] rounded-xl border border-red-200 mt-4">
                <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
                <p className="text-sm font-bold text-red-600">
                  {error}
                </p>
                <button
                  onClick={() => { setError(null); handleClearAll(); }}
                  className="mt-5 px-6 py-3 rounded-sm bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-32 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#8c5e5e]/30 border-t-[#8c5e5e] rounded-full animate-spin mb-3"></div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Arrangements...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#faf8f6] rounded-xl border border-[#d9d2d0]/15 mt-4">
                <AlertCircle size={40} className="mx-auto text-[#1a1a1a]/20 mb-3" />
                <p className="text-sm font-bold text-[#1a1a1a]/60">
                  No products match your criteria.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 px-6 py-3 rounded-sm bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-100'
                }`}>
                {currentItems.map((product) => {
                  const isOutOfStock = product.stockQuantity <= 0 || product.status !== 'ACTIVE';
                  return (
                    <article key={product.id} className="group bg-transparent text-left relative flex flex-col justify-between">
                      <div>
                        {/* Image box */}
                        <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#f4f0ed] shadow-sm mb-4 border border-[#d9d2d0]/15">
                          <Link to={`/product/${product.id}`} className="block w-full h-full">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                          </Link>

                          {/* Out of Stock Badge */}
                          {isOutOfStock ? (
                            <div className="absolute top-3 left-3 bg-[#f5e6e8] text-[#8c5e5e] px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase">
                              SOLD OUT
                            </div>
                          ) : product.discountPercentage > 0 ? (
                            <div className="absolute top-3 left-3 bg-[#e88d9d] text-white px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase">
                              {product.discountPercentage}% OFF
                            </div>
                          ) : null}

                          {/* Wishlist Toggle Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className="absolute top-3 right-3 bg-white hover:scale-105 transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 text-gray-400 hover:text-[#8c5e5e]"
                            aria-label="Add to wishlist"
                          >
                            <Heart
                              size={15}
                              className={`transition-all duration-300 ${wishlist[product.id] ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-400'
                                }`}
                            />
                          </button>

                          {/* Action overlay layout */}
                          <div className="absolute left-3 right-3 bottom-3 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                            {/* Quick view button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveQuickViewProduct(product);
                              }}
                              className="w-full py-2 rounded-sm bg-white/95 text-[#1a1a1a] hover:bg-[#8c5e5e] hover:text-white font-bold text-[10px] tracking-wider uppercase transition-colors duration-300 shadow-md flex items-center justify-center gap-1"
                            >
                              <Eye size={12} />
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* Text meta */}
                        <div className="pt-1 px-1 text-left">
                          <Link to={`/product/${product.id}`} className="hover:text-[#8c5e5e] transition-colors">
                            <h4 className="text-[15px] text-[#1a1a1a] font-bold tracking-tight truncate leading-tight group-hover:text-[#8c5e5e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {product.title}
                            </h4>
                          </Link>
                          <p className="text-[10px] font-bold text-[#8c5e5e]/80 uppercase mt-0.5 tracking-wider">
                            {product.categoryName} {product.subCategoryName && `• ${product.subCategoryName}`}
                          </p>
                          <p className="text-xs text-[#1a1a1a]/60 mt-1 font-sans">
                            {product.subtitle}
                          </p>

                          {/* Ratings */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex text-[#8c5e5e]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'} />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-500">({product.rating.toFixed(1)})</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Add to Cart Action */}
                      <div className="px-1 pt-3 mt-3 border-t border-[#d9d2d0]/20 flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.discountPrice ? (
                            <>
                              <span className="text-sm font-bold text-[#8c5e5e]">
                                {product.discountPrice}
                              </span>
                              <span className="text-[10px] text-gray-400 line-through">
                                {product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-[#8c5e5e]">
                              {product.price}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                          className="px-3 py-1.5 bg-[#8c5e5e] hover:bg-[#7d4d50] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[9px] font-bold uppercase tracking-wider rounded-sm transition-colors duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-16 font-sans">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-sm border border-[#d9d2d0]/60 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-sm flex items-center justify-center font-semibold text-sm transition-all ${currentPage === page
                        ? 'bg-[#8c5e5e] text-white shadow-sm'
                        : 'border border-[#d9d2d0]/60 text-[#1a1a1a]/70 hover:bg-[#f4f0ed]'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-sm border border-[#d9d2d0]/60 flex items-center justify-center hover:bg-[#f4f0ed] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>

      {/* Premium Quick View Modal Overlay */}
      {activeQuickViewProduct && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveQuickViewProduct(null)}
        >
          <div
            className="bg-[#fcf9f8] w-full max-w-4xl rounded-2xl overflow-hidden border border-[#d9d2d0]/30 shadow-2xl p-6 md:p-8 relative flex flex-col md:flex-row gap-8 animate-scale-up-fade text-left"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleUpFade 0.25s ease-out' }}
          >
            <button
              onClick={() => setActiveQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#f4f0ed] text-[#1a1a1a]/65 hover:text-[#8c5e5e] transition-all"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Image box */}
            <div className="w-full md:w-1/2 aspect-[4/5] bg-[#f4f0ed] rounded-xl overflow-hidden border border-[#d9d2d0]/15 relative">
              <img
                src={activeQuickViewProduct.imageUrl}
                alt={activeQuickViewProduct.title}
                className="w-full h-full object-cover"
              />
              {activeQuickViewProduct.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                  {activeQuickViewProduct.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Info details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
              <div>
                <div className="mb-2">
                  <span className="text-[10px] tracking-[0.2em] font-bold text-[#8c5e5e] uppercase">
                    {activeQuickViewProduct.categoryName} &gt; {activeQuickViewProduct.subCategoryName}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1 font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {activeQuickViewProduct.title}
                  </h3>
                  <p className="text-xs text-[#1a1a1a]/55 font-semibold mt-1">
                    {activeQuickViewProduct.subtitle}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-[#8c5e5e]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(activeQuickViewProduct.rating) ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1a1a1a]/70">
                    {activeQuickViewProduct.rating.toFixed(1)} ({activeQuickViewProduct.reviewCount} verified reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3.5 mb-5">
                  {activeQuickViewProduct.discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-[#8c5e5e]">
                        {activeQuickViewProduct.discountPrice}
                      </span>
                      <span className="text-base text-gray-400 line-through font-semibold">
                        {activeQuickViewProduct.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[#8c5e5e]">
                      {activeQuickViewProduct.price}
                    </span>
                  )}
                </div>

                {/* Stock status */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${activeQuickViewProduct.stockQuantity > 0 && activeQuickViewProduct.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${activeQuickViewProduct.stockQuantity > 0 && activeQuickViewProduct.status === 'ACTIVE'
                      ? 'bg-green-600'
                      : 'bg-red-600'
                      }`} />
                    {activeQuickViewProduct.stockQuantity > 0 && activeQuickViewProduct.status === 'ACTIVE'
                      ? `In Stock (${activeQuickViewProduct.stockQuantity} available)`
                      : 'Out of Stock'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-[#1a1a1a]/65 leading-relaxed mb-6 font-normal">
                  {activeQuickViewProduct.description}
                </p>

                {/* Colors */}
                {activeQuickViewProduct.colors?.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 block mb-2">Available Colors</span>
                    <div className="flex gap-2">
                      {activeQuickViewProduct.colors.map((color, index) => (
                        <span
                          key={index}
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-xs"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  handleAddToCart(activeQuickViewProduct);
                  setActiveQuickViewProduct(null);
                }}
                disabled={activeQuickViewProduct.stockQuantity <= 0 || activeQuickViewProduct.status !== 'ACTIVE'}
                className="w-full py-4 bg-[#8c5e5e] hover:bg-[#7d4d50] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={15} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Filter Menu */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="w-80 max-w-full bg-[#fcf9f8] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between text-left animate-slide-left"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideLeft 0.25s ease-out' }}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#d9d2d0]/50 mb-6">
                <h2 className="text-lg font-bold text-[#1a1a1a] font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Filters
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-[#1a1a1a]/65 hover:text-[#8c5e5e]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Category</h3>
                <div className="space-y-2">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] accent-[#8c5e5e]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {subcategoriesList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Subcategory</h3>
                  <div className="space-y-2">
                    {subcategoriesList.map((sub) => (
                      <label key={sub} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub)}
                          onChange={() => handleSubcategoryToggle(sub)}
                          className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] accent-[#8c5e5e]"
                        />
                        <span>{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Price Range</h3>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full h-1 bg-[#eae6e3] rounded-lg appearance-none cursor-pointer accent-[#8c5e5e]"
                />
                <div className="text-xs font-bold text-[#8c5e5e] mt-2">
                  Max Price: Rs {priceRange.toLocaleString()}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Availability</h3>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] accent-[#8c5e5e]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2].map((stars) => (
                    <label key={stars} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                      <input
                        type="radio"
                        name="mobile-min-rating"
                        checked={minRating === stars}
                        onChange={() => {
                          setMinRating(stars);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-[#8c5e5e] accent-[#8c5e5e]"
                      />
                      <span className="flex items-center gap-1">
                        {stars}+ Stars
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                    <input
                      type="radio"
                      name="mobile-min-rating"
                      checked={minRating === 0}
                      onChange={() => {
                        setMinRating(0);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-[#8c5e5e] accent-[#8c5e5e]"
                    />
                    <span>All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Discount */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-3">Discount</h3>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[#1a1a1a]/85">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => {
                      setOnSaleOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded-sm border-[#d9d2d0] text-[#8c5e5e] accent-[#8c5e5e]"
                  />
                  <span>On Sale Only</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-[#d9d2d0]/30 mt-6">
              <button
                onClick={handleClearAll}
                className="w-1/2 py-2.5 border border-[#8c5e5e] text-[#8c5e5e] font-bold text-xs uppercase tracking-wider rounded-sm"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 bg-[#8c5e5e] text-white font-bold text-xs uppercase tracking-wider rounded-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
