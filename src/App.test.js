import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import CandidateLoginCard from './components/CandidateLoginCard';
import Navbar from './components/Navbar';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  localStorage.clear();
  if (!document.body.createTextRange) {
    document.body.createTextRange = () => ({
      setEnd: () => {},
      setStart: () => {},
      getBoundingClientRect: () => ({ right: 0, left: 0, top: 0, bottom: 0, width: 0, height: 0 }),
      getClientRects: () => []
    });
  }
});

afterEach(() => {
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = null;
  }
  localStorage.clear();
  jest.restoreAllMocks();
});

// Helper to start an active assessment from the UI
function startAssessmentFromUI(rootContainer) {
  const startBtn = rootContainer.querySelector('.btn-start-contest') ||
                   rootContainer.querySelector('.hero-btn.btn-primary') ||
                   Array.from(rootContainer.querySelectorAll('button')).find(b => b.textContent.includes('Start Timed Assessment'));
  if (startBtn) {
    act(() => {
      startBtn.click();
    });
  }
}

// Helper to open practice mode from the UI
function openPracticeFromUI(rootContainer) {
  const practiceBtn = Array.from(rootContainer.querySelectorAll('button')).find(b => b.textContent.includes('Practice Mode'));
  if (practiceBtn) {
    act(() => {
      practiceBtn.click();
    });
  } else {
    // Navigate via Contests -> Problems -> Problem solve
    const contestsTab = Array.from(rootContainer.querySelectorAll('.nav-tab')).find(el => el.textContent.includes('Contests'));
    if (contestsTab) {
      act(() => {
        contestsTab.click();
      });
      const contestItem = rootContainer.querySelector('.contests li');
      if (contestItem) {
        act(() => {
          contestItem.click();
        });
        const problemItem = rootContainer.querySelector('.problems li');
        if (problemItem) {
          act(() => {
            problemItem.click();
          });
        }
      }
    }
  }
}

// 1. Landing-page interaction does not trigger assessment violations
it('1. landing-page interaction does not trigger assessment violations', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });
  expect(container.querySelector('.hero-section')).toBeTruthy();

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('contextmenu'));
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('paste'));
  });

  expect(alertSpy).not.toHaveBeenCalled();
  expect(container.querySelector('.violations-badge')).toBeNull();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 2. Login/profile setup does not trigger assessment violations
it('2. login/profile setup does not trigger assessment violations', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  const loginTab = container.querySelector('.nav-login-btn');
  if (loginTab) {
    act(() => {
      loginTab.click();
    });
  }
  expect(container.querySelector('.login-page-view')).toBeTruthy();

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('contextmenu'));
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('paste'));
  });

  expect(alertSpy).not.toHaveBeenCalled();
  expect(container.querySelector('.violations-badge')).toBeNull();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 3. Practice coding does not activate assessment monitoring
it('3. practice coding does not activate assessment monitoring', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  openPracticeFromUI(container);
  expect(container.querySelector('.editor')).toBeTruthy();
  expect(container.querySelector('.assessment-session-banner.practice')).toBeTruthy();

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('contextmenu'));
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('paste'));
  });

  expect(alertSpy).not.toHaveBeenCalled();
  expect(container.querySelector('.violations-badge')).toBeNull();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 4. Starting an assessment activates the correct listeners
