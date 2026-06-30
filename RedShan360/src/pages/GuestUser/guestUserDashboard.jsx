import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ExperienceBanner from './components/ExperienceBanner';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import api from '../../services/api';

import { products } from '../../data/products';

const GuestUserDashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState({});

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
      <FeaturedProducts products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default GuestUserDashboard;
