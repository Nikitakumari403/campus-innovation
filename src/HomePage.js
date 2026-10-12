import React from 'react';

const features = [
  {
    icon: '📋',
    title: 'Submit Problems',
    desc: 'Students can report campus issues — broken equipment, maintenance needs, or academic concerns — directly through the portal.',
    color: '#3b82f6',
  },
  {
    icon: '🛠',
    title: 'Submit Solutions',
    desc: 'Teachers and admins can post solutions to reported problems and mark them as resolved for everyone to see.',
    color: '#7c3aed',
  },
  {
    icon: '🔄',
    title: 'Track Status',
    desc: 'Every problem has a live status — Pending, In Progress, or Solved — so students always know what is happening.',
    color: '#f59e0b',
  },
  {
    icon: '🚨',
    title: 'Safety Issues',
    desc: 'Report urgent safety hazards like electrical faults, flooding, or blocked exits so campus authorities can act fast.',
    color: '#ef4444',
  },
  {
    icon: '🛡',
    title: 'Admin Panel',
    desc: 'Admins get a dedicated panel to manage all problems, safety issues, and user submissions from one place.',
    color: '#dc2626',
  },
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'See real-time stats — total problems, solved count, in-progress items, and category-wise breakdown at a glance.',
    color: '#22c55e',
  },
];

const roles = [
  { icon: '🎒', role: 'Student',  color: '#3b82f6', bg: '#eff6ff', perms: ['View Dashboard', 'Submit Problems', 'Track Status', 'Report Safety Issues', 'View All Solutions'] },
  { icon: '📚', role: 'Teacher',  color: '#7c3aed', bg: '#f5f3ff', perms: ['Everything a Student can do', 'Submit Solutions', 'Manage own Problems'] },
  { icon: '🛡', role: 'Admin',    color: '#dc2626', bg: '#fef2f2', perms: ['Full access to everything', 'Admin Panel', 'Delete any Problem / Safety Issue', 'Manage all Users'] },
];

