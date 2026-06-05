import React from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = ({ isScrolled, mobileMenuOpen, setMobileMenuOpen, navItems }) => {
  return (
    <nav
      className={`fixed top-0 w-full z-50 h-[80px] transition-all duration-300 ${
        isScrolled ? 'bg-[#faf8f6]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-[80px] gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
              RedShan<span className="text-[#8c5e5e] italic font-normal">360</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 relative ${
                  item === 'Home'
                    ? 'text-[#8c5e5e] after:content-[\'\'] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[1.5px] after:bg-[#8c5e5e]'
                    : 'text-[#1a1a1a]/75 hover:text-[#8c5e5e]'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f4f0ed] rounded-sm px-4 py-2 w-60 border border-[#1a1a1a]/5">
              <Search size={14} className="text-[#1a1a1a]/60" />
              <input
                type="text"
                placeholder="Search arrangements..."
                className="w-full bg-transparent outline-none text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/45"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300" aria-label="favorite">
              <Heart size={18} className="text-[#1a1a1a]" />
            </button>
            <button className="relative p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300" aria-label="shopping_cart">
              <ShoppingCart size={18} className="text-[#1a1a1a]" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center px-1">2</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#f4f0ed] transition-colors duration-300" aria-label="person">
              <User size={18} className="text-[#1a1a1a]" />
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="transition-colors duration-300 text-[#1a1a1a]" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-4 bg-[#faf8f6] border-t border-gray-100 px-4 text-left">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm uppercase tracking-widest text-[#1a1a1a] hover:text-[#8c5e5e] font-semibold" onClick={() => setMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button className="p-2 rounded-full bg-[#f4f0ed]" aria-label="Search"><Search size={18} /></button>
              <button className="p-2 rounded-full bg-[#f4f0ed]" aria-label="Wishlist"><Heart size={18} /></button>
              <button className="relative p-2 rounded-full bg-[#f4f0ed]" aria-label="Cart"><ShoppingCart size={18} /><span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#8c5e5e] text-[9px] text-white font-semibold flex items-center justify-center">2</span></button>
              <button className="p-2 rounded-full bg-[#f4f0ed]" aria-label="Profile"><User size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
