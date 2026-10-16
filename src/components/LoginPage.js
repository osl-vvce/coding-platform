import React from 'react';
import CandidateLoginCard from './CandidateLoginCard';

function LoginPage({
  setCurrentView,
  currentUser,
  onProfileConfigured,
  onLoginSuccess,
  onLogout
}) {
  const handleProfileConfigured = (profileData) => {
    const callback = onProfileConfigured || onLoginSuccess;
    if (callback) {
      callback(profileData);
    }
    setCurrentView('contests');
  };

  return (
    <div className="login-page-view">
      <div className="login-page-header">
        <button
          type="button"
          className="btn-back-home"
          onClick={() => setCurrentView('home')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Landing Page</span>
        </button>

        <div className="login-header-branding">
          <span className="login-badge">PORTAL ACCESS</span>
          <h2>Candidate Profile & Assessment Gateway</h2>
          <p>Configure your candidate display profile for this proctored evaluation session.</p>
        </div>
      </div>

      <div className="login-card-wrapper">
        <CandidateLoginCard
          currentUser={currentUser}
          onProfileConfigured={handleProfileConfigured}
          onLoginSuccess={handleProfileConfigured}
          onLogout={onLogout}
          onNavigateToContests={() => setCurrentView('contests')}
        />
      </div>

      <div className="login-security-notice">
        <div className="security-notice-inner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <strong>Evaluation Security Notice</strong>
            <p>Your session will be monitored for tab switching, external window navigation, and clipboard activity during timed tests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
