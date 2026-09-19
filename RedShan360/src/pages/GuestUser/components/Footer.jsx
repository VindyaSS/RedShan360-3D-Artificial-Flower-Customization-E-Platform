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
    <footer id="contact" className="scroll-mt-[80px] bg-[#e9ecef] text-[#212529] py-4 sm:py-5 px-6 md:px-12 lg:px-16 border-t border-[#ced4da]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-3 md:mb-4">
          <div>
            <h4 className="text-lg font-bold mb-1 text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>Redshan Flora</h4>
            <p className="text-[#495057] text-xs font-medium leading-normal">Pioneering the future of botanical décor with hyper-realistic art and immersive digital visualization.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.14em] uppercase mb-1.5 text-[#8c5e5e]">Collections</h4>
            <ul className="space-y-1">
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
                      className="font-medium text-xs text-[#212529] hover:text-[#8c5e5e] transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.14em] uppercase mb-1.5 text-[#8c5e5e]">Company</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/about#our-story" className="font-medium text-xs text-[#212529] hover:text-[#8c5e5e] transition-colors duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about#sustainable-practices" className="font-medium text-xs text-[#212529] hover:text-[#8c5e5e] transition-colors duration-300">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/about#quality-promise" className="font-medium text-xs text-[#212529] hover:text-[#8c5e5e] transition-colors duration-300">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/about#social-impact" className="font-medium text-xs text-[#212529] hover:text-[#8c5e5e] transition-colors duration-300">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[11px] tracking-[0.14em] uppercase mb-1.5 text-[#8c5e5e]">Contact Us</h4>
            <ul className="space-y-1 text-xs font-medium text-[#495057]">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="text-[#8c5e5e] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  32B, Sir Mohamed Macan Marker Mawatha, Colombo
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[#8c5e5e] shrink-0" />
                <a href="tel:+94112345678" className="hover:text-[#8c5e5e] transition-colors duration-300">
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[#8c5e5e] shrink-0" />
                <a href="mailto:redshanflora@gmail.com" className="hover:text-[#8c5e5e] transition-colors duration-300">
                  redshanflora@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ced4da] pt-2.5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#6c757d] font-medium">© 2026 Redshan Flora. Everlasting Elegance.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-[11px] text-[#6c757d] font-medium hover:text-[#8c5e5e] transition-colors duration-300 bg-transparent border-0 p-0 cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-[11px] text-[#6c757d] font-medium hover:text-[#8c5e5e] transition-colors duration-300 bg-transparent border-0 p-0 cursor-pointer"
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
