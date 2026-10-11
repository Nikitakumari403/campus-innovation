import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './App.css';

const ROLES = [
  { value: 'student', label: '🎒 Student',  desc: 'Submit campus problems' },
  { value: 'teacher', label: '📚 Teacher',  desc: 'Provide solutions to problems' },
  { value: 'admin',   label: '🛡 Admin',    desc: 'Full access & management' },
];

const Login = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');

  // Login state
  const [loginData, setLoginData]     = useState({ email: '', password: '' });
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginError, setLoginError]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupData, setSignupData]   = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const switchMode = (m) => { setMode(m); setLoginError(''); setSignupError(''); };

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      setLoginError(
        err.code === 'auth/user-not-found'  ? 'No account found. Please sign up first.' :
        err.code === 'auth/wrong-password'  ? 'Wrong password. Please try again.' :
        err.code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        err.code === 'auth/too-many-requests'  ? 'Too many attempts. Please try again later.' :
        'Login failed. Please try again.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  /* ── Signup ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupData.name.trim())           { setSignupError('Please enter your full name.'); return; }
    if (signupData.password.length < 6)    { setSignupError('Password must be at least 6 characters.'); return; }
    if (signupData.password !== signupData.confirm) { setSignupError('Passwords do not match.'); return; }

    setSignupLoading(true);
    try {
      await signup(signupData.name.trim(), signupData.email, signupData.password, signupData.role);
      // AuthContext sets user via onAuthStateChanged → App re-renders automatically
    } catch (err) {
      setSignupError(
        err.code === 'auth/email-already-in-use' ? 'This email is already registered. Please log in.' :
        err.code === 'auth/weak-password'         ? 'Password is too weak. Use at least 6 characters.' :
        'Sign up failed. Please try again.'
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-logo">🎓</div>
        <h2 className="login-title">Campus Innovation</h2>
        <p className="login-subtitle">Submit Problems · Get Solutions</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button type="button" className={`auth-tab ${mode === 'login'  ? 'active' : ''}`} onClick={() => switchMode('login')}>
            Login
          </button>
          <button type="button" className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>
            Sign Up
          </button>
        </div>

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" required placeholder="your@email.com"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                className="input-field" autoComplete="username"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-box">
                <input type={showLoginPwd ? 'text' : 'password'} required placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-field" autoComplete="current-password"
                />
                <button type="button" className="toggle-btn" onClick={() => setShowLoginPwd(!showLoginPwd)}>
                  {showLoginPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {loginError && <div className="error-msg">{loginError}</div>}
            <button type="submit" className="submit-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="switch-hint">
              Don't have an account?{' '}
              <button type="button" className="link-btn" onClick={() => switchMode('signup')}>Create one</button>
            </p>
          </form>
        )}

        {/* ── SIGN UP ── */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" required placeholder="Your full name"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" required placeholder="your@email.com"
                value={signupData.email}
                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                className="input-field" autoComplete="username"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-box">
                <input type={showSignupPwd ? 'text' : 'password'} required placeholder="Min. 6 characters"
                  value={signupData.password}
                  onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                  className="input-field" autoComplete="new-password"
                />
                <button type="button" className="toggle-btn" onClick={() => setShowSignupPwd(!showSignupPwd)}>
                  {showSignupPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input type="password" required placeholder="Re-enter password"
                value={signupData.confirm}
                onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                className="input-field" autoComplete="new-password"
              />
            </div>

            {/* Role Selection */}
            <div className="input-group">
              <label className="input-label">I am a…</label>
              <div className="role-select-grid">
                {ROLES.map(r => (
                  <button key={r.value} type="button"
                    className={`role-select-card ${signupData.role === r.value ? 'selected' : ''}`}
                    onClick={() => setSignupData({ ...signupData, role: r.value })}
                  >
                    <span className="role-card-label">{r.label}</span>
                    <span className="role-card-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {signupError && <div className="error-msg">{signupError}</div>}

            <button type="submit" className="submit-btn" disabled={signupLoading}>
              {signupLoading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="switch-hint">
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={() => switchMode('login')}>Log in</button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
