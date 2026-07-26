import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Camera, Share2, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrivacyPolicyModal from '../../../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../../../components/TermsOfServiceModal';

const Footer = () => {
  const navigate = useNavigate();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const collectionLinks = [
    { label: "Bouquets", category: "Bouquet" },
    { label: "Head Dresses", category: "Head Dresses" },
    { label: "Individual Flowers", category: "Individual Flowers" }
  ];

  const handleCollectionNavigation = (category) => {
    const params = new URLSearchParams();
    params.set("category", category);
    navigate(`/shop?${params.toString()}`);
  };

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
            <ul className="space-y-3">
              {collectionLinks.map((item) => {
                const params = new URLSearchParams();
                params.set("category", item.category);
                return (
                  <li key={item.label}>
                    <a
                      href={`/shop?${params.toString()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCollectionNavigation(item.category);
                      }}
                      className="font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
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
            <h4 className="font-semibold text-sm tracking-[0.14em] uppercase mb-5 text-[#1a1a1a]/60">Contact Us</h4>
            <ul className="space-y-4 text-xs font-semibold text-[#1a1a1a]/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#8c5e5e] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Redshan Flora,<br />
                  32B, Sir Mohamed Macan Marker Mawatha,<br />
                  Colombo
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#8c5e5e] shrink-0" />
                <a href="tel:+94112345678" className="hover:text-[#8c5e5e] transition-colors duration-300">
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#8c5e5e] shrink-0" />
                <a href="mailto:redshanflora@gmail.com" className="hover:text-[#8c5e5e] transition-colors duration-300">
                  redshanflora@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#d9d2d0]/30 pt-7 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-sm text-[#1a1a1a]/60 font-medium">© 2026 Redshan Flora. Everlasting Elegance.</p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-sm text-[#1a1a1a]/60 font-medium hover:text-[#8c5e5e] transition-colors duration-300 bg-transparent border-0 p-0 cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-sm text-[#1a1a1a]/60 font-medium hover:text-[#8c5e5e] transition-colors duration-300 bg-transparent border-0 p-0 cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  );
};

export default Footer;
