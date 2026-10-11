import React, { useState, useEffect } from 'react';
import { getProblems } from './store';

const SolutionsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProblems()
      .then(all => setProblems(all.filter(p => p.status === 'Solved' && p.solution)))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Solutions</h1>
        <p className="page-sub">{problems.length} problem{problems.length !== 1 ? 's' : ''} successfully resolved</p>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : problems.length === 0 ? (
        <div className="empty-state">No solutions submitted yet.</div>
      ) : (
        <div className="card-list">
          {problems.map(p => (
            <div key={p.id} className="solution-card">
              <div className="solution-card-header">
                <span className="category-pill">{p.category}</span>
                <span className="status-badge badge-green">✅ Solved</span>
              </div>
              <h3 className="solution-card-title">{p.title}</h3>

              <div className="solution-block">
                <div className="solution-block-label">🔴 Problem — by {p.submittedBy}</div>
                <p>{p.description}</p>
              </div>

              <div className="solution-block solution-block-green">
                <div className="solution-block-label">🟢 Solution — by {p.solvedBy || 'Teacher'}</div>
                <p>{p.solution}</p>
              </div>

              <div className="problem-card-footer">
                <span>📅 {fmt(p.createdAt)}</span>
                <span>👤 Submitted: {p.submittedBy}</span>
                <span>🛠 Solved: <strong>{p.solvedBy || '—'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionsPage;
