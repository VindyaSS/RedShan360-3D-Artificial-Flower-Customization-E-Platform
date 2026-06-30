import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Lock body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        ref={modalRef}
        className="bg-[#fcf9f8] w-full max-w-lg rounded-2xl border border-[#d9d2d0]/30 shadow-2xl p-6 md:p-8 relative flex flex-col justify-start text-left"
        style={{
          boxSizing: 'border-box',
          animation: 'scaleUpFade 0.2s ease-out'
        }}
      >
        {/* Style block for local animations */}
        <style>{`
          @keyframes scaleUpFade {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-shrink-0">
          <div className="flex items-center gap-2 text-[#8c5e5e]">
            <ShieldCheck size={22} />
            <h3 className="text-xl font-bold text-[#1a1a1a] font-playfair" style={{ fontFamily: 'Playfair Display, serif' }}>
              Privacy Policy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1a1a1a]/60 hover:text-[#8c5e5e] hover:bg-[#f4f0ed] rounded-full transition-all"
            aria-label="Close privacy policy"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-4 text-xs md:text-sm text-[#1a1a1a]/75 leading-relaxed font-sans font-normal">
          <p>
            At RedshanFlora, we value your privacy. We collect only the information necessary to provide our services, such as your name, email, phone number, and delivery address.
          </p>
          <p>
            Your personal information is used to process orders, improve your shopping experience, and provide customer support. We do not sell or share your personal data with third parties except when required to complete your order or comply with legal obligations.
          </p>
          <p>
            We take reasonable measures to protect your information and ensure its security. By using our website, you agree to the collection and use of your information in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Action button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all duration-300 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrivacyPolicyModal;