export default function HomePage({ onGetStarted }) {
  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <div style={s.heroBadge}>🎓 Campus Innovation Portal</div>
        <h1 style={s.heroTitle}>
          Solving Campus Problems,<br />
          <span style={s.heroAccent}>Together.</span>
        </h1>
        <p style={s.heroSub}>
          A unified platform where students report issues, teachers provide solutions,
          and admins keep everything running smoothly — all in one place.
        </p>
        <button style={s.heroBtn} onClick={onGetStarted}>
          🚀 Get Started — Login / Sign Up
        </button>

        {/* Stats row */}
        <div style={s.statRow}>
          {[
            { n: '3 Roles',    l: 'Student · Teacher · Admin' },
            { n: 'Real-time',  l: 'Live Status Tracking'       },
            { n: 'Firebase',   l: 'Cloud Database'             },
            { n: '100% Free',  l: 'Open Campus Tool'           },
          ].map(st => (
            <div key={st.n} style={s.statBox}>
              <div style={s.statN}>{st.n}</div>
              <div style={s.statL}>{st.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}>WHAT YOU CAN DO</div>
        <h2 style={s.sectionTitle}>Everything your campus needs</h2>
        <p style={s.sectionSub}>Six powerful features built to make campus life easier for everyone.</p>

        <div style={s.featureGrid}>
          {features.map(f => (
            <div key={f.title} style={s.featureCard}>
              <div style={{ ...s.featureIcon, background: f.color + '18', color: f.color }}>
                {f.icon}
              </div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ ...s.section, background: '#f8fafc', borderRadius: 20, padding: '48px 40px' }}>
        <div style={s.sectionLabel}>HOW IT WORKS</div>
        <h2 style={s.sectionTitle}>Simple 3-step process</h2>

        <div style={s.stepsRow}>
          {[
            { n: '1', icon: '🔑', title: 'Login or Sign Up',   desc: 'Create an account with your campus email and choose your role — Student, Teacher, or Admin.' },
            { n: '2', icon: '📝', title: 'Submit or Browse',   desc: 'Students submit problems. Teachers post solutions. Everyone can track status in real time.' },
            { n: '3', icon: '✅', title: 'Problem Solved!',    desc: 'Problems get resolved, marked Solved, and appear in the Solutions page for all to see.' },
          ].map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepNum}>{step.n}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROLES ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}>USER ROLES</div>
        <h2 style={s.sectionTitle}>Who is this for?</h2>

        <div style={s.rolesRow}>
          {roles.map(r => (
            <div key={r.role} style={{ ...s.roleCard, borderColor: r.color + '40', background: r.bg }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{r.icon}</div>
              <h3 style={{ ...s.roleTitle, color: r.color }}>{r.role}</h3>
              <ul style={s.roleList}>
                {r.perms.map(p => (
                  <li key={p} style={s.roleItem}>
                    <span style={{ color: r.color, marginRight: 6 }}>✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to make your campus better?</h2>
        <p style={s.ctaSub}>Join now and start reporting or solving campus problems today.</p>
        <button style={s.heroBtn} onClick={onGetStarted}>
          🎓 Login / Sign Up — It's Free
        </button>
      </div>

      {/* ── FOOTER ── */}
      <div style={s.footer}>
        🎓 Campus Innovation Portal — Built with React &amp; Firebase
      </div>
    </div>
  );
}

const s = {
  page:         { fontFamily: "'Segoe UI', sans-serif", color: '#1e293b', background: '#ffffff' },

  /* Hero */
  hero:         { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', textAlign: 'center', padding: '80px 24px 60px' },
  heroBadge:    { display: 'inline-block', background: '#3b82f620', border: '1px solid #3b82f640', color: '#93c5fd', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, marginBottom: 20 },
  heroTitle:    { fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, color: '#f1f5f9' },
  heroAccent:   { color: '#3b82f6' },
  heroSub:      { fontSize: 17, color: '#94a3b8', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 },
  heroBtn:      { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  statRow:      { display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48, flexWrap: 'wrap' },
  statBox:      { background: '#ffffff10', border: '1px solid #ffffff18', borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center' },
  statN:        { fontSize: 18, fontWeight: 800, color: '#f1f5f9' },
  statL:        { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  /* Sections */
  section:      { maxWidth: 1080, margin: '0 auto', padding: '64px 24px' },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#3b82f6', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  sectionTitle: { fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: '#1e293b', marginBottom: 12 },
  sectionSub:   { fontSize: 15, color: '#64748b', marginBottom: 36, maxWidth: 560 },

  /* Features */
  featureGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  featureCard:  { background: '#f8fafc', borderRadius: 16, padding: '28px 24px', border: '1px solid #e2e8f0' },
  featureIcon:  { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 },
  featureTitle: { fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8 },
  featureDesc:  { fontSize: 14, color: '#64748b', lineHeight: 1.6 },

  /* Steps */
  stepsRow:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 },
  stepCard:     { textAlign: 'center', padding: '28px 20px' },
  stepNum:      { width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: '#fff', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  stepIcon:     { fontSize: 36, marginBottom: 12 },
  stepTitle:    { fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 8 },
  stepDesc:     { fontSize: 14, color: '#64748b', lineHeight: 1.6 },

  /* Roles */
  rolesRow:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 },
  roleCard:     { borderRadius: 16, padding: '28px 24px', border: '2px solid', textAlign: 'center' },
  roleTitle:    { fontSize: 20, fontWeight: 800, marginBottom: 16 },
  roleList:     { listStyle: 'none', padding: 0, textAlign: 'left' },
  roleItem:     { fontSize: 14, color: '#374151', padding: '5px 0', borderBottom: '1px solid #e2e8f020', display: 'flex', alignItems: 'center' },

  /* CTA */
  cta:          { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', textAlign: 'center', padding: '72px 24px' },
  ctaTitle:     { fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 },
  ctaSub:       { fontSize: 16, color: '#94a3b8', marginBottom: 32 },

  /* Footer */
  footer:       { textAlign: 'center', padding: '24px', fontSize: 13, color: '#94a3b8', borderTop: '1px solid #e2e8f0' },
};
