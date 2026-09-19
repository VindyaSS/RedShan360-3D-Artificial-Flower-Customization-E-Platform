import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ExperienceBanner from './components/ExperienceBanner';
import FeaturedProducts from './components/FeaturedProducts';
//import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import api from '../../services/api';

import { products as initialProducts } from '../../data/products';

const GuestUserDashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [productsState, setProductsState] = useState([]);
  const [loading, setLoading] = useState(true);

  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in GuestUserDashboard:', e);
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

  // Sync wishlist from other pages
  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdated);
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Products from Backend API and merge with mock database details
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const dbProducts = response.data;
        const merged = initialProducts.map((localProd) => {
          const dbProd = dbProducts.find((p) => p.productId === localProd.id || p.id === localProd.id);
          const numPrice = dbProd ? (Number(dbProd.price) || 0) : (localProd.numericPrice || 15000);
          const discountPct = dbProd ? (Number(dbProd.discountPercentage) || 0) : (localProd.discountPercent || 0);
          let discPriceVal = null;
          if (discountPct > 0) {
            discPriceVal = numPrice * (1 - discountPct / 100);
          }

          // Resolve image
          const finalImg = localProd.image || (dbProd && dbProd.imageUrl ? `http://localhost:8080/images/${dbProd.imageUrl}` : '/images/placeholder.png');

          const realId = dbProd ? dbProd.productId : localProd.id;

          return {
            ...localProd,
            id: realId,
            productId: realId,
            title: dbProd && dbProd.productName ? dbProd.productName : localProd.title,
            description: dbProd && dbProd.description ? dbProd.description : localProd.description,
            price: `Rs ${numPrice.toFixed(2)}`,
            numericPrice: numPrice,
            discountPercentage: discountPct,
            discountPrice: discPriceVal ? `Rs ${discPriceVal.toFixed(2)}` : null,
            discountNumericPrice: discPriceVal,
            stockQuantity: dbProd ? dbProd.stockQuantity : 50,
            imageUrl: dbProd ? dbProd.imageUrl : null,
            image: finalImg,
            featured: dbProd ? dbProd.featured : false,
            status: dbProd ? dbProd.status : 'ACTIVE',
            createdAt: dbProd && dbProd.createdAt ? dbProd.createdAt : (localProd.createdAt || new Date().toISOString()),
            categoryName: dbProd && dbProd.categoryName ? dbProd.categoryName : (localProd.category || 'silk'),
            subCategoryName: dbProd && dbProd.subCategoryName ? dbProd.subCategoryName : (localProd.subcategory || ''),
            rating: localProd.rating || 4.5,
            reviewCount: localProd.reviewCount || 10,
            colors: localProd.colors || [],
          };
        });
        setProductsState(merged);
      } catch (error) {
        console.error('Error fetching products from backend:', error);
        const fallback = initialProducts.map((p) => {
          const numPrice = p.numericPrice || 15000;
          const discountPct = p.discountPercent || 0;
          let discPriceVal = null;
          if (discountPct > 0) {
            discPriceVal = numPrice * (1 - discountPct / 100);
          }
          return {
            ...p,
            numericPrice: numPrice,
            price: `Rs ${numPrice.toFixed(2)}`,
            discountPercentage: discountPct,
            discountPrice: discPriceVal ? `Rs ${discPriceVal.toFixed(2)}` : null,
            discountNumericPrice: discPriceVal,
            stockQuantity: 50,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            categoryName: p.category,
            subCategoryName: p.subcategory || '',
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 10,
          };
        });
        setProductsState(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  const categories = [
    { name: 'Bouquets', tag: 'THE ETERNAL MUSE', image: '/images/bouquets.png', slug: 'bouquets' },
    { name: 'Head Dresses', tag: 'MAJESTIC GRACE', image: '/images/cat_headdress_birthday.png', slug: 'head-dresses' },
    /*{ name: 'Wedding Collections', tag: 'OPULENT BLOOMS', image: '/images/cat_peonies.png', slug: 'wedding-collections' },*/
    { name: 'Individual Flowers', tag: 'EXOTIC ALLURE', image: '/images/individual.png', slug: 'individual-flowers' },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a]" style={{ fontFamily: 'Inter, Montserrat, system-ui, sans-serif' }}>
      <Navbar isScrolled={isScrolled} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} navItems={navItems} />
      <Hero />
      <CategoryGrid categories={categories} />
      <ExperienceBanner />
      <FeaturedProducts products={productsState} wishlist={wishlist} toggleWishlist={toggleWishlist} />

      <Footer />
    </div>
  );
};

export default GuestUserDashboard;
