import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login_Page.css';
import api from '../../services/api';
import PasswordInput from '../../components/PasswordInput';
import PrivacyPolicyModal from '../../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../../components/TermsOfServiceModal';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setApiSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      setApiSuccess('Successfully logged in!');
      console.log('Login successful:', response.data);

      if (response.data) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Ensure id compatibility mapping alongside other fields
        const userData = {
          ...response.data,
          id: response.data.userId
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirect based on user role
      let redirectPath = from;
      const role = response.data?.role;
      if (role === 'CUSTOMER') {
        redirectPath = (from && from !== '/' && from !== '/login') ? from : '/guestUserDashboard';
      } else if (role === 'EMPLOYEE') {
        redirectPath = '/employeeDashboard';
      } else if (role === 'MANAGER') {
        redirectPath = '/managerOverview';
      } else if (role === 'ADMIN') {
        redirectPath = '/adminDashboard';
      }

      setTimeout(() => {
        window.dispatchEvent(new Event('auth-updated'));
        navigate(redirectPath, { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Invalid email or password';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* HEADER */}
      <header className="login-header">
        <div className="header-left">
          <a href="/" className="logo-text">Redshan Flora</a>
        </div>

        {/*<nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/shop" className="nav-link">Shop</a>
          <a href="/customization" className="nav-link">Customization</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
        
        <div className="header-right">
          <div className="search-bar-container">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
              id="header-search"
            />
          </div>
          
          <div className="header-icons">
            <button className="icon-btn" aria-label="Shopping Cart" id="btn-cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
            <button className="icon-btn" aria-label="Wishlist" id="btn-wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="icon-btn" aria-label="User Profile" id="btn-profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>*/}
      </header>

      {/* MAIN SPLIT SECTION */}
      <main className="login-main">
        {/* Left Side Visual Panel */}
        <div className="login-visual-panel">
          <div className="glass-overlay">
            <h1 className="glass-title">Curated Botanicals.</h1>
            <p className="glass-quote">
              "Step into a world where artificial flora meets everlasting elegance."
            </p>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="login-form-panel">
          <div className="login-form-card">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">
              Please enter your credentials to access your curated collection.
            </p>

            {apiError && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', borderLeft: '4px solid #d32f2f', textAlign: 'left' }}>
                {apiError}
              </div>
            )}
            {apiSuccess && (
              <div style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', borderLeft: '4px solid #2e7d32', textAlign: 'left' }}>
                {apiSuccess}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* Email Address */}
              <div className="form-group">
                <div className="label-row">
                  <label className="form-label" htmlFor="email-input">Email Address</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email-input"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={errors.email ? { borderColor: '#d32f2f' } : {}}
                  />
                </div>
                {errors.email && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="label-row">
                  <label className="form-label" htmlFor="password-input">Password</label>
                  <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
                </div>
                <div className="input-wrapper">
                  <PasswordInput
                    id="password-input"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={errors.password ? { borderColor: '#d32f2f' } : {}}
                  />
                </div>
                {errors.password && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="remember-me-container">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  className="checkbox-custom"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me-checkbox" className="remember-me-label">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-btn" id="btn-login-submit" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                {loading ? 'Logging in...' : 'Login to Account'}
                {!loading && (
                  <span className="login-btn-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider-container">
              <div className="divider-line"></div>
              <span className="divider-text">Or continue with</span>
              <div className="divider-line"></div>
            </div>

            {/* Social Logins */}
            {/*<div className="social-buttons-container">
              <button className="social-btn" id="btn-google-login">
                <span className="social-btn-logo">
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.78 2.16c1.63-1.5 2.57-3.71 2.57-6.3a8.1 8.1 0 0 0-.21-2.19z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.78-2.16c-.77.52-1.76.83-2.92.83-2.25 0-4.15-1.52-4.83-3.57L1.58 13.06A8.99 8.99 0 0 0 9 18z" />
                    <path fill="#FBBC05" d="M4.17 10.92A5.39 5.39 0 0 1 3.86 9c0-.67.11-1.32.31-1.92L1.31 5.3A8.99 8.99 0 0 0 1.31 12.7l2.86-1.78z" />
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.97 11.43 0 9 0 5.46 0 2.45 2.03 1.31 5.3l2.86 1.78C4.85 5.1 6.75 3.58 9 3.58z" />
                  </svg>
                </span>
                Google
              </button>
              <button className="social-btn" id="btn-apple-login">
                <span className="social-btn-logo">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6 9.4c0-2.3 1.9-3.4 1.9-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.9-.8-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.3 1.1 0 1.6-.7 2.9-.7s1.8.7 2.9.7c1.2 0 2-.1 2.8-1.2.9-1.3 1.2-2.6 1.3-2.7 0 0-2.4-.9-2.4-3.7zM12.1 2.5c.6-.7 1-1.8.9-2.8-.9 0-2 .6-2.6 1.3-.5.6-.9 1.7-.8 2.7 1 .1 1.9-.5 2.5-1.2z" />
                  </svg>
                </span>
                Apple
              </button>
            </div>*/}

            {/* Create Account Link */}
            <div className="register-container">
              New to Redshan Flora? <a href="/register" className="register-link">Create Account</a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="login-footer">
        <div className="footer-left">
          <a href="/" className="logo-text">Redshan Flora</a>
          <span className="copyright-text">© 2026 Redshan Flora. Everlasting Elegance.</span>
        </div>

        {/*<div className="footer-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">FACEBOOK</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">INSTAGRAM</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">PINTEREST</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">TWITTER</a>
        </div>*/}

        <div className="footer-right">
          <div className="footer-links-row">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="footer-link"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
            >
              Privacy Policy
            </button>
            <span style={{ color: '#555' }}>|</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="footer-link"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
            >
              Terms of Service
            </button>
          </div>
          <div className="secure-checkout-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 11 2 2 4-4" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
