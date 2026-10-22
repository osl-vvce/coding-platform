import React from 'react';
import CandidateLoginCard from './CandidateLoginCard';

function LandingPage({
  setCurrentView,
  currentUser,
  onProfileConfigured,
  onLoginSuccess,
  onLogout,
  violations,
  problemsCount = 2,
  assessmentSession,
  onStartAssessment,
  onStartPractice
}) {
  const scrollToAuth = () => {
    const el = document.getElementById('auth-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('#candidate-name');
      if (input) input.focus();
    } else {
      setCurrentView('login');
    }
  };

  const scrollToRules = () => {
    const el = document.getElementById('rules-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-grid">
          {/* Left Column: Platform Value Proposition */}
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span className="live-status-dot" aria-hidden="true"></span>
              <span>TIMED ASSESSMENTS • DOCKER SANDBOX (BACKEND) • INTEGRITY PREVIEW</span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              Coding Evaluations & Real-Time Sandboxes
            </h1>

            <p className="hero-description">
              A distraction-free environment for algorithm practice, technical evaluations, and timed competitions. Real-time feedback across 5 runtime environments with client-side integrity controls and optional Docker container isolation.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-primary hero-btn"
                onClick={() => {
                  if (onStartAssessment) {
                    onStartAssessment('sample-contest-1');
                  } else {
                    setCurrentView('contests');
                  }
                }}
              >
                <span>Start Timed Assessment</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="btn-secondary hero-btn"
                onClick={() => {
                  if (onStartPractice) {
                    onStartPractice(0);
                  } else {
                    setCurrentView('editor');
                  }
                }}
              >
                <span>Practice Mode</span>
              </button>

              {!currentUser ? (
                <button
                  type="button"
                  className="btn-ghost hero-btn"
                  onClick={scrollToAuth}
                >
                  <span>Profile Setup</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-ghost hero-btn"
                  onClick={() => setCurrentView('contests')}
                >
                  <span>Browse Contests</span>
                </button>
              )}

              <button
                type="button"
                className="btn-ghost hero-btn"
                onClick={scrollToRules}
              >
                <span>Integrity Rules</span>
              </button>
            </div>

            {/* Platform Metrics / Key Specs */}
            <div className="platform-specs-strip">
              <div className="spec-item">
                <span className="spec-val">5</span>
                <span className="spec-label">Language Runtimes</span>
              </div>
              <div className="spec-divider" aria-hidden="true"></div>
              <div className="spec-item">
                <span className="spec-val">&lt; 2.0s</span>
                <span className="spec-label">Sandbox Time Limit</span>
              </div>
              <div className="spec-divider" aria-hidden="true"></div>
              <div className="spec-item">
                <span className="spec-val">Supported</span>
                <span className="spec-label">Docker Sandbox</span>
              </div>
              <div className="spec-divider" aria-hidden="true"></div>
              <div className="spec-item">
                <span className="spec-val">Preview</span>
                <span className="spec-label">Integrity Controls</span>
              </div>
            </div>
          </div>

          {/* Right Column: Candidate Access / Login Card */}
          <div className="hero-auth-pane" id="auth-section">
            <CandidateLoginCard
              currentUser={currentUser}
              onProfileConfigured={onProfileConfigured || onLoginSuccess}
              onLoginSuccess={onLoginSuccess}
              onLogout={onLogout}
              onNavigateToContests={() => setCurrentView('contests')}
            />
          </div>
        </div>
      </section>

      {/* Supported Runtimes Strip */}
      <section className="runtimes-strip" aria-label="Supported Languages">
        <span className="runtimes-label">Supported Judge Environments:</span>
        <div className="runtimes-list">
          <span className="runtime-tag python">
            <span className="tag-dot" aria-hidden="true"></span> Python 3
          </span>
          <span className="runtime-tag java">
            <span className="tag-dot" aria-hidden="true"></span> Java (Temurin JDK)
          </span>
          <span className="runtime-tag cpp">
            <span className="tag-dot" aria-hidden="true"></span> C++17 (GCC)
          </span>
          <span className="runtime-tag c">
            <span className="tag-dot" aria-hidden="true"></span> C (GCC)
          </span>
          <span className="runtime-tag js">
            <span className="tag-dot" aria-hidden="true"></span> Node.js (JavaScript)
          </span>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="features-section" aria-labelledby="features-heading">
        <div className="section-header">
          <span className="section-eyebrow">ENGINEERING & SECURITY</span>
          <h2 id="features-heading" className="section-title">Built for Rigorous Assessments</h2>
          <p className="section-subtitle">
            Combines an ergonomic developer code editor with strict security primitives so evaluators can measure genuine problem-solving ability.
          </p>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon-wrapper cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <h3 className="feature-title">Isolated Docker Judge</h3>
            <p className="feature-text">
              When connected to the backend judge with Docker active, code runs in isolated per-job containers with enforced memory limits (256MB) and CPU timeouts. Local process execution is supported as fallback.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="feature-title">Anti-Cheat Controls (Preview)</h3>
            <p className="feature-text">
              Client-side tab-switch detection, right-click suppression, and clipboard locking provide an evaluation preview during timed tests. These are non-tamper-proof browser controls.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 className="feature-title">Structured Test Diagnostics</h3>
            <p className="feature-text">
              Instant feedback comparing stdout with expected assertions. Compile errors, stderr traces, execution duration (ms), and exit codes are presented prominently.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 className="feature-title">Dual Submission Modes</h3>
            <p className="feature-text">
              Submit function-level signatures with auto-generated test harnesses or write complete programs that parse standard input (stdin) for competitive algorithmic formats.
            </p>
          </article>
        </div>
      </section>

      {/* Active Assessment Preview */}
      <section className="contest-preview-section" aria-labelledby="contest-heading">
        <div className="section-header">
          <span className="section-eyebrow">ACTIVE EVALUATION</span>
          <h2 id="contest-heading" className="section-title">Ready for Your Assessment?</h2>
          <p className="section-subtitle">
            Join the active evaluation session or explore problems in the practice environment.
          </p>
        </div>

        <div className="contest-preview-card">
          <div className="contest-meta">
            <div className="contest-badge-row">
              <span className="status-chip active">
                <span className="live-dot" aria-hidden="true"></span>
                <span>Active Evaluation</span>
              </span>
              <span className="duration-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>60 Minutes</span>
              </span>
              <span className="problems-chip">{problemsCount} Algorithm Problems</span>
            </div>

            <h3 className="contest-name">Sample Contest 1: Core Algorithms & Data Structures</h3>
            <p className="contest-desc">
              Assessment covering array indexing, hash map lookups, string manipulation, and complexity constraints. Includes Two Sum and String Reversal with automated judge test suites.
            </p>

            <div className="contest-problem-tags">
              <span className="problem-pill">Problem 1: Two Sum</span>
              <span className="problem-pill">Problem 2: Reverse String</span>
            </div>
          </div>

          <div className="contest-action-box">
            <button
              type="button"
              className="btn-primary contest-enter-btn"
              onClick={() => setCurrentView('contests')}
            >
              <span>View Contest Details</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <span className="contest-note">
              Candidate status: {currentUser ? <strong>{currentUser.name} ({currentUser.role || 'Candidate'})</strong> : 'Open Evaluation Mode (Practice)'}
            </span>
          </div>
        </div>
      </section>

      {/* Guidelines & Anti-Cheat Rules Section */}
      <section className="rules-section" id="rules-section" aria-labelledby="rules-heading">
        <div className="rules-card">
          <div className="rules-header">
            <div className="rules-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 id="rules-heading" className="rules-title">Candidate Evaluation Guidelines & Integrity Protocol</h3>
              <p className="rules-desc">Please review these security constraints before beginning the timed evaluation.</p>
            </div>
          </div>

          <div className="rules-grid">
            <div className="rule-item">
              <span className="rule-num">01</span>
              <div>
                <strong>Fullscreen Required:</strong>
                <p>The evaluation must be completed in fullscreen mode. Use the Fullscreen toggle in the header before starting.</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-num">02</span>
              <div>
                <strong>No Tab Switching:</strong>
                <p>Navigating away from the active tab or minimizing the browser records an integrity violation alert.</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-num">03</span>
              <div>
                <strong>Clipboard Lockdown:</strong>
                <p>Copying, cutting, and pasting code into the editor is restricted to preserve authenticity.</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-num">04</span>
              <div>
                <strong>Execution Timeouts:</strong>
                <p>Solutions must execute within 2000ms and 256MB memory. Infinite loops or exceeding limits will terminate the run.</p>
              </div>
            </div>
          </div>

          {violations > 0 && (
            <div className="rules-alert-footer" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Attention: {violations} violation(s) have been flagged in this session.</span>
            </div>
          )}
        </div>
      </section>

      {/* Platform Technical Footer */}
      <footer className="platform-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">CodePlatform</span>
            <span className="footer-copy">Open-source coding & evaluation environment • osl-vvce</span>
          </div>

          <div className="footer-status-pills">
            <span className="footer-status-pill">
              <span className="status-dot green" aria-hidden="true"></span>
              <span>Backend Judge: Port 3001</span>
            </span>
            <span className="footer-status-pill">
              <span className="status-dot blue" aria-hidden="true"></span>
              <span>Docker Sandbox: Supported (Backend)</span>
            </span>
            <span className="footer-version-pill">v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
