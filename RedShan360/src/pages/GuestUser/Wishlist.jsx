import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Trash2, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { products } from '../../data/products';
import api from '../../services/api';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read authenticated user
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in Wishlist:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  const fetchWishlist = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/wishlist/user/${userId}`);
      
      // Map API items to product catalog details
      const mappedItems = response.data
        .map((item) => {
          const productDetail = products.find((p) => p.id === item.productId);
          if (productDetail) {
            return {
              ...productDetail,
              wishlistId: item.wishlistId,
            };
          }
          return null;
        })
        .filter(Boolean);

      setWishlistItems(mappedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  // Handle Remove Item
  const handleRemove = async (wishlistId) => {
    try {
      await api.delete(`/api/wishlist/${wishlistId}`);
      // Instantly update state
      setWishlistItems((prev) => prev.filter((item) => item.wishlistId !== wishlistId));
      // Notify other components (Navbar counts)
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    // Determine default color (first color in array or Default)
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default';

    // Retrieve active cart items
    const savedCart = localStorage.getItem('redshan360_cart');
    const cartList = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartList.findIndex(
      (item) => item.id === product.id && item.selectedColor === defaultColor
    );

    if (existingIndex > -1) {
      cartList[existingIndex].quantity += 1;
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
    // Dispatch events to refresh navbar count and open the drawer
    window.dispatchEvent(new Event('cart-updated'));
    window.dispatchEvent(new Event('open-cart'));
  };

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a] flex flex-col font-sans">
      <Navbar
        isScrolled={true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      {/* Main Wishlist Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pt-[130px] pb-24 text-left">
        
        {/* Header Title */}
        <div className="border-b border-[#d9d2d0]/30 pb-5 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Wishlist
          </h1>
          {userId && !loading && (
            <p className="text-xs font-semibold text-[#1a1a1a]/50 mt-1.5 uppercase tracking-wider">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Arrangement' : 'Arrangements'} Cataloged
            </p>
          )}
        </div>

        {/* 1. Unauthenticated State */}
        {!userId ? (
          <div className="text-center py-20 bg-[#faf8f6] rounded-sm border border-[#d9d2d0]/15 max-w-2xl mx-auto shadow-sm">
            <Heart size={44} className="mx-auto text-[#1a1a1a]/20 mb-4" />
            <h2 className="text-lg font-bold font-playfair text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Your Wishlist Awaits
            </h2>
            <p className="text-xs text-[#1a1a1a]/50 mb-8 max-w-md mx-auto px-4 font-medium leading-relaxed">
              Please sign in to view, manage, and add your curated artificial flower collection items directly to your cart.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-bold text-xs tracking-wider uppercase rounded-sm shadow-md transition-all duration-300 active:scale-[0.98]"
            >
              Sign In to Account
            </button>
          </div>
        ) : loading ? (
          /* 2. Loading State */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-[#8c5e5e]/25 border-t-[#8c5e5e] rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-semibold text-[#1a1a1a]/45 tracking-widest uppercase">Loading your catalog...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          /* 3. Empty Wishlist State */
          <div className="text-center py-20 bg-[#faf8f6] rounded-sm border border-[#d9d2d0]/15 max-w-2xl mx-auto shadow-sm">
            <Heart size={44} className="mx-auto text-[#1a1a1a]/15 mb-4" />
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              No arrangements found
            </h2>
            <p className="text-xs text-[#1a1a1a]/45 mb-8 max-w-md mx-auto px-4 font-medium leading-relaxed">
              It looks like you haven't added any favorite arrangements to your wishlist yet. Take a look at our curated collections.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-bold text-xs tracking-wider uppercase rounded-sm shadow-md transition-all duration-300 hover:gap-3"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          /* 4. Wishlist Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <article key={product.id} className="group bg-transparent flex flex-col justify-between relative border border-[#d9d2d0]/10 p-3 rounded-sm hover:shadow-md transition-all duration-300">
                <div>
                  
                  {/* Image wrapper */}
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#f4f0ed] mb-4 border border-[#d9d2d0]/15 shadow-xs">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Quick Remove (Active Red/Crimson Heart) */}
                    <button
                      onClick={() => handleRemove(product.wishlistId)}
                      className="absolute top-3 right-3 bg-white hover:scale-110 active:scale-95 transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 text-[#8c5e5e]"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={14} className="fill-[#8c5e5e] text-[#8c5e5e] transition-colors" />
                    </button>

                    {/* Discount badge if available */}
                    {product.discountPercent && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white font-bold text-[9px] tracking-widest px-2.5 py-1 rounded-sm shadow-sm uppercase animate-scale-up">
                        {product.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Title and metadata */}
                  <div className="px-1 text-left">
                    <Link to={`/product/${product.id}`} className="hover:text-[#8c5e5e] transition-colors">
                      <h3 className="font-bold text-base text-[#1a1a1a] truncate font-playfair group-hover:text-[#8c5e5e] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] font-semibold text-[#1a1a1a]/50 mt-0.5 tracking-wide">
                      {product.subtitle}
                    </p>
                  </div>
                </div>

                {/* Pricing & CTA Actions */}
                <div className="px-1 pt-3 mt-4 text-left">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-sm font-bold text-[#8c5e5e] font-mono">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through font-mono">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    
                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-[11px] font-bold tracking-wider uppercase rounded-sm shadow-sm transition-all duration-300 active:scale-[0.99]"
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Cart</span>
                    </button>

                    {/* View details & delete bar */}
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-[#d9d2d0] hover:border-[#8c5e5e] hover:bg-[#8c5e5e]/5 text-[#1a1a1a]/75 hover:text-[#8c5e5e] text-[10px] font-bold tracking-wider uppercase rounded-sm transition-all duration-300"
                      >
                        <Eye size={12} />
                        <span>View Details</span>
                      </Link>
                      
                      <button
                        onClick={() => handleRemove(product.wishlistId)}
                        className="p-2 border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-sm transition-colors duration-300"
                        title="Remove Item"
                        aria-label="Remove Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
