import React, { useState, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [code, setCode] = useState(`// Write your solution here
function twoSum(nums, target) {
  // Your code here
}`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [submissions, setSubmissions] = useState({});

  // Assessment lifecycle state:
  // null = Idle or open practice mode (no anti-cheat listeners)
  // { id, contestId, status: 'active' | 'ended' } = Managed assessment session
  const [assessmentSession, setAssessmentSession] = useState(null);

  const startAssessment = (contestId = 'sample-contest-1') => {
    setAssessmentSession({
      id: Date.now().toString(),
      contestId,
      status: 'active'
    });
    // Reset violations exactly once when a genuinely new assessment begins
    setViolations(0);
    setTimeLeft(3600);
    setCurrentProblem(0);
    setCurrentView('editor');
  };

  const endAssessment = () => {
    setAssessmentSession(prev => (prev ? { ...prev, status: 'ended' } : { id: 'ended', contestId: 'sample-contest-1', status: 'ended' }));
  };

  const startPractice = (problemIndex = 0) => {
    // Practice mode operates without an active assessment session and without integrity restrictions
    setAssessmentSession(null);
    setCurrentProblem(problemIndex);
    setCurrentView('editor');
  };

  // Non-authoritative candidate display profile (UI/demo session convenience only).
  // Does not gate access to assessments, contests, or problems.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('coding_platform_demo_profile');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string' && parsed.name.trim().length > 0) {
        return {
          name: parsed.name.trim(),
          role: parsed.role === 'Evaluator' ? 'Evaluator' : 'Candidate',
          // Strictly validate boolean to reject strings like "false", numbers, or other truthy non-booleans
          hasDemoPasscode: parsed.hasDemoPasscode === true
        };
      }
      return null;
    } catch (err) {
      console.warn('Unable to load demo profile from localStorage:', err);
      return null;
    }
  });

  const handleProfileConfigured = (profileData) => {
    if (!profileData || typeof profileData.name !== 'string' || !profileData.name.trim()) {
      return;
    }
    // Only persist non-sensitive display fields. Access codes or sensitive keys are never persisted.
    // Display role is strictly validated as 'Candidate' or 'Evaluator' and carries no elevated permissions.
    const displayProfile = {
      name: profileData.name.trim(),
      role: profileData.role === 'Evaluator' ? 'Evaluator' : 'Candidate',
      hasDemoPasscode: profileData.hasDemoPasscode === true
    };
    setCurrentUser(displayProfile);
    try {
      localStorage.setItem('coding_platform_demo_profile', JSON.stringify(displayProfile));
    } catch (err) {
      console.warn('Unable to save demo profile to localStorage:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      // Remove only application-specific demo profile keys without clearing unrelated storage
      localStorage.removeItem('coding_platform_demo_profile');
      localStorage.removeItem('coding_platform_user');
    } catch (err) {
      console.warn('Unable to remove demo profile from localStorage:', err);
    }
  };

  const problems = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      sampleInput: 'nums = [2,7,11,15], target = 9',
      sampleOutput: '[0,1]',
      testCases: [
        { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
        { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
        { stdin: '2 7 11 15\n9', expected: '0 1' },
        { stdin: '3 2 4\n6', expected: '1 2' }
      ],
      templates: {
        javascript: `function twoSum(nums, target) {
  // Your code here
}`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    return result;
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`,
        java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`
      },
      runner: (func, test) => {
        const nums = JSON.parse(test.input.match(/nums = (\[.*\])/)[1]);
        const target = JSON.parse(test.input.match(/target = (\d+)/)[1]);
        return func(nums, target);
      }
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      constraints: [
        '1 <= s.length <= 10^5',
        's[i] is a printable ascii character.'
      ],
      sampleInput: 's = ["h","e","l","l","o"]',
      sampleOutput: '["o","l","l","e","h"]',
      testCases: [
        { input: 's = ["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
        { stdin: 'h e l l o', expected: 'o l l e h' }
      ],
      templates: {
        javascript: `function reverseString(s) {
  // Your code here
}`,
        python: `def reverse_string(s):
    # Your code here
    pass`,
        c: `#include <stdio.h>
#include <string.h>

void reverseString(char* s, int sSize) {
    // Your code here
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
    }
};`,
        java: `public class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`
      },
      runner: (func, test) => {
        const s = JSON.parse(test.input.match(/s = (\[.*\])/)[1]);
        func(s); // modifies in place
        return s;
      }
    }
  ];
  const problem = problems[currentProblem];

  const isAssessmentActive = Boolean(
    assessmentSession && assessmentSession.status === 'active' && currentView === 'editor'
  );

  useEffect(() => {
    // Only register exam integrity listeners during a genuinely active assessment in the editor
    if (!isAssessmentActive) {
      return;
    }

    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => prev + 1);
        alert('Tab switching detected! This is a violation.');
      }
    };

    // Prevent right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      setViolations(prev => prev + 1);
      alert('Right-click disabled!');
    };

    // Prevent copy-paste globally
    const handleCopyPaste = (e) => {
      e.preventDefault();
      setViolations(prev => prev + 1);
      alert('Copy-paste disabled!');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [isAssessmentActive]);

  useEffect(() => {
    // Run timer only during an active assessment
    if (assessmentSession?.status === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [assessmentSession, timeLeft]);

  useEffect(() => {
    if (currentView === 'editor' && problem && problem.templates && problem.templates[language]) {
      setCode(problem.templates[language]);
    }
  }, [language, currentProblem, currentView, problem]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Define a dynamic base URL for API calls
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  const formatResults = (results) => {
    if (!results || results.length === 0) return 'No results';
    const lines = [];
    results.forEach((r, idx) => {
      lines.push(`Test ${idx + 1}: ${r.passed ? 'Passed' : 'Failed'}`);
      const out = r.stdout ?? r.output ?? r.out ?? '';
      const err = r.stderr ?? r.error ?? r.compileError ?? '';
      if (out && String(out).trim().length) lines.push(`  stdout: ${String(out).trim()}`);
      if (err && String(err).trim()) lines.push(`  stderr/error: ${String(err).trim()}`);
      if (r.timeMs !== undefined && r.timeMs !== null) lines.push(`  time: ${r.timeMs} ms`);
      if (r.exitCode !== undefined && r.exitCode !== null) lines.push(`  exit code: ${r.exitCode}`);
      lines.push('');
    });
    return lines.join('\n');
  };

  // Update runCode function to use dynamic base URL
  const runCode = async () => {
    try {
      const funcName = (function extractFuncName(sourceCode, lang) {
        try {
          if (lang === 'python') {
            const m = sourceCode.match(/def\s+([A-Za-z0-9_]+)\s*\(/);
            return m ? m[1] : null;
          }
          if (lang === 'javascript') {
            const m = sourceCode.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
            return m ? m[1] : null;
          }
          if (lang === 'java') {
            const m = sourceCode.match(/(?:public|private|protected)?\s+static\s+[A-Za-z0-9_<>[\]]+\s+([A-Za-z0-9_]+)\s*\(/);
            return m ? m[1] : null;
          }
          if (lang === 'c' || lang === 'cpp') {
            const m = sourceCode.match(/([A-Za-z0-9_]+)\s*\([^;)]*\)\s*\{/);
            return m ? m[1] : null;
          }
          return null;
        } catch (e) { return null; }
      })(code, language);

      const response = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          funcName,
          tests: problems[currentProblem].testCases,
          timeLimitMs: 2000,
          memoryLimitMb: 256
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        setOutput(`Runner error: ${data.error}`);
      } else {
        const results = data.results || [];
        const errRes = results.find(r => r && (r.compileError || r.error || (r.stderr && String(r.stderr).trim().length > 0)));
        if (errRes) {
          const msg = errRes.compileError || errRes.error || errRes.stderr;
          setOutput(`Error:\n${msg}`);
        } else {
          setOutput(formatResults(results));
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  // Update submitCode function to use dynamic base URL
  const submitCode = async () => {
    setOutput('Submitting...');
    const buildTests = () => {
      const tests = [];
      for (const tc of problem.testCases) {
        if (tc.stdin) {
          tests.push({ input: tc.stdin, expected: tc.expected });
        } else {
          const input = tc.input || '';
          const args = [];
          const arrMatch = input.match(/(\[.*\])/);
          if (arrMatch) {
            try {
              args.push(JSON.parse(arrMatch[1]));
            } catch (e) {
              args.push(arrMatch[1]);
            }
          }
          const numMatch = input.match(/target\s*=\s*([-]?[0-9]+)/);
          if (numMatch) args.push(Number(numMatch[1]));
          if (args.length === 0 && input.length) args.push(input);
          tests.push({ args, expected: tc.expected });
        }
      }
      return tests;
    };

    const funcName = (function extractFuncName(sourceCode, lang) {
      try {
        if (lang === 'python') {
          const m = sourceCode.match(/def\s+([A-Za-z0-9_]+)\s*\(/);
          return m ? m[1] : null;
        }
        if (lang === 'javascript') {
          const m = sourceCode.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
          return m ? m[1] : null;
        }
        if (lang === 'java') {
          const m = sourceCode.match(/(?:public|private|protected)?\s+static\s+[A-Za-z0-9_<>[\]]+\s+([A-Za-z0-9_]+)\s*\(/);
          return m ? m[1] : null;
        }
        if (lang === 'c' || lang === 'cpp') {
          const m = sourceCode.match(/([A-Za-z0-9_]+)\s*\([^;)]*\)\s*\{/);
          return m ? m[1] : null;
        }
        return null;
      } catch (e) { return null; }
    })(code, language);

    const prepared = buildTests();
    try {
      const resp = await fetch(`${API_BASE_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, funcName, tests: prepared }),
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.statusText}`);
      }

      const data = await resp.json();
      if (data.error) {
        setOutput(`Runner error: ${data.error}`);
        return;
      }

      const results = data.results || [];
      const errRes = results.find(r => r && (r.compileError || r.error || (r.stderr && String(r.stderr).trim().length > 0)));
      if (errRes) {
        const msg = errRes.compileError || errRes.error || errRes.stderr;
        setOutput(`Error:\n${msg}`);
        return;
      }

      const passedCount = results.filter(r => r.passed).length;
      const score = Math.round((passedCount / (prepared.length || 1)) * 100);

      const submitResp = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: currentProblem, language, code, score }),
      });

      if (!submitResp.ok) {
        throw new Error(`Server error: ${submitResp.statusText}`);
      }

      const submitData = await submitResp.json();
      if (submitData.error) {
        setOutput(`Submit error: ${submitData.error}`);
      } else {
        // Record submission in state
        setSubmissions(prev => ({
          ...prev,
          [currentProblem]: {
            score,
            code,
            time: new Date().toLocaleTimeString(),
            passedCount,
            totalCount: prepared.length
          }
        }));

        const resultsText = formatResults(results || []);
        setOutput(`${resultsText}\nSubmitted! Score: ${score}% (${passedCount}/${prepared.length}) - id ${submitData.id || submitData.message || 'ok'}`);
      }
    } catch (e) {
      setOutput(`Network/submit error: ${e.message}`);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="App">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        violations={violations}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isFullscreen={isFullscreen}
        enterFullscreen={enterFullscreen}
        exitFullscreen={exitFullscreen}
        assessmentSession={assessmentSession}
        isAssessmentActive={isAssessmentActive}
        onEndAssessment={endAssessment}
        onStartAssessment={startAssessment}
      />

      <main>
        {currentView === 'home' && (
          <LandingPage
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            onProfileConfigured={handleProfileConfigured}
            onLogout={handleLogout}
            violations={violations}
            problemsCount={problems.length}
            assessmentSession={assessmentSession}
            onStartAssessment={startAssessment}
            onStartPractice={startPractice}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            onProfileConfigured={handleProfileConfigured}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'contests' && (
          <section className="contests">
            <h2>Available Assessments & Contests</h2>
            <ul>
              <li onClick={() => setCurrentView('problems')}>
                <div>
                  <strong>Sample Contest 1: Core Algorithms</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    2 Problems • 60 min limit • Languages: JS, Python, Java, C, C++
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-start-contest"
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      startAssessment('sample-contest-1');
                    }}
                  >
                    Start Timed Assessment
                  </button>
                  <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8125rem', fontWeight: 600 }}>Active</span>
                </div>
              </li>
              <li style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                <div>
                  <strong>Sample Contest 2: Advanced Graph Algorithms</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Scheduled evaluation session
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Coming Soon</span>
              </li>
            </ul>
          </section>
        )}

        {currentView === 'problems' && (
          <section className="problems">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2>Problems — Sample Contest 1</h2>
              {assessmentSession?.status === 'active' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Timed Assessment in Progress
                  </span>
                  <button
                    type="button"
                    onClick={endAssessment}
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    End Assessment
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startAssessment('sample-contest-1')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Start Timed Assessment
                </button>
              )}
            </div>
            <ul>
              {problems.map((p, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setCurrentProblem(i);
                    setCurrentView('editor');
                    setCode(p.templates[language] || '// Template not available');
                  }}
                >
                  <div>
                    <strong>Problem {i + 1}: {p.title}</strong>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {p.description.substring(0, 90)}...
                    </div>
                  </div>
                  <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>Solve &rarr;</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {currentView === 'editor' && (
          <section className="editor">
            {assessmentSession?.status === 'active' ? (
              <div
                className="assessment-session-banner active"
                style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--accent-primary)' }}>Active Assessment Session:</strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                    Integrity monitoring is enabled (tab switching, copy-paste, and right-click are restricted).
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-end-assessment"
                  onClick={endAssessment}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  End Assessment
                </button>
              </div>
            ) : assessmentSession?.status === 'ended' ? (
              <div
                className="assessment-session-banner ended"
                style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(100, 116, 139, 0.12)',
                  border: '1px solid rgba(100, 116, 139, 0.25)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              >
                <div>
                  <strong>Assessment Ended:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Monitoring disabled. Total violations recorded in this session: {violations}.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => startAssessment('sample-contest-1')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Start New Assessment
                </button>
              </div>
            ) : (
              <div
                className="assessment-session-banner practice"
                style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Practice Mode:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Integrity monitoring is inactive. Normal editing, copy-paste, and tab switching are allowed.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => startAssessment('sample-contest-1')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Start Timed Assessment
                </button>
              </div>
            )}
            <div className="problem-statement">
              <h2>{problem.title}</h2>
              <p>{problem.description}</p>
              <h3>Constraints:</h3>
              <ul>
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <h3>Sample Input:</h3>
              <pre>{problem.sampleInput}</pre>
              <h3>Sample Output:</h3>
              <pre>{problem.sampleOutput}</pre>
            </div>
            <div className="code-section">
              <div className="code-header">
                <div>
                  <button onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}>Prev</button>
                  <span>Problem {currentProblem + 1} of {problems.length}</span>
                  <button onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}>Next</button>
                </div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <button onClick={runCode}>Run Code</button>
                <button onClick={submitCode}>Submit</button>
              </div>
              <div className="code-editor-container">
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CodeMirror
                    value={code}
                    options={{
                      mode: language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : 'clike',
                      theme: 'default',
                      lineNumbers: true,
                      readOnly: false,
                      tabSize: 2,
                      indentWithTabs: false,
                    }}
                    onChange={(editor, data, value) => {
                      setCode(value);
                    }}
                    onKeyDown={(editor, event) => {
                      if (isAssessmentActive && (event.ctrlKey || event.metaKey) && ['c', 'v', 'x'].includes(event.key.toLowerCase())) {
                        event.preventDefault();
                        setViolations(prev => prev + 1);
                        alert('Copy-paste disabled!');
                      }
                    }}
                  />
                  <div className="output">
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                  </div>
                </div>
                <div className="test-cases-section">
                  <h3>Test Cases:</h3>
                  <div className="test-cases-list">
                    {problem.testCases.map((tc, index) => (
                      <div key={index} className="test-case">
                        <div className="test-case-header">
                          <strong>Test Case {index + 1}:</strong>
                          {tc.stdin ? <span> (Stdin Input)</span> : <span> (Function Args)</span>}
                        </div>
                        <div className="test-case-content">
                          {tc.stdin ? (
                            <div>
                              <div><strong>Input:</strong> {tc.stdin.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}</div>
                            </div>
                          ) : (
                            <div>
                              <div><strong>Input:</strong> {tc.input}</div>
                            </div>
                          )}
                          <div><strong>Expected:</strong> {JSON.stringify(tc.expected)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentView === 'submissions' && (
          <section className="submissions">
            <h2>My Submissions</h2>
            {Object.keys(submissions).length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No submissions recorded in this session yet. Solve a problem and click "Submit" to see your score.</p>
            ) : (
              <ul>
                {Object.entries(submissions).map(([idx, sub]) => (
                  <li key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{problems[parseInt(idx)].title}</strong>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        backgroundColor: sub.score === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: sub.score === 100 ? '#34d399' : '#fbbf24'
                      }}>
                        Score: {sub.score}%
                      </span>
                    </div>
                    {sub.time && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Submitted at {sub.time} • Passed {sub.passedCount} of {sub.totalCount} tests
                      </div>
                    )}
                    <details>
                      <summary>View Submitted Code</summary>
                      <pre>{sub.code}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;