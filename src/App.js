import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ProblemSubmission from './ProblemSubmission';
import SolutionSubmission from './SolutionSubmission';
import ProblemsPage from './ProblemsPage';
import SolutionsPage from './SolutionsPage';
import StatusDashboard from './StatusDashboard';
import SafetyIssuePage from './SafetyIssuePage';
import AdminDashboard from './AdminDashboard';
import './App.css';

// ── Guest user — no login required ──────────────────────────
// role options: 'student' | 'teacher' | 'admin'
// Change role here to switch what nav items appear
const GUEST_USER = {
  uid:   'guest-001',
  name:  'Guest User',
  email: 'guest@campus.edu',
  role:  'admin',   // 'admin' shows all features
};

function App() {
  const user = GUEST_USER;
  const [page, setPage] = useState('dashboard');

  // All nav items — visible to everyone since no login
  const navItems = [
    { key: 'dashboard',       label: '📊 Dashboard'        },
    { key: 'problems',        label: '📋 All Problems'      },
    { key: 'solutions',       label: '✅ All Solutions'     },
    { key: 'status',          label: '🔄 Track Status'      },
    { key: 'safety',          label: '🚨 Safety Issue'      },
    { key: 'submit-problem',  label: '➕ Submit Problem'    },
    { key: 'submit-solution', label: '🛠 Submit Solution'   },
    { key: 'admin',           label: '🛡 Admin Panel'       },
  ];

  const roleColors = { student: '#3b82f6', teacher: '#7c3aed', admin: '#dc2626' };
  const roleLabel  = { student: '🎒 Student', teacher: '📚 Teacher', admin: '🛡 Admin' };

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
        </div>
      </aside>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
