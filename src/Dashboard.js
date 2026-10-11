import React, { useState, useEffect } from 'react';
import { getProblems } from './store';

const statusColor = (s) => s === 'Solved' ? '#22c55e' : s === 'In Progress' ? '#f59e0b' : '#ef4444';

const Dashboard = ({ user, setPage }) => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    getProblems().then(setProblems);
  }, []);

  const total      = problems.length;
  const solved     = problems.filter(p => p.status === 'Solved').length;
  const inProgress = problems.filter(p => p.status === 'In Progress').length;
  const pending    = problems.filter(p => p.status === 'Pending').length;
  const recent     = problems.slice(0, 4);

  const categories = {};
  problems.forEach(p => { if (p.category) categories[p.category] = (categories[p.category] || 0) + 1; });

  const roleColors = { student: '#3b82f6', teacher: '#7c3aed', admin: '#dc2626' };
  const roleLabel  = { student: '🎒 Student', teacher: '📚 Teacher', admin: '🛡 Admin' };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">
          Welcome back, <strong>{user.name}</strong> &nbsp;
          <span className="role-tag" style={{ background: roleColors[user.role] + '22', color: roleColors[user.role] }}>
            {roleLabel[user.role]}
          </span>
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue" style={{ cursor: 'pointer' }} onClick={() => setPage('problems')}>
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total Problems</div>
        </div>
        <div className="stat-card green" style={{ cursor: 'pointer' }} onClick={() => setPage('solutions')}>
          <div className="stat-number">{solved}</div>
          <div className="stat-label">Total Solutions</div>
        </div>
        <div className="stat-card orange" style={{ cursor: 'pointer' }} onClick={() => setPage('status')}>
          <div className="stat-number">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card red" style={{ cursor: 'pointer' }} onClick={() => setPage('status')}>
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="dash-box">
          <h3>Recent Problems</h3>
          {recent.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No problems submitted yet.</p>
          ) : recent.map(p => (
            <div key={p.id} className="recent-item">
              <div className="recent-title">{p.title}</div>
              <div className="recent-meta">
                <span className="category-pill">{p.category}</span>
                <span className="status-dot" style={{ background: statusColor(p.status) }}></span>
                <span style={{ fontSize: '12px', color: '#666' }}>{p.status}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>by {p.submittedBy}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-box">
          <h3>Problems by Category</h3>
          {Object.keys(categories).length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>No data yet.</p>
          ) : Object.entries(categories).map(([cat, count]) => (
            <div key={cat} className="category-bar-row">
              <span className="cat-name">{cat}</span>
              <div className="cat-bar-bg">
                <div className="cat-bar-fill" style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
              </div>
              <span className="cat-count">{count}</span>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>Resolution Rate</h3>
            <div className="resolution-ring">
              <svg viewBox="0 0 36 36" className="ring-svg">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray={`${total > 0 ? (solved / total) * 100 : 0} 100`}
                  strokeDashoffset="25" strokeLinecap="round" />
              </svg>
              <div className="ring-label">
                <div className="ring-pct">{total > 0 ? Math.round((solved / total) * 100) : 0}%</div>
                <div className="ring-sub">Solved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
