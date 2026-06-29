import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Lock } from 'lucide-react';

const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const signInBtnRef = useRef(null);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Manage open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      
      // Lock page body scrolling
      document.body.style.overflow = 'hidden';

      // Autofocus first primary button
      const timer = setTimeout(() => {
        signInBtnRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        // Restore scrolling
        document.body.style.overflow = '';
      }, 200);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, shouldRender]);

  // Restore scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard Trap Focus & Escape Key Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      // Close on ESC
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap Tab
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle outside click overlay close
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleAction = (route) => {
    onClose();
    document.body.style.overflow = '';
    navigate(route);
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[9999] bg-[#000000]/45 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200 ease-in-out ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered Modal Container */}
      <div
        ref={modalRef}
        className={`bg-white w-full max-w-[95%] sm:max-w-[90%] md:max-w-[420px] rounded-[12px] p-6 md:p-8 flex flex-col justify-start relative text-center transition-all duration-200 ease-in-out ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,.18)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#1a1a1a]/65 hover:text-[#8c5e5e] transition-colors"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto bg-[#8c5e5e]/10 p-3.5 rounded-full w-fit mb-5">
          <Lock size={26} className="text-[#8c5e5e]" />
        </div>

        {/* Title */}
        <h3
          className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3 tracking-tight font-playfair"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Sign In Required
        </h3>

        {/* Message */}
        <p className="text-xs md:text-sm text-[#1a1a1a]/65 leading-relaxed mb-8 px-2 md:px-4 font-normal">
          Please sign in or create an account to use this feature.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5">
          {/* Primary: Sign In */}
          <button
            ref={signInBtnRef}
            onClick={() => handleAction('/signin')}
            className="w-full py-3 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-300"
            style={{ height: '44px' }}
          >
            Sign In
          </button>

          {/* Secondary: Create Account */}
          <button
            onClick={() => handleAction('/signup')}
            className="w-full py-3 border border-[#d9d2d0] hover:border-[#8c5e5e] bg-white hover:bg-[#8c5e5e]/5 text-[#1a1a1a]/85 hover:text-[#8c5e5e] text-xs font-bold uppercase tracking-wider rounded-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            style={{ height: '44px' }}
          >
            Create Account
          </button>

          {/* Text Link: Continue Browsing */}
          <button
            onClick={onClose}
            className="mt-3 text-xs text-[#1a1a1a]/55 hover:text-[#8c5e5e] hover:underline font-bold transition-all uppercase tracking-wider"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginRequiredModal;