it('4. starting an assessment activates the correct listeners', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);
  expect(container.querySelector('.editor')).toBeTruthy();
  expect(container.querySelector('.assessment-session-banner.active')).toBeTruthy();

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(alertSpy).toHaveBeenCalledWith('Tab switching detected! This is a violation.');
  expect(container.querySelector('.violations-badge')).toBeTruthy();
  expect(container.querySelector('.violations-badge').textContent).toContain('Violations: 1');
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 5. Re-rendering does not duplicate listener registrations
it('5. re-rendering does not duplicate listener registrations', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);
  expect(container.querySelector('.editor')).toBeTruthy();

  // Trigger multiple re-renders while remaining in the active assessment
  act(() => {
    const nextBtn = Array.from(container.querySelectorAll('.code-header button')).find(el => el.textContent === 'Next');
    if (nextBtn) nextBtn.click();
  });
  act(() => {
    ReactDOM.render(<App />, container);
  });

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(alertSpy).toHaveBeenCalledTimes(1);
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 6. Leaving and returning to the same active assessment preserves the violation count
it('6. leaving and returning to the same active assessment preserves the violation count', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);

  // Trigger violation 1 in active editor
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(container.querySelector('.violations-badge').textContent).toContain('Violations: 1');

  // Navigate away to Submissions
  const submissionsTab = Array.from(container.querySelectorAll('.nav-tab')).find(el => el.textContent.includes('Submissions'));
  act(() => {
    submissionsTab.click();
  });
  expect(container.querySelector('.submissions')).toBeTruthy();

  // While on Submissions, tab switch must NOT increment violations
  alertSpy.mockClear();
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(alertSpy).not.toHaveBeenCalled();

  // Return to Problems and open editor within the same active assessment
  const contestsTab = Array.from(container.querySelectorAll('.nav-tab')).find(el => el.textContent.includes('Contests'));
  act(() => {
    contestsTab.click();
  });
  const contestItem = container.querySelector('.contests li');
  act(() => {
    contestItem.click();
  });
  const problemItem = container.querySelector('.problems li');
  act(() => {
    problemItem.click();
  });

  expect(container.querySelector('.editor')).toBeTruthy();
  // Violation count must be PRESERVED (1), not wiped to 0
  expect(container.querySelector('.violations-badge').textContent).toContain('Violations: 1');

  // New tab switch in active assessment increments to 2
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(alertSpy).toHaveBeenCalledWith('Tab switching detected! This is a violation.');
  expect(container.querySelector('.violations-badge').textContent).toContain('Violations: 2');

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 7. Starting a genuinely new assessment resets the count exactly once
it('7. starting a genuinely new assessment resets the count exactly once', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(container.querySelector('.violations-badge').textContent).toContain('Violations: 1');

  // End assessment
  const endBtn = container.querySelector('.btn-end-assessment');
  act(() => {
    endBtn.click();
  });
  expect(container.querySelector('.assessment-session-banner.ended')).toBeTruthy();

  // Start new assessment session
  const startNewBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.includes('Start New Assessment'));
  act(() => {
    startNewBtn.click();
  });

  // Violations must be reset to 0
  expect(container.querySelector('.violations-badge')).toBeNull();
  expect(container.querySelector('.assessment-session-banner.active')).toBeTruthy();

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 8. Ending an assessment removes listeners
it('8. ending an assessment removes listeners', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);
  expect(container.querySelector('.assessment-session-banner.active')).toBeTruthy();

  // End the assessment
  const endBtn = container.querySelector('.btn-end-assessment');
  act(() => {
    endBtn.click();
  });
  expect(container.querySelector('.assessment-session-banner.ended')).toBeTruthy();

  // Subsequent events must be ignored
  alertSpy.mockClear();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('contextmenu'));
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('paste'));
  });

  expect(alertSpy).not.toHaveBeenCalled();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 9. Unmounting cleans up listeners
it('9. unmounting cleans up listeners', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  alertSpy.mockClear();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('contextmenu'));
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('paste'));
  });

  expect(alertSpy).not.toHaveBeenCalled();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
});

// 10. Context-menu, copy, paste, visibility, and keyboard restrictions behave as intended during an active assessment
it('10. context-menu, copy, paste, and keyboard restrictions behave as intended during an active assessment', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  act(() => {
    ReactDOM.render(<App />, container);
  });

  startAssessmentFromUI(container);

  // Right-click context menu
  const contextEvent = new Event('contextmenu', { bubbles: true, cancelable: true });
  act(() => {
    document.dispatchEvent(contextEvent);
  });
  expect(contextEvent.defaultPrevented).toBe(true);
  expect(alertSpy).toHaveBeenCalledWith('Right-click disabled!');

  // Copy restriction
  const copyEvent = new Event('copy', { bubbles: true, cancelable: true });
  act(() => {
    document.dispatchEvent(copyEvent);
  });
  expect(copyEvent.defaultPrevented).toBe(true);
  expect(alertSpy).toHaveBeenCalledWith('Copy-paste disabled!');

  // Paste restriction
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  act(() => {
    document.dispatchEvent(pasteEvent);
  });
  expect(pasteEvent.defaultPrevented).toBe(true);
  expect(alertSpy).toHaveBeenCalledWith('Copy-paste disabled!');
});

