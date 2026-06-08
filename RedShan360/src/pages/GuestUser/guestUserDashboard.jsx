import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ExperienceBanner from './components/ExperienceBanner';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

import crimsonMuse from '../../../public/images/crimson_silk_peony.jpg';
import serenityWhite from '../../../public/images/serenity_white.jpg';
import wildHearth from '../../../public/images/wild_hearth.jpg';

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

  const products = [
    {
      id: 1,
      title: 'The Crimson Muse',
      description: 'Signature silk roses & velvet anemones',
      price: '$149.00',
      image: crimsonMuse,
    },
    {
      id: 2,
      title: 'Serenity White',
      description: "Premium calla lilies & baby's breath",
      price: '$185.00',
      image: serenityWhite,
      badge: 'BESTSELLER',
    },
    {
      id: 3,
      title: 'Wild Hearth',
      description: 'Hand-finished silk & dried textures',
      price: '$120.00',
      image: wildHearth,
    },
  ];

  const categories = [
    { name: 'Roses', tag: 'THE ETERNAL MUSE', image: '/images/cat_roses.png' },
    { name: 'Lilies', tag: 'MAJESTIC GRACE', image: '/images/cat_lilies.png' },
    { name: 'Peonies', tag: 'OPULENT BLOOMS', image: '/images/cat_peonies.png' },
    { name: 'Orchids', tag: 'EXOTIC ALLURE', image: '/images/cat_orchids.png' },
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
