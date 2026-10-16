import React, { useState } from 'react';

function CandidateLoginCard({
  onProfileConfigured,
  onLoginSuccess,
  currentUser,
  onLogout,
  onNavigateToContests
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [role, setRole] = useState('Candidate');
  const [errors, setErrors] = useState({});
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name or candidate label is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: null }));
    }
    if (profileSavedMsg) setProfileSavedMsg('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
    if (profileSavedMsg) setProfileSavedMsg('');
  };

  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
    if (profileSavedMsg) setProfileSavedMsg('');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole === 'Evaluator' ? 'Evaluator' : 'Candidate');
    if (profileSavedMsg) setProfileSavedMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Non-authoritative local profile configuration.
    // Raw passcodes are never persisted or exposed. Role is strictly a display label.
    const validatedRole = role === 'Evaluator' ? 'Evaluator' : 'Candidate';
    const profileData = {
      name: name.trim(),
      role: validatedRole,
      hasDemoPasscode: typeof accessCode === 'string' && accessCode.trim().length > 0
    };

    // Clear transient access code state so raw passcode does not linger in component memory
    setAccessCode('');

    setProfileSavedMsg(`Demo profile configured for ${profileData.name}.`);
    const callback = onProfileConfigured || onLoginSuccess;
    if (callback) {
      callback(profileData);
    }
  };

  const handleFillDemo = () => {
    setName('Alex Chen');
    setEmail('alex.chen@university.edu');
    setAccessCode('PRACTICE-2026');
    setRole('Candidate');
    setErrors({});
    if (profileSavedMsg) setProfileSavedMsg('');
  };

  if (currentUser) {
    return (
      <div className="login-card session-active-card">
        <div className="card-header">
          <div className="status-indicator-badge active">
            <span className="pulsing-dot" aria-hidden="true"></span>
            <span>Demo Profile Active</span>
          </div>
          <h3>Demo Profile Configured</h3>
          <p className="card-subtitle">
            Local session label for contest participation and submission tagging.
          </p>
        </div>

        <div className="non-auth-disclaimer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Non-authoritative display profile used for labeling candidate submissions in this session.</span>
        </div>

        <div className="active-user-details">
          <div className="user-detail-row">
            <span className="detail-label">Candidate Name:</span>
            <span className="detail-value highlight">{currentUser.name}</span>
          </div>
          <div className="user-detail-row">
            <span className="detail-label">Display Role:</span>
            <span className="detail-value capitalize">{currentUser.role === 'Evaluator' ? 'Evaluator' : 'Candidate'} (Display Only)</span>
          </div>
          <div className="user-detail-row">
            <span className="detail-label">Session ID:</span>
            <span className="detail-value mono">Local Demo Profile</span>
          </div>
          <div className="user-detail-row">
            <span className="detail-label">Demo Passcode:</span>
            <span className="detail-value badge-clearance">
              {currentUser.hasDemoPasscode === true ? 'Provided — not verified' : 'Not provided'}
            </span>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn-primary w-full"
            onClick={onNavigateToContests}
          >
            <span>Proceed to Contests & Problems</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={onLogout}
          >
            <span>Clear Demo Profile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-card">
      <div className="card-header">
        <div className="status-indicator-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Candidate Profile (Demo Preview)</span>
        </div>
        <h3>Candidate Sign In</h3>
        <p className="card-subtitle">Configure your candidate display profile for this evaluation session.</p>
      </div>

      <div className="non-auth-disclaimer">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Notice: This is a client-side display profile for demonstration and evaluation preview. No backend authentication or server-side passcode verification is configured in this repository.</span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="login-form">
        <fieldset className="role-fieldset">
          <legend className="role-legend">Display Role Preference</legend>
          <div className="role-options">
            <label className={`role-option-label ${role === 'Candidate' ? 'checked' : ''}`} htmlFor="role-candidate">
              <input
                type="radio"
                id="role-candidate"
                name="assessment-role"
                value="Candidate"
                checked={role === 'Candidate'}
                onChange={() => handleRoleChange('Candidate')}
                className="role-radio-input"
              />
              <span>Candidate / Student</span>
            </label>
            <label className={`role-option-label ${role === 'Evaluator' ? 'checked' : ''}`} htmlFor="role-evaluator">
              <input
                type="radio"
                id="role-evaluator"
                name="assessment-role"
                value="Evaluator"
                checked={role === 'Evaluator'}
                onChange={() => handleRoleChange('Evaluator')}
                className="role-radio-input"
              />
              <span>Instructor / Evaluator (Preview)</span>
            </label>
          </div>
        </fieldset>

        <div className="form-group">
          <label htmlFor="candidate-name">
            Full Name or Candidate Label <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-with-icon">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="candidate-name"
              type="text"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Alex Chen or Team Alpha"
              value={name}
              onChange={handleNameChange}
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </div>
          {errors.name && (
            <span id="name-error" className="field-error-msg" role="alert">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="candidate-email">
            Academic or Institutional Email <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-with-icon">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="candidate-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. student@university.edu"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <span id="email-error" className="field-error-msg" role="alert">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <div className="label-with-hint">
            <label htmlFor="access-code">Contest Passcode (Demo Preview)</label>
            <span className="optional-tag">Optional / Unverified</span>
          </div>
          <div className="input-with-icon">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="access-code"
              type="text"
              className="form-input"
              placeholder="e.g. PRACTICE-2026 (Optional)"
              value={accessCode}
              onChange={handleAccessCodeChange}
              autoComplete="off"
            />
          </div>
          <span className="field-hint">Optional demo field. Passcodes are not verified by the server in this implementation.</span>
        </div>

        {profileSavedMsg && (
          <div className="auth-alert success" role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{profileSavedMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full submit-btn"
        >
          <span className="btn-content">
            <span>Save Demo Profile</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>

        <div className="card-footer-helper">
          <button
            type="button"
            className="btn-demo-fill"
            onClick={handleFillDemo}
            title="Pre-fill sample candidate credentials for quick evaluation"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Fill Demo Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CandidateLoginCard;
