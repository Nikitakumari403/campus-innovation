import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ProblemSubmission from './ProblemSubmission';
import SolutionSubmission from './SolutionSubmission';
import ProblemsPage from './ProblemsPage';
import SolutionsPage from './SolutionsPage';
import StatusDashboard from './StatusDashboard';
import AdminDashboard from './AdminDashboard';
import SafetyIssuePage from './SafetyIssuePage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

import './App.css';

function App() {
  const [page, setPage]     = useState('login');
  const [user, setUser]     = useState(null);
  const [showHome, setShowHome] = useState(true);

  // Show HomePage first
  if (showHome) {
    return <HomePage onGetStarted={() => setShowHome(false)} />;
  }

  // Show LoginPage after Get Started clicked
  if (!user) {
    return <LoginPage onLogin={(u) => { setUser(u); setPage('dashboard'); }} />;
  }

  const roleColors = { student: '#3b82f6', teacher: '#7c3aed', admin: '#dc2626' };
  const roleLabel  = { student: '🎒 Student', teacher: '📚 Teacher', admin: '🛡 Admin' };

  // Nav items with role-based visibility — runs AFTER user is confirmed not null
  const allNavItems = [
    { key: 'dashboard',       label: '📊 Dashboard',       roles: ['student', 'teacher', 'admin'] },
    { key: 'problems',        label: '📋 All Problems',     roles: ['student', 'teacher', 'admin'] },
    { key: 'solutions',       label: '✅ All Solutions',    roles: ['student', 'teacher', 'admin'] },
    { key: 'status',          label: '🔄 Track Status',     roles: ['student', 'teacher', 'admin'] },
    { key: 'safety',          label: '🚨 Safety Issue',     roles: ['student', 'teacher', 'admin'] },
    { key: 'submit-problem',  label: '➕ Submit Problem',   roles: ['student', 'teacher']          },
    { key: 'submit-solution', label: '🛠 Submit Solution',  roles: ['teacher', 'admin']            },
    { key: 'admin',           label: '🛡 Admin Panel',      roles: ['admin']                       },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  const renderPage = () => {
    switch (page) {
      case 'dashboard':       return <Dashboard        user={user} setPage={setPage} />;
      case 'problems':        return <ProblemsPage     user={user} />;
      case 'solutions':       return <SolutionsPage    />;
      case 'status':          return <StatusDashboard  user={user} />;
      case 'safety':          return <SafetyIssuePage  user={user} />;
      case 'admin':           return <AdminDashboard   user={user} />;
      case 'submit-problem':  return <ProblemSubmission  user={user} onDone={() => setPage('problems')} />;
      case 'submit-solution': return <SolutionSubmission user={user} onDone={() => setPage('solutions')} />;
      default:                return <Dashboard        user={user} setPage={setPage} />;
    }
  };

  return (
    <div className="app-wrapper">
      <aside className="sidebar-nav">
        <div className="sidebar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Campus<br />Innovation</span>
        </div>

        <nav>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-avatar" style={{ background: roleColors[user.role] }}>
              {user.name[0].toUpperCase()}
            </span>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role" style={{ color: roleColors[user.role] }}>
                {roleLabel[user.role]}
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={() => { setUser(null); setPage('login'); setShowHome(true); }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
