import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user in UnauthorizedPage:', e);
    }
  }

  const handleGoDashboard = () => {
    const role = user?.role ? String(user.role).toUpperCase() : '';
    if (role === 'ADMIN') {
      navigate('/adminDashboard');
    } else if (role === 'MANAGER') {
      navigate('/managerOverview');
    } else if (role === 'EMPLOYEE') {
      navigate('/employeeDashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          You do not have permission to access this page. Please make sure you are logged in with the appropriate user privileges.
        </p>
        <div style={styles.buttonGroup}>
          <button onClick={handleGoDashboard} style={styles.primaryBtn}>
            Return to Dashboard / Home
          </button>
          <button onClick={() => navigate('/login')} style={styles.secondaryBtn}>
            Switch Account / Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
    color: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '40px 32px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px auto'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px'
  },
  message: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '32px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryBtn: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
  },
  secondaryBtn: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    border: '1px solid rgba(203, 213, 225, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
