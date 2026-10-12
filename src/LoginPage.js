import React, { useState } from 'react';

// Hardcoded demo users — add more as needed
const DEMO_USERS = [
  { email: 'student@campus.edu',  password: '123456', name: 'Rahul Singh',   role: 'student' },
  { email: 'teacher@campus.edu',  password: '123456', name: 'Priya Sharma',  role: 'teacher' },
  { email: 'admin@campus.edu',    password: '123456', name: 'Admin User',    role: 'admin'   },
];

export default function LoginPage({ onLogin }) {
  const [mode, setMode]         = useState('login');   // 'login' | 'signup'
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('student');
  const [error, setError]       = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const found = DEMO_USERS.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      setError('Invalid email or password. Try demo credentials below.');
      return;
    }
    onLogin({ uid: found.email, name: found.name, email: found.email, role: found.role });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.includes('@')) { setError('Enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    // Create new user and log in directly
    onLogin({ uid: email.trim().toLowerCase(), name: name.trim(), email: email.trim().toLowerCase(), role });
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Brand header */}
        <div style={s.brand}>
          <div style={s.brandIcon}>🎓</div>
          <div>
            <div style={s.brandTitle}>Campus Innovation</div>
            <div style={s.brandSub}>Solving campus problems together</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={s.tabBar}>
          <button
            type="button"
            style={{ ...s.tab, ...(mode === 'login'  ? s.tabActive : {}) }}
            onClick={() => { setMode('login');  setError(''); }}
          >
            Login
          </button>
          <button
            type="button"
            style={{ ...s.tab, ...(mode === 'signup' ? s.tabActive : {}) }}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} style={s.form}>

          {mode === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. Rahul Singh"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input
              style={s.input}
              type="email"
              placeholder="you@campus.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">🎒 Student</option>
                <option value="teacher">📚 Teacher</option>
                <option value="admin">🛡 Admin</option>
              </select>
            </div>
          )}

          {error && <div style={s.error}>{error}</div>}

          <button style={s.btn} type="submit">
            {mode === 'login' ? '🔑 Login' : '🚀 Create Account'}
          </button>
        </form>

        {/* Demo credentials hint */}
        {mode === 'login' && (
          <div style={s.hint}>
            <strong>Demo credentials (password: 123456)</strong>
            <div style={s.hintRow}>
              <span>🎒 student@campus.edu</span>
              <span>📚 teacher@campus.edu</span>
              <span>🛡 admin@campus.edu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '1rem' },
  card:       { background: '#ffffff', borderRadius: 16, padding: '2rem 2.25rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  brand:      { display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' },
  brandIcon:  { fontSize: 40, lineHeight: 1 },
  brandTitle: { fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.3px' },
  brandSub:   { fontSize: 12, color: '#64748b', marginTop: 2 },
  tabBar:     { display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' },
  tab:        { flex: 1, padding: '0.55rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#64748b', transition: 'color 0.15s' },
  tabActive:  { color: '#3b82f6', borderBottom: '2px solid #3b82f6', marginBottom: -2, fontWeight: 700 },
  form:       { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field:      { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label:      { fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input:      { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none', transition: 'border-color 0.15s' },
  error:      { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '0.6rem 0.85rem', fontSize: 13 },
  btn:        { marginTop: '0.25rem', padding: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.2px', transition: 'background 0.15s' },
  hint:       { marginTop: '1.25rem', padding: '0.85rem', background: '#f0f9ff', borderRadius: 10, border: '1px solid #bae6fd', fontSize: 12, color: '#0369a1' },
  hintRow:    { display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.4rem' },
};
