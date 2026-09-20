import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ArrowLeft, ArrowRight, RotateCw, Check, ShieldCheck, HelpCircle, Truck, Leaf, X } from 'lucide-react';
import Navbar from './components/Navbar';
//import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Product3DViewer from '../../components/Product3DViewer';
import api, { cartApi } from '../../services/api';
import { getProductImageUrl, getProductImage } from '../../utils/imageHelper';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Gallery states
  const [quantity, setQuantity] = useState(1);
  const [stockMessage, setStockMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // 360 Viewer states
  const [show360Modal, setShow360Modal] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [viewMode3D, setViewMode3D] = useState(false);

  // Review states
  const [reviewsList, setReviewsList] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);
  const [modelPath, setModelPath] = useState("/models/redrose.glb");

  // Carousel slider ref for complementary pieces
  const carouselRef = useRef(null);

  // Load product data from PostgreSQL backend based on ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/products/${productId}`);
        const p = response.data;

        if (p) {
          const numPrice = Number(p.price) || 0;
          const discountPct = Number(p.discountPercentage) || 0;
          let discPriceVal = null;
          if (discountPct > 0) {
            discPriceVal = numPrice * (1 - discountPct / 100);
          }

          const mappedProduct = {
            id: p.productId,
            productId: p.productId,
            productName: p.productName || 'Unnamed Arrangement',
            title: p.productName || 'Unnamed Arrangement',
            subtitle: p.categoryName || '',
            description: p.description || '',
            price: `Rs ${numPrice.toFixed(2)}`,
            numericPrice: numPrice,
            discountPercentage: discountPct,
            discountPrice: discPriceVal ? `Rs ${discPriceVal.toFixed(2)}` : null,
            discountNumericPrice: discPriceVal,
            stockQuantity: p.stockQuantity !== undefined && p.stockQuantity !== null ? Number(p.stockQuantity) : 0,
            imageUrl: getProductImage(p),
            modelUrl: p.modelUrl || '',
            categoryName: p.categoryName || '',
            subCategoryName: p.subCategoryName || '',
            categoryId: p.categoryId,
            subCategoryId: p.subCategoryId,
            colors: [
              { name: 'Pastel Pink', hex: '#f5ccd4' },
              { name: 'Pale Yellow', hex: '#fbfbe3' },
              { name: 'Soft White', hex: '#ffffff' }
            ],
            thumbnails: [
              getProductImage(p)
            ]
          };

          setProduct(mappedProduct);
          setQuantity(mappedProduct.stockQuantity > 0 ? 1 : 0);
          setStockMessage('');

          // Set 3D model path dynamically from backend modelUrl
          setModelPath(mappedProduct.modelUrl || "");

          // Load reviews from PostgreSQL database via REST API
          try {
            const reviewsRes = await api.get(`/api/products/reviews/${productId}`);
            if (reviewsRes.data && Array.isArray(reviewsRes.data)) {
              const formattedReviews = reviewsRes.data.map((r) => ({
                id: r.reviewId,
                name: r.customerName || 'Verified Customer',
                verified: true,
                date: r.reviewDate ? new Date(r.reviewDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently',
                rating: r.rating,
                text: r.comment
              }));
              setReviewsList(formattedReviews);
            }
          } catch (reviewErr) {
            console.error('Error fetching reviews from backend:', reviewErr);
          }

          // Fetch related products based on same category/subcategory
          let relatedEndpoint = '/api/products';
          if (p.categoryId && p.subCategoryId) {
            relatedEndpoint = `/api/products/category/${p.categoryId}/subcategory/${p.subCategoryId}`;
          } else if (p.categoryId) {
            relatedEndpoint = `/api/products/category/${p.categoryId}`;
          }

          try {
            const relatedRes = await api.get(relatedEndpoint);
            const filtered = relatedRes.data
              .filter((item) => item.productId !== p.productId)
              .map((item) => {
                const rPrice = Number(item.price) || 0;
                return {
                  id: item.productId,
                  title: item.productName,
                  price: `Rs ${rPrice.toFixed(2)}`,
                  imageUrl: getProductImage(item),
                  categoryName: item.categoryName,
                  subCategoryName: item.subCategoryName
                };
              });
            setRelatedProducts(filtered.slice(0, 8));
          } catch (relatedErr) {
            console.error('Error fetching related products:', relatedErr);
          }

          // Wishlist check status
          const checkWishlistStatus = async () => {
            const savedUser = localStorage.getItem('user');
            let user = null;
            if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
              try {
                user = JSON.parse(savedUser);
              } catch (e) {
                console.error('Failed to parse user from localStorage in ProductDetails checkWishlistStatus:', e);
              }
            }
            const userId = user ? (user.id || user.userId) : null;

            if (userId) {
              try {
                const response = await api.get(`/api/wishlist/user/${userId}`);
                const item = response.data.find((w) => w.productId === p.productId);
                if (item) {
                  setIsWishlisted(true);
                  setWishlistId(item.wishlistId);
                } else {
                  setIsWishlisted(false);
                  setWishlistId(null);
                }
              } catch (error) {
                console.error('Error checking wishlist status:', error);
              }
            } else {
              setIsWishlisted(false);
              setWishlistId(null);
            }
          };
          checkWishlistStatus();
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product details from backend:', err);
        setError('Arrangement not found or server is unreachable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Wishlist Toggle
  const toggleWishlist = async () => {
    if (!product) return;

    const savedUser = localStorage.getItem('user');
    let user = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        user = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage in ProductDetails toggleWishlist:', e);
      }
    }
    const userId = user ? (user.id || user.userId) : null;

    if (!userId) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }

    if (isWishlisted && wishlistId) {
      try {
        await api.delete(`/api/wishlist/${wishlistId}`);
        setIsWishlisted(false);
        setWishlistId(null);
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      try {
        const response = await api.post('/api/wishlist', {
          userId,
          productId: product.id
        });
        setIsWishlisted(true);
        setWishlistId(response.data.data.wishlistId);
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  const handleQuantityIncrease = () => {
    if (!product) return;
    const maxStock = Number(product.stockQuantity) || 0;
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
      setStockMessage('');
    } else {
      setStockMessage(`Only ${maxStock} items are available in stock.`);
    }
  };

  const handleQuantityDecrease = () => {
    if (!product) return;
    setQuantity((prev) => {
      const next = Math.max(1, prev - 1);
      if (next < (Number(product.stockQuantity) || 0)) {
        setStockMessage('');
      }
      return next;
    });
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!product) return;
    const maxStock = Number(product.stockQuantity) || 0;
    if (maxStock <= 0) {
      alert('This product is currently out of stock.');
      return;
    }
    if (quantity > maxStock) {
      alert(`Cannot add to cart. Only ${maxStock} items are available in stock.`);
      return;
    }

    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage in ProductDetails handleAddToCart:', e);
      }
    }
    if (!currentUser) {
      window.dispatchEvent(new Event('show-login-required'));
      return;
    }
    setIsAddingToCart(true);

    try {
      await cartApi.addToCart(product.id, quantity, 'Default');
      setIsAddingToCart(false);
      setAddedToCart(true);
      window.dispatchEvent(new Event('cart-updated'));

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  // Review submission to backend database
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const savedUser = localStorage.getItem('user');
    let currentUser = null;
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (err) {
        console.error('Failed to parse user from localStorage in review submit:', err);
      }
    }

    const userId = currentUser ? (currentUser.id || currentUser.userId) : null;

    try {
      await api.post('/api/products/reviews', {
        userId: userId ? Number(userId) : null,
        productId: Number(productId),
        rating: newReviewRating,
        comment: newReviewText
      });

      // Refresh reviews list from backend database
      const reviewsRes = await api.get(`/api/products/reviews/${productId}`);
      if (reviewsRes.data && Array.isArray(reviewsRes.data)) {
        const formattedReviews = reviewsRes.data.map((r) => ({
          id: r.reviewId,
          name: r.customerName || 'Verified Customer',
          verified: true,
          date: r.reviewDate ? new Date(r.reviewDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently',
          rating: r.rating,
          text: r.comment
        }));
        setReviewsList(formattedReviews);
      }

      setNewReviewName('');
      setNewReviewText('');
      setNewReviewRating(5);
      setShowReviewModal(false);
    } catch (error) {
      console.error('Failed to submit review to backend:', error);
      alert(error.response?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  // Auto Rotation for 360 View Modal
  useEffect(() => {
    let interval;
    if (isRotating && show360Modal && product?.thumbnails) {
      interval = setInterval(() => {
        setRotationIndex((prev) => (prev + 1) % product.thumbnails.length);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isRotating, show360Modal, product]);

  // Complementary pieces scroll handlers
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Loading State View
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
        <Navbar isScrolled={true} mobileMenuOpen={false} setMobileMenuOpen={() => { }} navItems={['Home', 'Shop', 'Customization', 'About', 'Contact']} />
        <div className="flex-1 flex flex-col items-center justify-center pt-5 pb-12 px-6">
          <div className="w-8 h-8 border-4 border-[#8c5e5e]/30 border-t-[#8c5e5e] rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Arrangement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State View
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
        <Navbar isScrolled={true} mobileMenuOpen={false} setMobileMenuOpen={() => { }} navItems={['Home', 'Shop', 'Customization', 'About', 'Contact']} />
        <div className="flex-1 flex flex-col items-center justify-center pt-5 pb-12 px-6 text-center">
          <h2 className="text-3xl font-bold font-playfair text-[#1a1a1a] mb-4">Arrangement Not Found</h2>
          <p className="text-sm text-[#1a1a1a]/60 mb-8">{error || 'The botanical piece you are looking for does not exist.'}</p>
          <Link to="/shop" className="px-6 py-3 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-300">
            Back to Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate dynamic average rating and review count
  const averageRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : 4.8;
  const totalReviewsCount = reviewsList.length;

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a] font-sans">
      <Navbar isScrolled={true} mobileMenuOpen={false} setMobileMenuOpen={() => { }} navItems={['Home', 'Shop', 'Customization', 'About', 'Contact']} />

      {/* Main product area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-0 md:pt-1 pb-10">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#1a1a1a]/50 mb-2 uppercase">
          <Link to="/guestUserDashboard" className="hover:text-[#8c5e5e] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#8c5e5e] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#8c5e5e] truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* Left Column: Product Image */}
          <div className="flex flex-col gap-2.5">
            {/* Main Interactive Product Image */}
            <div className="w-full h-[300px] sm:h-[350px] lg:h-[380px] bg-[#f4f0ed] rounded-sm overflow-hidden relative group shadow-sm border border-[#d9d2d0]/25 flex items-center justify-center">
              <img
                src={getProductImageUrl(product.imageUrl)}
                alt={product.productName}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/product-placeholder.png";
                }}
                className="w-full h-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.03] animate-fade-in"
              />

              {/* Favorite toggle overlay */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 z-10"
                aria-label="Add to Wishlist"
              >
                <Heart
                  size={16}
                  className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-[#1a1a1a]/75'
                    }`}
                />
              </button>
            </div>

            {/* 3D Model Option */}
            {product.modelUrl ? (
              <button
                onClick={() => {
                  setShow360Modal(true);
                  setViewMode3D(true);
                }}
                className="flex items-center justify-center gap-2 mx-auto mt-0.5 px-4 py-1.5 rounded-full border border-[#d9d2d0] hover:border-[#8c5e5e] hover:bg-[#8c5e5e]/5 text-[10px] font-bold tracking-widest text-[#1a1a1a]/70 hover:text-[#8c5e5e] transition-all duration-300 shadow-sm"
              >
                <RotateCw size={13} className="animate-spin-slow" />
                <span>INTERACTIVE 3D VIEW</span>
              </button>
            ) : (
              <p className="text-center text-[10px] text-[#1a1a1a]/40 font-semibold mt-0.5">
                3D model not available.
              </p>
            )}
          </div>

          {/* Right Column: Product Detail Panel */}
          <div className="flex flex-col justify-start text-left">

            {/* Category / Subcategory tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] uppercase tracking-wider font-bold text-[#1a1a1a]/50">
              <span className="bg-[#f4f0ed] px-2.5 py-1 rounded-sm border border-[#d9d2d0]/20">Category: <span className="text-[#8c5e5e]">{product.categoryName}</span></span>
              {product.subCategoryName && (
                <span className="bg-[#f4f0ed] px-2.5 py-1 rounded-sm border border-[#d9d2d0]/20">Subcategory: <span className="text-[#8c5e5e]">{product.subCategoryName}</span></span>
              )}
            </div>

            {/* Reviews Summary */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5 text-xs text-[#8c5e5e]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(Number(averageRating)) ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <a
                href="#reviews"
                className="text-[11px] font-bold text-[#1a1a1a]/60 hover:text-[#8c5e5e] underline transition-colors"
              >
                ({totalReviewsCount} Reviews)
              </a>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.title}
            </h1>

            {/* Pricing Info */}
            <div className="flex items-center gap-3 mb-3">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="text-xl md:text-2xl font-semibold text-[#8c5e5e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {product.discountPrice}
                  </span>
                  <span className="text-xs line-through text-[#1a1a1a]/40">
                    {product.price}
                  </span>
                  <span className="bg-red-500 text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-xl md:text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.price}
                </span>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="mb-3 flex items-center gap-2 text-xs text-[#1a1a1a]/70">
              <span className="font-bold">Availability:</span>
              {product.stockQuantity > 0 ? (
                <span className="text-emerald-600 font-semibold">{product.stockQuantity} in stock</span>
              ) : (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#d9d2d0]/50 my-1"></div>

            {/* Description */}
            <p className="text-xs md:text-sm leading-relaxed text-[#1a1a1a]/75 my-4 font-normal">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-5">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#1a1a1a]/60 block mb-2">
                QUANTITY
              </span>
              <div className="inline-flex items-center border border-[#d9d2d0] bg-white rounded-sm">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1 || product.stockQuantity <= 0}
                  className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                    quantity <= 1 || product.stockQuantity <= 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#1a1a1a]/70 hover:bg-[#f4f0ed]'
                  }`}
                  aria-label="Decrease quantity"
                >
                  &mdash;
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono select-none">
                  {quantity}
                </span>
                <button
                  onClick={handleQuantityIncrease}
                  disabled={product.stockQuantity <= 0 || quantity >= product.stockQuantity}
                  className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                    product.stockQuantity <= 0 || quantity >= product.stockQuantity
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#1a1a1a]/70 hover:bg-[#f4f0ed]'
                  }`}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {stockMessage && (
                <p className="text-xs text-[#8c5e5e] font-semibold mt-1.5">
                  {stockMessage}
                </p>
              )}
            </div>

            {/* Actions: Add to Cart and Wishlist */}
            <div className="flex gap-3 mb-5 w-full">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stockQuantity <= 0 || quantity > product.stockQuantity}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-sm text-white font-medium text-xs tracking-wider uppercase transition-all duration-500 shadow-md ${
                  isAddingToCart || product.stockQuantity <= 0 || quantity > product.stockQuantity
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-[#8c5e5e] hover:bg-[#7d4d50] active:scale-[0.98]'
                }`}
              >
                {product.stockQuantity <= 0 ? (
                  <span>Out of Stock</span>
                ) : isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : addedToCart ? (
                  <>
                    <Check size={14} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleWishlist}
                className={`w-12 h-12 border border-[#d9d2d0] rounded-sm flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted
                  ? 'border-[#8c5e5e] bg-[#8c5e5e]/5 text-[#8c5e5e]'
                  : 'hover:border-[#8c5e5e] hover:bg-[#8c5e5e]/5 text-[#1a1a1a]/70'
                  }`}
                aria-label="Toggle Wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-[#8c5e5e]' : ''} />
              </button>
            </div>

            {/* Product Meta Flags */}
            <div className="flex flex-row flex-wrap gap-x-6 gap-y-2.5 pt-4 border-t border-[#d9d2d0]/40 font-sans text-xs text-[#1a1a1a]/60">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#8c5e5e]" />
                <span>Global Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf size={14} className="text-[#8c5e5e]" />
                <span>Sustainable Fibers</span>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Stories Section */}
        <section id="reviews" className="mt-8 pt-6 border-t border-[#d9d2d0]/50 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Customer Stories
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {averageRating}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 text-xs text-[#8c5e5e]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.round(Number(averageRating)) ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#1a1a1a]/55 font-bold tracking-wide mt-0.5">Based on {totalReviewsCount} reviews</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const savedUser = localStorage.getItem('user');
                let currentUser = null;
                if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                  try {
                    currentUser = JSON.parse(savedUser);
                  } catch (e) {
                    console.error('Failed to parse user from localStorage in ProductDetails review click:', e);
                  }
                }
                if (currentUser) {
                  setNewReviewName(currentUser.name || '');
                  setShowReviewModal(true);
                } else {
                  window.dispatchEvent(new Event('show-login-required'));
                }
              }}
              className="px-5 py-2.5 border border-[#8c5e5e] text-[#8c5e5e] hover:bg-[#8c5e5e] hover:text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm shrink-0"
            >
              Write a Review
            </button>
          </div>

          {/* Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {reviewsList.slice(0, visibleReviewsCount).map((review) => (
              <div key={review.id} className="p-5 rounded-sm bg-[#faf8f6] border border-[#d9d2d0]/20 flex flex-col justify-between shadow-sm relative animate-fade-in hover:shadow-md transition-shadow duration-300">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f4f0ed] border border-[#d9d2d0]/30 flex items-center justify-center font-bold text-[#8c5e5e] text-xs">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm text-[#1a1a1a]">{review.name}</h4>
                          {review.verified && (
                            <span className="inline-flex items-center gap-0.5 bg-[#f5e6e8] text-[#8c5e5e] text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm">
                              <ShieldCheck size={8} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-[#1a1a1a]/40 font-semibold uppercase tracking-wider mt-0.5">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-xs text-[#8c5e5e]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < review.rating ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed italic text-[#1a1a1a]/80 font-normal">
                    "{review.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {reviewsList.length > visibleReviewsCount && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleReviewsCount((prev) => Math.min(reviewsList.length, prev + 2))}
                className="flex items-center gap-1.5 py-2 px-4 border-b border-transparent hover:border-[#8c5e5e] text-[#8c5e5e] text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                <span>Load More Reviews</span>
                <span className="text-[9px]">&darr;</span>
              </button>
            </div>
          )}
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 pt-6 border-t border-[#d9d2d0]/50 relative">
            <div className="flex justify-between items-end gap-4 mb-6">
              <div className="text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-1">Harmonious Pairings</p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Related Products
                </h2>
              </div>

              {/* Nav arrows */}

            </div>

            {/* Related Products Slider list */}
            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-6 text-left select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map((piece) => (
                <Link
                  key={piece.id}
                  to={`/product/${piece.id}`}
                  className="min-w-[260px] md:min-w-[280px] max-w-[280px] flex-shrink-0 group flex flex-col font-sans hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="relative aspect-[3/4] bg-[#f4f0ed] rounded-sm overflow-hidden mb-4 border border-[#d9d2d0]/15">
                    <img
                      src={getProductImageUrl(piece.imageUrl)}
                      alt={piece.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/product-placeholder.png";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </div>

                  <div className="px-1 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <h3 className="font-bold text-[15px] text-[#1a1a1a] tracking-tight group-hover:text-[#8c5e5e] transition-colors leading-snug mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {piece.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-wider text-[#1a1a1a]/45 uppercase mb-2">
                        <span>{piece.categoryName}</span>
                        {piece.subCategoryName && (
                          <>
                            <span>&bull;</span>
                            <span>{piece.subCategoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#8c5e5e] mt-auto">
                      {piece.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* 360° Drag & Auto Rotation Viewer Modal */}
      {show360Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#fcf9f8] w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden border border-[#d9d2d0]/30 animate-slide-up flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#d9d2d0]/30">
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  360° Botanical Visualizer
                </h3>
                <p className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest font-semibold mt-0.5">{product.title}</p>
              </div>
              <button
                onClick={() => { setShow360Modal(false); setIsRotating(false); }}
                className="p-1.5 hover:bg-[#f4f0ed] rounded-full text-[#1a1a1a]/60 hover:text-[#8c5e5e] transition-all"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visualizer Area */}
            <div className="p-8 flex-1 flex flex-col items-center justify-center min-h-[350px] relative bg-[#faf8f6]">

              {viewMode3D ? (
                // ✅ 3D VIEW (React Three Fiber)
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Product3DViewer model={modelPath} />
                </div>
              ) : (
                // ✅ YOUR EXISTING 2D 360 VIEW (UNCHANGED)
                <>
                  {/* Product Frame */}
                  <div className="w-64 aspect-[3/4] bg-[#f4f0ed] rounded-sm overflow-hidden relative shadow-md select-none border border-[#d9d2d0]/20">
                    <img
                      src={getProductImageUrl(product.thumbnails[rotationIndex])}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/product-placeholder.png";
                      }}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* 360 Badge overlay */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white rounded-full px-2.5 py-1 text-[9px] font-bold tracking-widest flex items-center gap-1.5 backdrop-blur-sm shadow-sm select-none">
                      <RotateCw size={9} className={isRotating ? 'animate-spin' : ''} />
                      <span>FRAME {rotationIndex + 1}/{product.thumbnails.length}</span>
                    </div>
                  </div>

                  {/* Slider for frames */}
                  <div className="w-full max-w-xs mt-6 px-1 flex flex-col gap-2">
                    <input
                      type="range"
                      min="0"
                      max={product.thumbnails.length - 1}
                      value={rotationIndex}
                      onChange={(e) => {
                        setRotationIndex(Number(e.target.value));
                        setIsRotating(false);
                      }}
                      className="w-full h-1 bg-[#eae6e3] rounded-lg appearance-none cursor-pointer accent-[#8c5e5e] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#1a1a1a]/45 font-bold tracking-wider text-center">
                      Drag slider or toggle play below to rotate
                    </span>
                  </div>
                </>
              )}

            </div>

            {/* Modal Controls */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#f4f0ed]/50 border-t border-[#d9d2d0]/25">
              <button
                onClick={() => setIsRotating((prev) => !prev)}
                className={`px-4 py-2 border rounded-sm text-xs font-bold tracking-wider transition-all duration-300 ${isRotating
                  ? 'bg-[#8c5e5e] text-white border-transparent'
                  : 'border-[#d9d2d0] text-[#1a1a1a]/70 hover:border-[#8c5e5e] hover:text-[#8c5e5e]'
                  }`}
              >
                {isRotating ? 'PAUSE ROTATION' : 'AUTO ROTATE'}
              </button>

              <button
                onClick={() => { setShow360Modal(false); setIsRotating(false); }}
                className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#8c5e5e] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-300 shadow-sm"
              >
                Close Visualizer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleReviewSubmit}
            className="bg-[#fcf9f8] w-full max-w-md rounded-sm shadow-2xl relative overflow-hidden border border-[#d9d2d0]/30 animate-slide-up text-left flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#d9d2d0]/30">
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Write a Review
                </h3>
                <p className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest font-semibold mt-0.5">{product.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 hover:bg-[#f4f0ed] rounded-full text-[#1a1a1a]/60 hover:text-[#8c5e5e] transition-all"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 flex-1">

              {/* Rating picker */}
              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#1a1a1a]/60 block mb-2">
                  Rating
                </span>
                <div className="flex items-center gap-1.5 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="text-[#8c5e5e] transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={star <= newReviewRating ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name field */}
              <div>
                <label
                  htmlFor="reviewName"
                  className="text-[11px] uppercase tracking-widest font-bold text-[#1a1a1a]/60 block mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="reviewName"
                  required
                  placeholder="e.g., Eleanor M."
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full bg-[#f4f0ed]/50 border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all duration-300"
                />
              </div>

              {/* Textarea field */}
              <div>
                <label
                  htmlFor="reviewText"
                  className="text-[11px] uppercase tracking-widest font-bold text-[#1a1a1a]/60 block mb-2"
                >
                  Review Details
                </label>
                <textarea
                  id="reviewText"
                  required
                  rows="4"
                  placeholder="Tell us about the texture, lifelike detail, styling options, or packaging..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-[#f4f0ed]/50 border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all duration-300 resize-none leading-relaxed"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 bg-[#f4f0ed]/50 border-t border-[#d9d2d0]/25">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#1a1a1a]/70 hover:text-[#8c5e5e] tracking-wider transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-300 shadow-md active:scale-95"
              >
                Submit Review
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Newsletter */}
      {/*<Newsletter />*/}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetails;
