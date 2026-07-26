import React from 'react';
import { Trophy, Camera, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#f4f0ed] text-[#1a1a1a] py-20 px-5 md:px-10 lg:px-14 border-t border-[#d9d2d0]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div>
            <h4 className="text-2xl font-medium mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Redshan Flora</h4>
            <p className="text-[#1a1a1a]/70 font-medium leading-relaxed">Pioneering the future of botanical décor with hyper-realistic art and immersive digital visualization.</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"><Trophy size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"><Camera size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm inline-flex items-center justify-center hover:scale-105 transition-transform duration-300"><Share2 size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-[0.14em] uppercase mb-5 text-[#1a1a1a]/60">Collections</h4>
            <ul className="space-y-3">{['Silk Signature', 'Velvet Luxe', 'Everlasting Dried', 'Seasonal Limited'].map((item) => (
              <li key={item}><a href={`#${item.toLowerCase()}`} className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">{item}</a></li>
            ))}</ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-[0.14em] uppercase mb-5 text-[#1a1a1a]/60">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about#our-story" className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about#sustainable-practices" className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/about#quality-promise" className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/about#social-impact" className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-[0.14em] uppercase mb-5 text-[#1a1a1a]/60">Support</h4>
            <ul className="space-y-3">{['Care Guide', 'Shipping & Returns', 'FAQ', 'Contact Us'].map((item) => (
              <li key={item}><a href="#" className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300">{item}</a></li>
            ))}</ul>
          </div>
        </div>

        <div className="border-t border-[#d9d2d0]/30 pt-7 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-sm text-[#1a1a1a]/60 font-medium">© 2026 Redshan Flora. Everlasting Elegance.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-sm text-[#1a1a1a]/60 font-medium hover:text-[#8c5e5e] transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-sm text-[#1a1a1a]/60 font-medium hover:text-[#8c5e5e] transition-colors duration-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
