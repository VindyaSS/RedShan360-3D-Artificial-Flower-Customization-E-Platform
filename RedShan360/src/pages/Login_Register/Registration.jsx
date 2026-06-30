import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Registration.css';
import api from '../../services/api';
import PasswordInput from '../../components/PasswordInput';
import PrivacyPolicyModal from '../../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../../components/TermsOfServiceModal';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{9,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await api.post('/api/auth/register', {
        name: `${firstName} ${lastName}`.trim(),
        email: normalizedEmail,
        phone,
        password
      });

      setApiSuccess('Registration successful! Redirecting to login...');
      console.log('Registration success:', response.data);

      setTimeout(() => {
        navigate('/login', { state: { from } });
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page-wrapper">
      {/* HEADER */}
      <header className="registration-header">
        <div className="header-left">
          <a href="/" className="logo-text">RedShan360</a>
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
              id="registration-header-search"
            />
          </div>

          <div className="header-icons">
            <button className="icon-btn" aria-label="Shopping Cart" id="registration-btn-cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
            <button className="icon-btn" aria-label="Wishlist" id="registration-btn-wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="icon-btn" aria-label="User Profile" id="registration-btn-profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>*/}
      </header>

      {/* MAIN SPLIT SECTION */}
      <main className="registration-main">
        {/* Left Side Visual Panel */}
        <div className="registration-visual-panel">
          <div className="glass-overlay">
            <h1 className="glass-title">Everlasting Elegance.</h1>
            <p className="glass-quote">CURATION REDEFINED</p>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="registration-form-panel">
          <div className="registration-form-card">
            <h2 className="form-title">Join the Garden.</h2>
            <p className="form-subtitle">
              Create your account to experience a world of botanical beauty and bespoke curation.
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

            <form onSubmit={handleRegister} noValidate>
              {/* First Name & Last Name (Side by Side) */}
              <div className="form-row">
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="firstName-input">First Name</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="firstName-input"
                      className="form-input"
                      placeholder="Rose"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={errors.firstName ? { borderColor: '#d32f2f' } : {}}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="validation-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="lastName-input">Last Name</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="lastName-input"
                      className="form-input"
                      placeholder="Sterling"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={errors.lastName ? { borderColor: '#d32f2f' } : {}}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="validation-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

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
                    placeholder="rose@elegance.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={errors.email ? { borderColor: '#d32f2f' } : {}}
                  />
                </div>
                {errors.email && (
                  <span className="validation-error">{errors.email}</span>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <div className="label-row">
                  <label className="form-label" htmlFor="phone-input">Phone Number</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    id="phone-input"
                    className="form-input"
                    placeholder="0771234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={errors.phone ? { borderColor: '#d32f2f' } : {}}
                  />
                </div>
                {errors.phone && (
                  <span className="validation-error">{errors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <div className="label-row">
                  <label className="form-label" htmlFor="address-input">Address</label>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="address-input"
                    className="form-input"
                    placeholder="123 Botanical Street, Garden City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={errors.address ? { borderColor: '#d32f2f' } : {}}
                  />
                </div>
                {errors.address && (
                  <span className="validation-error">{errors.address}</span>
                )}
              </div>

              {/* Password & Confirm Password (Side by Side) */}
              <div className="form-row">
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="password-input">Password</label>
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
                    <span className="validation-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="confirmPassword-input">Confirm Password</label>
                  </div>
                  <div className="input-wrapper">
                    <PasswordInput
                      id="confirmPassword-input"
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={errors.confirmPassword ? { borderColor: '#d32f2f' } : {}}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="validation-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* Register Button */}
              <button type="submit" className="registration-btn" id="btn-register-submit" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                {loading ? 'Registering...' : 'Register'}
                {!loading && (
                  <span className="registration-btn-arrow">
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
              <span className="divider-text">Already a member?</span>
              <div className="divider-line"></div>
            </div>

            {/* Back to Login Link */}
            <div className="login-link-container">
              <a href="/login" className="login-link">Login to your account &rarr;</a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="registration-footer">
        <div className="footer-left">
          <a href="/" className="logo-text">RedShan360</a>
          <span className="copyright-text">© 2024 RedShan360. Everlasting Elegance. Crafting botanical wonders for the modern sanctuary.</span>
        </div>

        <div className="footer-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">FACEBOOK</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">INSTAGRAM</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">PINTEREST</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">TWITTER</a>
        </div>

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
