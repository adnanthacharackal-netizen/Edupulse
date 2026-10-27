// src/components/dashboard/WelcomeBanner.jsx
import React from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomeBanner() {
  const { student, attendanceStats, pendingAssignmentsCount } = useApp();
  const navigate = useNavigate();

  const [greeting] = React.useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  return (
    <section className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-badge">
          <span className="live-dot" />
          <span>Fall Semester 2026 • Week 9</span>
        </div>
        <h1 className="welcome-title">
          {greeting}, {student.preferredName || student.name}! 👋
        </h1>
        <p className="welcome-subtitle">
          You have <strong className="highlight-text">{pendingAssignmentsCount} active assignments</strong> to
          complete. Your overall attendance is currently at{' '}
          <strong className="highlight-text">{attendanceStats.percentage}%</strong>.
        </p>

        <div className="welcome-actions">
          <button
            className="action-btn btn-white"
            onClick={() => navigate('/timetable')}
          >
            <Clock size={16} />
            <span>Today's Timetable</span>
          </button>
          <button
            className="action-btn btn-secondary-glass"
            onClick={() => navigate('/assignments')}
          >
            <BookOpen size={16} />
            <span>Assignments ({pendingAssignmentsCount})</span>
          </button>
        </div>
      </div>

      <div className="welcome-stats-highlight">
        <div className="glass-metric">
          <span className="glass-metric-label">Cumulative GPA</span>
          <span className="glass-metric-val">{student.gpa}</span>
          <span className="glass-metric-sub">Out of {student.gpaScale}</span>
        </div>
        <div className="glass-metric">
          <span className="glass-metric-label">Degree Credits</span>
          <span className="glass-metric-val">{student.creditsCompleted}</span>
          <span className="glass-metric-sub">of {student.totalCredits} Completed</span>
        </div>
      </div>
    </section>
  );
}
