import React, { useState, useEffect } from 'react';
import { getProblems, updateProblem } from './store';

const SolutionSubmission = ({ user, onDone }) => {
  const [problems, setProblems]     = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [solution, setSolution]     = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    getProblems()
      .then(all => setProblems(all.filter(p => p.status !== 'Solved')))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !solution.trim()) return;
    setError('');
    try {
      await updateProblem(selectedId, {
        solution:  solution,
        solvedBy:  user.name,
        solvedUID: user.uid,
        status:    'Solved',
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setSelectedId(''); setSolution(''); onDone(); }, 1500);
    } catch {
      setError('Failed to submit solution. Please try again.');
    }
  };

  const selected = problems.find(p => p.id === selectedId);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Submit a Solution</h1>
        <p className="page-sub">Pick a student's problem and provide the solution</p>
      </div>

      <div className="form-card">
        {submitted ? (
          <div className="success-banner">✅ Solution submitted! Problem marked as Solved.</div>
        ) : loading ? (
          <div className="empty-state">Loading problems…</div>
        ) : problems.length === 0 ? (
          <div className="empty-state">🎉 All problems have been solved!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Problem *</label>
              <select className="form-input" value={selectedId}
                onChange={e => setSelectedId(e.target.value)} required>
                <option value="">-- Select a Problem --</option>
                {problems.map(p => (
                  <option key={p.id} value={p.id}>[{p.status}] {p.title}</option>
                ))}
              </select>
            </div>

            {selected && (
              <div className="problem-preview">
                <div className="preview-label">Problem Details</div>
                <div className="preview-title">{selected.title}</div>
                <div className="preview-desc">{selected.description}</div>
                <div className="preview-meta">
                  Category: {selected.category} &nbsp;|&nbsp;
                  Submitted by: <strong>{selected.submittedBy}</strong>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Your Solution *</label>
              <textarea className="form-input form-textarea"
                placeholder="Describe the solution clearly…"
                value={solution} onChange={e => setSolution(e.target.value)}
                required rows={5} />
            </div>

            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="primary-btn">🛠 Submit Solution</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SolutionSubmission;
