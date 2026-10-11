import React, { useState, useEffect } from 'react';
import { getProblems, addProblem as storeProblem, deleteProblem } from './store';

const CATEGORIES = ['Infrastructure', 'Facilities', 'Maintenance', 'Academic', 'Technology', 'Safety', 'Other'];

const ProblemSubmission = ({ user, onDone }) => {
  const [form, setForm]           = useState({ title: '', category: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');
  const [myProblems, setMyProblems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId]   = useState(null);
  const [confirmId, setConfirmId]     = useState(null);

  const canDelete = (p) =>
    p.submittedUID === user.uid || user.role === 'admin';

  const loadMyProblems = async () => {
    setLoadingList(true);
    try {
      const all = await getProblems();
      // Students see only their own; admin sees all
      if (user.role === 'admin') {
        setMyProblems(all);
      } else {
        setMyProblems(all.filter(p => p.submittedUID === user.uid));
      }
    } catch {
      // silently ignore
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { loadMyProblems(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await storeProblem({
        title:        form.title,
        category:     form.category,
        description:  form.description,
        submittedBy:  user.name,
        submittedUID: user.uid,
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm({ title: '', category: '', description: '' }); onDone(); }, 1500);
    } catch {
      setError('Failed to submit. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProblem(id);
      setMyProblems(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN');
  };

  const statusClass = { Solved: 'badge-green', 'In Progress': 'badge-orange', Pending: 'badge-red' };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Submit a Problem</h1>
        <p className="page-sub">Report a campus issue — teachers will provide a solution</p>
      </div>

      {/* ── Submit Form ── */}
      <div className="form-card">
        {submitted ? (
          <div className="success-banner">✅ Problem submitted successfully! Redirecting…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Problem Title *</label>
              <input name="title" className="form-input" placeholder="Brief title of the problem"
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-input" value={form.category} onChange={handleChange} required>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Problem Description *</label>
              <textarea name="description" className="form-input form-textarea"
                placeholder="Describe the problem in detail…"
                value={form.description} onChange={handleChange} required rows={5} />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="primary-btn">📤 Submit Problem</button>
          </form>
        )}
      </div>

      {/* ── My Problems List with Delete ── */}
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: '#1f2328' }}>
          {user.role === 'admin' ? '🗂 All Submitted Problems' : '📋 My Submitted Problems'}
        </h2>

        {loadingList ? (
          <div className="empty-state">Loading…</div>
        ) : myProblems.length === 0 ? (
          <div className="empty-state">No problems submitted yet.</div>
        ) : (
          <div className="card-list">
            {myProblems.map(p => (
              <div key={p.id} className="problem-card">
                <div className="problem-card-top">
                  <div style={{ flex: 1 }}>
                    <span className="category-pill">{p.category}</span>
                    <h3 className="problem-card-title">{p.title}</h3>
                    <p className="problem-card-desc">{p.description}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`status-badge ${statusClass[p.status] || 'badge-red'}`}>{p.status}</span>
                    {canDelete(p) && (
                      confirmId === p.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="delete-confirm-btn"
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                          >
                            {deletingId === p.id ? '⏳' : '✅ Yes, Delete'}
                          </button>
                          <button
                            className="delete-cancel-btn"
                            onClick={() => setConfirmId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => setConfirmId(p.id)}
                        >
                          🗑 Delete
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="problem-card-footer">
                  <span>👤 {p.submittedBy}</span>
                  <span>📅 {fmt(p.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSubmission;