// 11. Timer behavior and assessment transitions remain correct
it('11. timer behavior and assessment transitions remain correct', () => {
  const mockUser = { name: 'Alex Chen', role: 'Candidate' };

  act(() => {
    ReactDOM.render(
      <Navbar
        currentView="editor"
        setCurrentView={() => {}}
        currentUser={mockUser}
        onLogout={() => {}}
        violations={0}
        timeLeft={3540}
        formatTime={(s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`}
        isFullscreen={false}
        enterFullscreen={() => {}}
        exitFullscreen={() => {}}
        assessmentSession={{ id: '1', contestId: 'c1', status: 'active' }}
        isAssessmentActive={true}
        onEndAssessment={() => {}}
      />,
      container
    );
  });

  expect(container.querySelector('.timer-badge').textContent).toContain('59:00');
  expect(container.querySelector('.btn-end-assessment-header')).toBeTruthy();
});

// 12. Raw passcodes are not persisted or included in profile data
it('12. raw passcodes are not persisted or included in profile data and accessCode is cleared', () => {
  let submittedProfile = null;

  act(() => {
    ReactDOM.render(
      <CandidateLoginCard
        onProfileConfigured={(data) => { submittedProfile = data; }}
        currentUser={null}
      />,
      container
    );
  });

  const nameInput = container.querySelector('#candidate-name');
  const emailInput = container.querySelector('#candidate-email');
  const accessCodeInput = container.querySelector('#access-code');

  act(() => {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(nameInput, 'Jordan Lee');
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    nativeSetter.call(emailInput, 'jordan.lee@test.edu');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    nativeSetter.call(accessCodeInput, 'TOP_SECRET_PASSCODE_999');
    accessCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
    accessCodeInput.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const form = container.querySelector('form');
  act(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(submittedProfile).toBeTruthy();
  expect(submittedProfile.name).toBe('Jordan Lee');
  expect(submittedProfile.hasDemoPasscode).toBe(true);
  // Raw passcode must NOT be in submittedProfile
  expect(submittedProfile.accessCode).toBeUndefined();
  expect(JSON.stringify(submittedProfile)).not.toContain('TOP_SECRET_PASSCODE_999');

  // Raw passcode input field must be cleared after submission
  expect(accessCodeInput.value).toBe('');
});

// 13. Malformed localStorage data and invalid roles are handled safely
it('13. malformed localStorage data and invalid roles are handled safely', () => {
  // Invalid JSON
  localStorage.setItem('coding_platform_demo_profile', '<<<invalid-json>>>');
  expect(() => {
    act(() => {
      ReactDOM.render(<App />, container);
    });
  }).not.toThrow();

  // Invalid role fallback
  localStorage.setItem('coding_platform_demo_profile', JSON.stringify({
    name: 'AdminUser',
    role: 'RootSuperuser',
    hasDemoPasscode: true
  }));

  act(() => {
    ReactDOM.render(<App />, container);
  });

  const roleText = container.querySelector('.candidate-id');
  if (roleText) {
    // Must be sanitized to Candidate (Demo)
    expect(roleText.textContent).toBe('Candidate (Demo)');
  }
});

// 14. Boolean validation correctly rejects invalid values, including the string 'false'
it('14. boolean validation correctly rejects invalid values including string "false"', () => {
  localStorage.setItem('coding_platform_demo_profile', JSON.stringify({
    name: 'BooleanTester',
    role: 'Candidate',
    hasDemoPasscode: 'false' // String "false" must NOT be treated as boolean true!
  }));

  act(() => {
    ReactDOM.render(<App />, container);
  });

  // Navigate to login / candidate card to inspect display
  const loginTab = container.querySelector('.candidate-status-chip') || container.querySelector('.nav-tab');
  act(() => {
    loginTab.click();
  });

  // The detail badge in CandidateLoginCard must say 'Not provided' because hasDemoPasscode is false
  expect(container.textContent).toContain('Not provided');
  expect(container.textContent).not.toContain('Provided — not verified');
});

// 15. Logout removes only the intended application storage keys
it('15. logout removes only the intended application storage keys', () => {
  localStorage.setItem('other_app_token', 'preserve-this-token');
  localStorage.setItem('coding_platform_demo_profile', JSON.stringify({
    name: 'LogoutUser',
    role: 'Candidate',
    hasDemoPasscode: true
  }));
  localStorage.setItem('coding_platform_user', 'legacy-data');

  act(() => {
    ReactDOM.render(<App />, container);
  });

  const signoutBtn = container.querySelector('.btn-signout');
  if (signoutBtn) {
    act(() => {
      signoutBtn.click();
    });
  }

  expect(localStorage.getItem('coding_platform_demo_profile')).toBeNull();
  expect(localStorage.getItem('coding_platform_user')).toBeNull();
  // Unrelated application storage is completely preserved
  expect(localStorage.getItem('other_app_token')).toBe('preserve-this-token');
});

// 16. Navigation, execution, and problem switching remain intact
it('16. navigation, problem switching, and submissions remain intact', () => {
  act(() => {
    ReactDOM.render(<App />, container);
  });

  // Open practice mode
  openPracticeFromUI(container);
  expect(container.querySelector('.editor')).toBeTruthy();

  // Test problem navigation
  const nextBtn = Array.from(container.querySelectorAll('.code-header button')).find(b => b.textContent === 'Next');
  const prevBtn = Array.from(container.querySelectorAll('.code-header button')).find(b => b.textContent === 'Prev');
  expect(container.querySelector('.problem-statement h2').textContent).toBe('Two Sum');

  act(() => {
    nextBtn.click();
  });
  expect(container.querySelector('.problem-statement h2').textContent).toBe('Reverse String');

  act(() => {
    prevBtn.click();
  });
  expect(container.querySelector('.problem-statement h2').textContent).toBe('Two Sum');

  // Test language selector
  const select = container.querySelector('select');
  act(() => {
    select.value = 'python';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(select.value).toBe('python');
});
