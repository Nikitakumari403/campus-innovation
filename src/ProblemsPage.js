import React, { useState, useEffect } from 'react';
import { getProblems } from './store';

const statusClass = { Solved: 'badge-green', 'In Progress': 'badge-orange', Pending: 'badge-red' };

const ProblemsPage = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const fmt = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Problems</h1>
        <p className="page-sub">{problems.length} problem{problems.length !== 1 ? 's' : ''} submitted</p>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="🔍 Search problems…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {['All', 'Pending', 'In Progress', 'Solved'].map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No problems found.</div>
      ) : (
        <div className="card-list">
          {filtered.map(p => (
            <div key={p.id} className="problem-card">
              <div className="problem-card-top">
                <div style={{ flex: 1 }}>
                  <span className="category-pill">{p.category}</span>
                  <h3 className="problem-card-title">{p.title}</h3>
                  <p className="problem-card-desc">{p.description}</p>
                  {p.status === 'Solved' && p.solution && (
                    <div className="inline-solution">
                      <span className="inline-solution-label">✅ Solution:</span>
                      <span className="inline-solution-text">{p.solution}</span>
                      {p.solvedBy && <span className="inline-solved-by">— by {p.solvedBy}</span>}
                    </div>
                  )}
                </div>
                <span className={`status-badge ${statusClass[p.status]}`}>{p.status}</span>
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
  );
};

export default ProblemsPage;
