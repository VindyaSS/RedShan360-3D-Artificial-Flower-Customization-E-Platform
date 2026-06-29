import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const emailInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Manage popup open/close transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      
      // Reset forms
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setErrors({});
      setApiError('');
      
      // Lock page body scrolling
      document.body.style.overflow = 'hidden';

      // Autofocus email input
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        // Restore page body scrolling
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

      // Trap Tab focus
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

  // Handle outside overlay clicks
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Submit handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      // Save token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Close modal and unlock body scrolling
      onClose();
      document.body.style.overflow = '';

      // Dispatch event to update navbar instantly
      window.dispatchEvent(new Event('auth-updated'));

    } catch (error) {
      console.error('Modal login error:', error);
      const msg = error.response?.data?.message || 'Invalid email or password';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccountClick = () => {
    onClose();
    document.body.style.overflow = '';
    navigate('/signup');
  };

  const handleForgotPasswordClick = () => {
    onClose();
    document.body.style.overflow = '';
    navigate('/forgot-password');
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
        className={`bg-white w-full max-w-[95%] sm:max-w-[90%] md:max-w-[420px] max-h-[90vh] rounded-[12px] p-6 md:p-8 flex flex-col justify-start relative overflow-y-auto text-left transition-all duration-200 ease-in-out ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,.18)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-[28px] font-bold text-[#1a1a1a] font-sans tracking-tight leading-none">
            Login
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors"
            aria-label="Close modal"
          >
            <X size={26} strokeWidth={2} />
          </button>
        </div>

        {/* API Error Box */}
        {apiError && (
          <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 p-3 rounded-sm mb-5 text-red-700 text-xs font-semibold">
            <AlertCircle size={15} className="shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleLoginSubmit} noValidate className="flex-1 flex flex-col justify-between">
          <div>
            {/* Field 1: Email Address */}
            <div className="mb-5">
              <label htmlFor="modal-email" className="block text-sm font-semibold text-[#1a1a1a] mb-2 font-sans">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="modal-email"
                ref={emailInputRef}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-md border text-sm font-sans focus:outline-none transition-colors placeholder:text-gray-400 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#d9d2d0] focus:border-[#1a1a1a]'
                }`}
                style={{ height: '48px' }}
              />
              {errors.email && (
                <span className="text-[11px] text-red-500 mt-1 block font-semibold">{errors.email}</span>
              )}
            </div>

            {/* Field 2: Password */}
            <div className="mb-6">
              <label htmlFor="modal-password" className="block text-sm font-semibold text-[#1a1a1a] mb-2 font-sans">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="modal-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-md border text-sm font-sans focus:outline-none transition-colors pr-12 placeholder:text-gray-400 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#d9d2d0] focus:border-[#1a1a1a]'
                  }`}
                  style={{ height: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a1a1a] transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-500 mt-1 block font-semibold">{errors.password}</span>
              )}
            </div>

            {/* Login Button with Solid Pink Shadow Offset */}
            <div className="relative mt-6 mb-4">
              <div className="absolute inset-0 bg-[#e88d9d] rounded-[8px] translate-x-[4px] translate-y-[4px]" />
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-[8px] border border-black hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                style={{ height: '48px' }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'LOGIN'
                )}
              </button>
            </div>

            {/* Forgot your password */}
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-xs text-[#1a1a1a] hover:underline font-bold transition-all"
                style={{ textDecoration: 'underline' }}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Create Account Button with Solid Pink Shadow Offset */}
          <div className="relative mt-2">
            <div className="absolute inset-0 bg-[#e88d9d] rounded-[8px] translate-x-[4px] translate-y-[4px]" />
            <button
              type="button"
              onClick={handleCreateAccountClick}
              className="relative w-full py-3.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-[8px] border-2 border-black hover:bg-[#faf6f7] transition-all duration-200 flex items-center justify-center"
              style={{ height: '48px' }}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
