import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import api from '../../services/api';
import PasswordInput from '../../components/PasswordInput';
import PrivacyPolicyModal from '../../components/PrivacyPolicyModal';
import TermsOfServiceModal from '../../components/TermsOfServiceModal';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Steps: 1 (Email Input), 2 (OTP Input), 3 (New Password), 4 (Success)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  // State for timers
  const [otpExpiryTime, setOtpExpiryTime] = useState(300); // 5 mins in seconds
  const [resendCooldown, setResendCooldown] = useState(60); // 60s cooldown
  
  // Modals and API states
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  
  // Password validation checks
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecial: false,
  });

  // Reference for interval timers
  const timerRef = useRef(null);
  const cooldownRef = useRef(null);

  // Monitor password input to update password criteria in real-time
  useEffect(() => {
    setPasswordCriteria({
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasDigit: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newPassword),
    });
  }, [newPassword]);

  // Timers for Step 2
  useEffect(() => {
    if (step === 2) {
      // 5-min OTP Expiry countdown
      setOtpExpiryTime(300);
      timerRef.current = setInterval(() => {
        setOtpExpiryTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 60s local Resend Cooldown
      setResendCooldown(60);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [step]);

  // Format timer values to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Submit Email to Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
      await api.post('/api/auth/forgot-password/request', {
        email
      });
      setApiSuccess('If an account exists for this email, a verification code has been sent.');
      setStep(2);
    } catch (err) {
      console.error('Request OTP error:', err);
      const msg = err.response?.data?.message || 'Failed to process request. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP trigger (Step 2)
  const handleResendOtp = async () => {
    setApiError('');
    setApiSuccess('');
    setLoading(true);

    try {
      await api.post('/api/auth/forgot-password/request', {
        email
      });
      setApiSuccess('A new OTP code has been sent.');
      
      // Reset cooldown timer on success
      setResendCooldown(60);
      clearInterval(cooldownRef.current);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Reset expiry timer
      setOtpExpiryTime(300);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setOtpExpiryTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Resend OTP error:', err);
      const msg = err.response?.data?.message || 'Failed to resend OTP. Please wait and try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP for Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^[0-9]{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be exactly 6 digits';
    }

    if (otpExpiryTime === 0) {
      setApiError('The OTP code has expired. Please request a new one.');
      return;
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
      const response = await api.post('/api/auth/forgot-password/verify', {
        email,
        otp
      });
      if (response.data?.resetToken) {
        setResetToken(response.data.resetToken);
        setStep(3);
      } else {
        setApiError('Verification failed. Invalid token received.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      const msg = err.response?.data?.message || 'Invalid OTP or email';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password Submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate password strength criteria locally
    const metAllCriteria = Object.values(passwordCriteria).every(Boolean);
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!metAllCriteria) {
      newErrors.newPassword = 'Password does not meet complexity requirements';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required';
    } else if (newPassword !== confirmPassword) {
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
      await api.post('/api/auth/forgot-password/reset', {
        resetToken,
        newPassword,
        confirmPassword
      });
      setStep(4);
    } catch (err) {
      console.error('Reset password error:', err);
      const msg = err.response?.data?.message || 'Failed to reset password. Please request a new OTP.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      {/* HEADER */}
      <header className="forgot-header">
        <div className="header-left">
          <a href="/" className="logo-text">Redshan Flora</a>
        </div>
      </header>

      {/* MAIN SPLIT SECTION */}
      <main className="forgot-main">
        {/* Left Side Visual Panel */}
        <div className="forgot-visual-panel">
          <div className="glass-overlay">
            <h1 className="glass-title">Curated Botanicals.</h1>
            <p className="glass-quote">
              "Step into a world where artificial flora meets everlasting elegance."
            </p>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="forgot-form-panel">
          <div className="forgot-form-card">
            <div className="step-indicator">
              <span className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}></span>
              <span className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}></span>
              <span className={`step-dot ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}`}></span>
              <span className={`step-dot ${step === 4 ? 'completed' : ''}`}></span>
            </div>

            {/* Title headers depend on steps */}
            {step === 1 && (
              <>
                <h2 className="form-title">Reset Password</h2>
                <p className="form-subtitle">
                  Enter your registered email address below to receive an OTP.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="form-title">Verify OTP</h2>
                <p className="form-subtitle">
                  We've sent a 6-digit verification code to {email}.
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="form-title">Create Password</h2>
                <p className="form-subtitle">
                  Please enter and confirm your new secure password.
                </p>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="form-title">All Done!</h2>
                <p className="form-subtitle">
                  Your password has been reset successfully.
                </p>
              </>
            )}

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

            {/* STEP 1: REQUEST OTP */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} noValidate>
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
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <button type="submit" className="login-btn" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                  {loading ? 'Sending OTP...' : 'Send OTP Code'}
                  {!loading && (
                    <span className="login-btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  )}
                </button>

                <div className="register-container" style={{ marginTop: '24px' }}>
                  Remembered your password? <a href="/login" className="register-link">Back to Login</a>
                </div>
              </form>
            )}

            {/* STEP 2: VERIFY OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="otp-input">Verification Code (OTP)</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="otp-input"
                      className="form-input"
                      placeholder="••••••"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={errors.otp ? { borderColor: '#d32f2f' } : {}}
                      disabled={loading}
                    />
                  </div>
                  {errors.otp && (
                    <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                      {errors.otp}
                    </span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span className="timer-text">
                      Expires in: {formatTime(otpExpiryTime)}
                    </span>
                    <div>
                      {resendCooldown > 0 ? (
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          Resend in {resendCooldown}s
                        </span>
                      ) : (
                        <button type="button" onClick={handleResendOtp} className="resend-btn" disabled={loading}>
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                  {loading ? 'Verifying...' : 'Verify OTP Code'}
                  {!loading && (
                    <span className="login-btn-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  )}
                </button>

                <div className="register-container" style={{ marginTop: '24px' }}>
                  Entered wrong email? <button type="button" onClick={() => setStep(1)} className="resend-btn" style={{ textDecoration: 'underline' }}>Change Email</button>
                </div>
              </form>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate>
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="new-password">New Password</label>
                  </div>
                  <div className="input-wrapper">
                    <PasswordInput
                      id="new-password"
                      className="form-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={errors.newPassword ? { borderColor: '#d32f2f' } : {}}
                      disabled={loading}
                    />
                  </div>
                  {errors.newPassword && (
                    <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                      {errors.newPassword}
                    </span>
                  )}

                  {/* Real-time Password Strength Criteria */}
                  <div className="strength-indicator">
                    <div className="strength-text">Password Strength Requirements:</div>
                    <ul className="strength-requirements">
                      <li className={`requirement-item ${passwordCriteria.minLength ? 'met' : ''}`}>
                        <span className="requirement-icon">
                          {passwordCriteria.minLength ? '✓' : '○'}
                        </span>
                        Minimum 8 characters
                      </li>
                      <li className={`requirement-item ${passwordCriteria.hasUppercase ? 'met' : ''}`}>
                        <span className="requirement-icon">
                          {passwordCriteria.hasUppercase ? '✓' : '○'}
                        </span>
                        At least one uppercase letter (A-Z)
                      </li>
                      <li className={`requirement-item ${passwordCriteria.hasLowercase ? 'met' : ''}`}>
                        <span className="requirement-icon">
                          {passwordCriteria.hasLowercase ? '✓' : '○'}
                        </span>
                        At least one lowercase letter (a-z)
                      </li>
                      <li className={`requirement-item ${passwordCriteria.hasDigit ? 'met' : ''}`}>
                        <span className="requirement-icon">
                          {passwordCriteria.hasDigit ? '✓' : '○'}
                        </span>
                        At least one digit (0-9)
                      </li>
                      <li className={`requirement-item ${passwordCriteria.hasSpecial ? 'met' : ''}`}>
                        <span className="requirement-icon">
                          {passwordCriteria.hasSpecial ? '✓' : '○'}
                        </span>
                        At least one special character (@$!%*?&#)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                  </div>
                  <div className="input-wrapper">
                    <PasswordInput
                      id="confirm-password"
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={errors.confirmPassword ? { borderColor: '#d32f2f' } : {}}
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <button type="submit" className="login-btn" disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
                  {loading ? 'Updating Password...' : 'Reset Password'}
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
            )}

            {/* STEP 4: SUCCESS VIEW */}
            {step === 4 && (
              <div className="success-checkmark-wrapper">
                <svg className="success-icon-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" fill="#e8f5e9"></circle>
                  <polyline points="9 11 12 14 17 9" stroke="#2e7d32" strokeWidth="2.5"></polyline>
                </svg>
                <p style={{ fontSize: '15px', color: '#555', marginBottom: '24px' }}>
                  Your password has been successfully updated. You can now use your new password to sign in to your account.
                </p>
                <button type="button" onClick={() => navigate('/login')} className="login-btn">
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="forgot-footer">
        <div className="footer-left">
          <a href="/" className="logo-text">Redshan Flora</a>
          <span className="copyright-text">© 2024 Redshan Flora. Everlasting Elegance.</span>
        </div>

        <div className="footer-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">FACEBOOK</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">INSTAGRAM</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">PINTEREST</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">TWITTER</a>
        </div>

        <div className="footer-right">
          <div className="footer-links-row" style={{ display: 'flex', gap: '16px' }}>
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
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
