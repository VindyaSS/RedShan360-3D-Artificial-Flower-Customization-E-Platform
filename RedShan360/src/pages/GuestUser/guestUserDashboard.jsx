import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ExperienceBanner from './components/ExperienceBanner';
import FeaturedProducts from './components/FeaturedProducts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

const GuestUserDashboard = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  const products = [
    {
      id: 1,
      title: 'The Crimson Muse',
      description: 'Signature silk roses & velvet anemones',
      price: '$149.00',
      image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&h=1200&fit=crop',
    },
    {
      id: 2,
      title: 'Serenity White',
      description: "Premium calla lilies & baby's breath",
      price: '$185.00',
      image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=900&h=1200&fit=crop',
      badge: 'BESTSELLER',
    },
    {
      id: 3,
      title: 'Wild Hearth',
      description: 'Hand-finished silk & dried textures',
      price: '$120.00',
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=900&h=1200&fit=crop',
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
