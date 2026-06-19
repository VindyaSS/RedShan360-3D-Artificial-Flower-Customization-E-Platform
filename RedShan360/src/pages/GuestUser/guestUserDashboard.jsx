import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ExperienceBanner from './components/ExperienceBanner';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

import { products } from '../../data/products';

const GuestUserDashboard = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('redshan360_wishlist');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('redshan360_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
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
