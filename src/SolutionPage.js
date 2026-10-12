import React from 'react';
import './SolutionPage.css';

{

  return (
    <div className="solution-container">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back to Projects
      </button>

      <div className="solution-header">
        <span className="category-tag">{project.category}</span>
        <h1 className="solution-title">{project.title}</h1>
        <div className="author-info">
          By <strong>{project.studentName}</strong> | {project.college} | Submitted on {project.submittedDate}
        </div>
      </div>

      <div className="solution-grid">
        {/* Left Column: Details */}
        <div className="main-content">
          <div className="section-box">
            <h3>Problem Statement</h3>
            <p>{project.problemStatement}</p>
          </div>

          <div className="section-box">
            <h3>Proposed Solution</h3>
            <p>{project.solutionOverview}</p>
          </div>

          <div className="section-box">
            <h3>Tech Stack Used</h3>
            <div className="tech-stack">
              {project.techStack.map((tech, index) => (
                <span key={index} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Quick Info */}
        <div className="sidebar">
          <div className="section-box">
            <h3>Project Links</h3>
            <a href={project.demoLink} target="_blank" rel="noreferrer" className="action-btn">
              View Github Repository
            </a>
            <a href={project.pptLink} className="action-btn secondary">
              Download Presentation (PPT)
            </a>
          </div>

          <div className="section-box">
            <h3>Status</h3>
            <p style={{ fontWeight: '600', color: '#2b6cb0', margin: 0 }}>
              {project.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;