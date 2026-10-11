import React, { useState, useEffect } from 'react';
import { getProblems, updateProblem } from './store';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Solved'];
const statusClass = { Solved: 'badge-green', 'In Progress': 'badge-orange', Pending: 'badge-red' };

const StatusDashboard = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateProblem(id, { status: newStatus });
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const canChange = user.role === 'teacher' || user.role === 'admin';

  const fmt = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN');
  };

  const counts = {
    Pending:       problems.filter(p => p.status === 'Pending').length,
    'In Progress': problems.filter(p => p.status === 'In Progress').length,
    Solved:        problems.filter(p => p.status === 'Solved').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Status Dashboard</h1>
        <p className="page-sub">Track the resolution status of every campus problem</p>
      </div>

      <div className="status-summary">
        <div className="status-summary-item red">
          <div className="ss-count">{counts.Pending}</div>
          <div className="ss-label">Pending</div>
        </div>
        <div className="status-summary-item orange">
          <div className="ss-count">{counts['In Progress']}</div>
          <div className="ss-label">In Progress</div>
        </div>
        <div className="status-summary-item green">
          <div className="ss-count">{counts.Solved}</div>
          <div className="ss-label">Solved</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : problems.length === 0 ? (
        <div className="empty-state">No problems submitted yet.</div>
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
                {canChange && <th>Change Status</th>}
              </tr>
            </thead>
            <tbody>
              {problems.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="table-title">{p.title}</div>
                    <div className="table-sub">{p.description?.substring(0, 60)}…</div>
                  </td>
                  <td><span className="category-pill">{p.category}</span></td>
                  <td>{p.submittedBy}</td>
                  <td>{fmt(p.createdAt)}</td>
                  <td><span className={`status-badge ${statusClass[p.status]}`}>{p.status}</span></td>
                  {canChange && (
                    <td>
                      <select className="status-select" value={p.status}
                        onChange={e => handleStatusChange(p.id, e.target.value)}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatusDashboard;
