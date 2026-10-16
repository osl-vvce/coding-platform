import React from 'react';

function Navbar({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  violations,
  timeLeft,
  formatTime,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  assessmentSession,
  isAssessmentActive,
  onEndAssessment
}) {
  return (
    <header className="platform-header">
      <div className="header-brand-container">
        <button
          className="brand-logo-btn"
          onClick={() => setCurrentView('home')}
          aria-label="Go to Home"
        >
          <span className="brand-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
          </span>
          <div className="brand-text">
            <span className="brand-title">CodePlatform</span>
            <span className="brand-badge">Evaluation Sandbox</span>
          </div>
        </button>
      </div>

      <nav className="header-nav" aria-label="Main Navigation">
        <button
          type="button"
          className={`nav-tab ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${currentView === 'contests' || currentView === 'problems' ? 'active' : ''}`}
          onClick={() => setCurrentView('contests')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>Contests</span>
        </button>

        <button
          type="button"
          className={`nav-tab ${currentView === 'submissions' ? 'active' : ''}`}
          onClick={() => setCurrentView('submissions')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Submissions</span>
        </button>

        {!currentUser ? (
          <button
            type="button"
            className={`nav-tab nav-login-btn ${currentView === 'login' ? 'active' : ''}`}
            onClick={() => setCurrentView('login')}
          >
            <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Candidate Profile</span>
          </button>
        ) : (
          <div className="candidate-status-chip">
            <span className="candidate-avatar" aria-hidden="true">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </span>
            <div className="candidate-info">
              <span className="candidate-name">{currentUser.name}</span>
              <span className="candidate-id">{currentUser.role ? `${currentUser.role} (Demo)` : 'Demo Profile'}</span>
            </div>
            <button
              type="button"
              className="btn-signout"
              onClick={onLogout}
              title="Clear candidate demo profile"
              aria-label="Clear demo profile"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </nav>

      <div className="header-actions">
        {currentView === 'editor' && (
          <div className="timer-badge" role="timer" aria-live="polite">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Time Left: <strong>{formatTime(timeLeft)}</strong></span>
          </div>
        )}

        {assessmentSession?.status === 'active' && onEndAssessment && (
          <button
            type="button"
            className="btn-end-assessment-header"
            onClick={onEndAssessment}
            title="End timed assessment session"
            style={{
              padding: '0.35rem 0.65rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            End Assessment
          </button>
        )}

        {violations > 0 && (
          <div className="violations-badge" role="alert" title={`${violations} anti-cheat violation(s) recorded`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Violations: {violations}</span>
          </div>
        )}

        {!isFullscreen ? (
          <button
            type="button"
            className="btn-fullscreen"
            onClick={enterFullscreen}
            title="Enter fullscreen assessment mode"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <span>Fullscreen</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-fullscreen active"
            onClick={exitFullscreen}
            title="Exit fullscreen mode"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            <span>Exit Fullscreen</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
