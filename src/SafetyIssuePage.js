import React, { useState, useEffect } from 'react';
import { getSafetyIssues, addSafetyIssue, deleteSafetyIssue } from './store';

const SAFETY_CATEGORIES = [
  '🔥 Fire Hazard',
  '⚡ Electrical Issue',
  '🚧 Structural Damage',
  '💧 Flooding / Water Leakage',
  '🧪 Chemical / Lab Hazard',
  '🚑 Medical Emergency Area',
  '🔒 Security Threat',
  '💡 Lighting Failure',
  '🚪 Blocked Exit / Emergency Route',
  '🌿 Environmental Hazard',
  '📡 Equipment Malfunction',
  '⚠️ Other Safety Concern',
];

const URGENCY_LEVELS = [
  { value: 'Critical',  label: '🔴 Critical — Immediate danger',  color: '#dc2626' },
  { value: 'High',      label: '🟠 High — Needs urgent attention', color: '#ea580c' },
  { value: 'Medium',    label: '🟡 Medium — Fix within a day',     color: '#ca8a04' },
  { value: 'Low',       label: '🟢 Low — Non-urgent',              color: '#16a34a' },
];

const statusClass = {
  Reported:    'badge-red',
  'In Review': 'badge-orange',
  Resolved:    'badge-green',
};

const urgencyColor = { Critical: '#dc2626', High: '#ea580c', Medium: '#ca8a04', Low: '#16a34a' };

const SafetyIssuePage = ({ user }) => {
  const [form, setForm] = useState({
    title: '', category: '', urgency: 'High', location: '', description: '',
  });
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myIssues, setMyIssues]     = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [confirmId, setConfirmId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const canDelete = (issue) => issue.reportedUID === user.uid || user.role === 'admin';

  const loadIssues = async () => {
    setLoadingList(true);
    try {
      const all = await getSafetyIssues();
      setMyIssues(user.role === 'admin'
        ? all
        : all.filter(i => i.reportedUID === user.uid)
      );
    } catch {
      // silently ignore load error
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { loadIssues(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { setError('Please select a category.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await addSafetyIssue({
        title:        form.title,
        category:     form.category,
        urgency:      form.urgency,
        location:     form.location,
        description:  form.description,
        reportedBy:   user.name,
        reportedUID:  user.uid,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ title: '', category: '', urgency: 'High', location: '', description: '' });
        loadIssues();
      }, 1600);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteSafetyIssue(id);
      setMyIssues(prev => prev.filter(i => i.id !== id));
    } catch {
      setError('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🚨 Report a Safety Issue</h1>
        <p className="page-sub">Report hazards, emergencies, or unsafe conditions on campus immediately</p>
      </div>

      {/* ── Report Form ── */}
      <div className="form-card">
        {submitted ? (
          <div className="success-banner">
            ✅ Safety issue reported successfully! Campus safety team will be notified.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Issue Title *</label>
              <input
                name="title"
                className="form-input"
                placeholder="Brief title of the safety issue"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Issue Category */}
            <div className="form-group">
              <label className="form-label">Issue Category *</label>
              <div className="safety-cat-grid">
                {SAFETY_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`safety-cat-btn ${form.category === cat ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div className="form-group">
              <label className="form-label">Urgency Level *</label>
              <div className="urgency-grid">
                {URGENCY_LEVELS.map(u => (
                  <button
                    key={u.value}
                    type="button"
                    className={`urgency-btn ${form.urgency === u.value ? 'selected' : ''}`}
                    style={form.urgency === u.value
                      ? { borderColor: u.color, background: u.color + '15', color: u.color }
                      : {}}
                    onClick={() => setForm({ ...form, urgency: u.value })}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Building *</label>
              <input
                name="location"
                className="form-input"
                placeholder="e.g. Block B, Room 204, Near Main Gate…"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-input form-textarea"
                placeholder="Describe the safety issue in detail — what you saw, how serious it is…"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="primary-btn danger-btn" disabled={submitting}>
              {submitting ? '⏳ Submitting…' : '🚨 Submit Safety Report'}
            </button>
          </form>
        )}
      </div>

      {/* ── My Reported Issues ── */}
      <div style={{ marginTop: '36px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: '#1f2328' }}>
          {user.role === 'admin' ? '🗂 All Reported Safety Issues' : '📋 My Reported Issues'}
        </h2>

        {loadingList ? (
          <div className="empty-state">Loading…</div>
        ) : myIssues.length === 0 ? (
          <div className="empty-state">No safety issues reported yet.</div>
        ) : (
          <div className="card-list">
            {myIssues.map(issue => (
              <div key={issue.id} className="safety-card">
                <div className="safety-card-top">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span className="category-pill">{issue.category}</span>
                      <span
                        className="urgency-pill"
                        style={{ background: (urgencyColor[issue.urgency] || '#64748b') + '18', color: urgencyColor[issue.urgency] || '#64748b' }}
                      >
                        ⚡ {issue.urgency}
                      </span>
                    </div>
                    <h3 className="problem-card-title">{issue.title}</h3>
                    <p className="problem-card-desc">{issue.description}</p>
                    {issue.location && (
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                        📍 {issue.location}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`status-badge ${statusClass[issue.status] || 'badge-red'}`}>
                      {issue.status}
                    </span>
                    {canDelete(issue) && (
                      confirmId === issue.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="delete-confirm-btn"
                            onClick={() => handleDelete(issue.id)}
                            disabled={deletingId === issue.id}
                          >
                            {deletingId === issue.id ? '⏳' : '✅ Yes, Delete'}
                          </button>
                          <button className="delete-cancel-btn" onClick={() => setConfirmId(null)}>
                            ❌ Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setConfirmId(issue.id)}>
                          🗑 Delete
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="problem-card-footer">
                  <span>👤 {issue.reportedBy}</span>
                  <span>📅 {fmt(issue.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyIssuePage;
