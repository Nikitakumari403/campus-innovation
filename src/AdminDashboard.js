import React, { useState, useEffect } from 'react';
import { getProblems, updateProblem, deleteProblem } from './store';
import { getSafetyIssues, updateSafetyIssue, deleteSafetyIssue } from './store';

const PROBLEM_STATUSES = ['Pending', 'In Progress', 'Solved'];
const SAFETY_STATUSES  = ['Reported', 'In Review', 'Resolved'];

const statusClass = {
  Pending:     'badge-red',
  'In Progress': 'badge-orange',
  Solved:      'badge-green',
  Reported:    'badge-red',
  'In Review': 'badge-orange',
  Resolved:    'badge-green',
};

const urgencyColor = { Critical: '#dc2626', High: '#ea580c', Medium: '#ca8a04', Low: '#16a34a' };

const AdminDashboard = ({ user }) => {
  const [tab, setTab]             = useState('problems');
  const [problems, setProblems]   = useState([]);
  const [safety, setSafety]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([getProblems(), getSafetyIssues()]);
      setProblems(p);
      setSafety(s);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const fmt = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN');
  };

  /* ── Problem handlers ── */
  const handleProblemStatus = async (id, newStatus) => {
    await updateProblem(id, { status: newStatus });
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleProblemDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProblem(id);
      setProblems(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  /* ── Safety handlers ── */
  const handleSafetyStatus = async (id, newStatus) => {
    await updateSafetyIssue(id, { status: newStatus });
    setSafety(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleSafetyDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteSafetyIssue(id);
      setSafety(prev => prev.filter(s => s.id !== id));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.submittedBy?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSafety = safety.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalProblems:  problems.length,
    solvedProblems: problems.filter(p => p.status === 'Solved').length,
    pendingProblems: problems.filter(p => p.status === 'Pending').length,
    totalSafety:    safety.length,
    resolvedSafety: safety.filter(s => s.status === 'Resolved').length,
    criticalSafety: safety.filter(s => s.urgency === 'Critical').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🛡 Admin Dashboard</h1>
        <p className="page-sub">Full overview — manage all problems and safety issues</p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '28px' }}>
        <div className="stat-card blue">
          <div className="stat-number">{stats.totalProblems}</div>
          <div className="stat-label">Total Problems</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{stats.solvedProblems}</div>
          <div className="stat-label">Solved Problems</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{stats.pendingProblems}</div>
          <div className="stat-label">Pending Problems</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{stats.totalSafety}</div>
          <div className="stat-label">Safety Reports</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{stats.resolvedSafety}</div>
          <div className="stat-label">Safety Resolved</div>
        </div>
        <div className="stat-card red" style={{ borderColor: '#dc2626' }}>
          <div className="stat-number" style={{ color: '#dc2626' }}>{stats.criticalSafety}</div>
          <div className="stat-label">🔴 Critical Issues</div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${tab === 'problems' ? 'active' : ''}`}
          onClick={() => { setTab('problems'); setSearch(''); setConfirmId(null); }}
        >
          📋 Campus Problems ({problems.length})
        </button>
        <button
          className={`admin-tab-btn ${tab === 'safety' ? 'active' : ''}`}
          onClick={() => { setTab('safety'); setSearch(''); setConfirmId(null); }}
        >
          🚨 Safety Issues ({safety.length})
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: '18px' }}>
        <input
          className="search-input"
          placeholder={tab === 'problems' ? '🔍 Search problems…' : '🔍 Search safety issues…'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : tab === 'problems' ? (
        /* ══ PROBLEMS TABLE ══ */
        filteredProblems.length === 0 ? (
          <div className="empty-state">No problems found.</div>
        ) : (
          <div className="status-table-wrapper">
            <table className="status-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem Title</th>
                  <th>Category</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="table-title">{p.title}</div>
                      <div className="table-sub">{p.description?.substring(0, 55)}…</div>
                    </td>
                    <td><span className="category-pill">{p.category}</span></td>
                    <td>{p.submittedBy}</td>
                    <td>{fmt(p.createdAt)}</td>
                    <td><span className={`status-badge ${statusClass[p.status]}`}>{p.status}</span></td>
                    <td>
                      <select
                        className="status-select"
                        value={p.status}
                        onChange={e => handleProblemStatus(p.id, e.target.value)}
                      >
                        {PROBLEM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      {confirmId === p.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="delete-confirm-btn"
                            onClick={() => handleProblemDelete(p.id)}
                            disabled={deletingId === p.id}
                          >
                            {deletingId === p.id ? '⏳' : '✅'}
                          </button>
                          <button className="delete-cancel-btn" onClick={() => setConfirmId(null)}>✕</button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setConfirmId(p.id)}>🗑</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* ══ SAFETY ISSUES TABLE ══ */
        filteredSafety.length === 0 ? (
          <div className="empty-state">No safety issues found.</div>
        ) : (
          <div className="status-table-wrapper">
            <table className="status-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Issue Title</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Location</th>
                  <th>Reported By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSafety.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="table-title">{s.title}</div>
                      <div className="table-sub">{s.description?.substring(0, 50)}…</div>
                    </td>
                    <td><span className="category-pill" style={{ fontSize: '11px' }}>{s.category}</span></td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: (urgencyColor[s.urgency] || '#64748b') + '18',
                          color: urgencyColor[s.urgency] || '#64748b',
                        }}
                      >
                        {s.urgency}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>📍 {s.location || '—'}</td>
                    <td>{s.reportedBy}</td>
                    <td>{fmt(s.createdAt)}</td>
                    <td><span className={`status-badge ${statusClass[s.status]}`}>{s.status}</span></td>
                    <td>
                      <select
                        className="status-select"
                        value={s.status}
                        onChange={e => handleSafetyStatus(s.id, e.target.value)}
                      >
                        {SAFETY_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </td>
                    <td>
                      {confirmId === s.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="delete-confirm-btn"
                            onClick={() => handleSafetyDelete(s.id)}
                            disabled={deletingId === s.id}
                          >
                            {deletingId === s.id ? '⏳' : '✅'}
                          </button>
                          <button className="delete-cancel-btn" onClick={() => setConfirmId(null)}>✕</button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setConfirmId(s.id)}>🗑</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default AdminDashboard;
