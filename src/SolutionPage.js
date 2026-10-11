import React from 'react';
import './SolutionPage.css';

const SolutionPage = () => {
  // Demo Project Data (In actual app, this will come from props or API)
  const project = {
    title: 'Smart Campus Waste Management System',
    category: 'IoT & CleanTech',
    studentName: 'Rahul Sharma & Team',
    college: 'ABC Institute of Technology',
    submittedDate: '12 Oct 2026',
    problemStatement:
      'Campus dustbins frequently overflow, causing unhygienic conditions and manual inspection wastes a lot of time and resources.',
    solutionOverview:
      'An IoT-based dustbin monitor with ultrasonic sensors that tracks trash levels in real-time and alerts waste management staff when bins reach 80% capacity.',
    techStack: ['React JS', 'Node.js', 'ESP8266 Microcontroller', 'Firebase', 'IoT Sensors'],
    demoLink: 'https://github.com',
    pptLink: '#',
    status: 'Approved / Selected for Finals',
  };

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