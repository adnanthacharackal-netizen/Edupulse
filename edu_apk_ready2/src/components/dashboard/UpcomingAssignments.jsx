// src/components/dashboard/UpcomingAssignments.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function UpcomingAssignments() {
  const { assignments, updateAssignmentStatus } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [feedbackToast, setFeedbackToast] = useState(null);
  const navigate = useNavigate();

  const handleTurnIn = (id, title) => {
    updateAssignmentStatus(id, 'Submitted');
    setFeedbackToast(`Submitted "${title}" successfully!`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const filtered = assignments.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return item.status === 'Pending' || item.status === 'In Progress';
    if (activeFilter === 'urgent') return item.priority === 'High';
    return true;
  });

  return (
    <div className="dashboard-card assignments-section">
      <div className="card-header-row">
        <div>
          <div className="flex-title-row">
            <h3 className="card-title">Upcoming Assignments</h3>
            <span className="count-badge">{assignments.length} Total</span>
          </div>
          <p className="card-subtitle">Keep track of coursework deadlines and submissions</p>
        </div>

        {/* Filter buttons */}
        <div className="filter-button-group">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${activeFilter === 'urgent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('urgent')}
          >
            High Priority
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="feedback-toast">
          <CheckCircle2 size={16} />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Assignment Cards Grid */}
      <div className="assignment-cards-container">
        {filtered.slice(0, 4).map((item) => {
          const isSubmitted = item.status === 'Submitted';

          return (
            <div
              key={item.id}
              className={`assignment-card priority-border-${item.priority.toLowerCase()} ${
                isSubmitted ? 'assignment-card-submitted' : ''
              }`}
            >
              <div className="assignment-top">
                <div className="assignment-course-tag">
                  <span className="asg-code">{item.courseCode}</span>
                  <span className="asg-name">• {item.courseName}</span>
                </div>

                <div className="asg-badges-group">
                  <span className={`priority-badge priority-${item.priority.toLowerCase()}`}>
                    {item.priority} Priority
                  </span>
                  <span
                    className={`asg-status-badge status-${item.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <h4 className="assignment-title">{item.title}</h4>

              <div className="assignment-info-grid">
                <div className="asg-info-item">
                  <Calendar size={14} className="asg-info-icon" />
                  <span>Due: {item.displayDate || item.dueDate}</span>
                </div>
                <div className="asg-info-item">
                  <Clock size={14} className="asg-info-icon text-amber-600" />
                  <span className="asg-days-left">{item.daysLeft}</span>
                </div>
              </div>

              {/* Progress Bar & Type */}
              <div className="assignment-bottom-row">
                <div className="asg-points-info">
                  <span className="asg-points">{item.points} pts</span>
                  <span className="asg-type-tag">{item.submissionType}</span>
                </div>

                <div className="asg-actions">
                  {isSubmitted ? (
                    <span className="submitted-confirmation">
                      <CheckCircle2 size={16} /> Submitted
                    </span>
                  ) : (
                    <button
                      className="submit-action-btn"
                      onClick={() => handleTurnIn(item.id, item.title)}
                      title="Turn in assignment"
                    >
                      <UploadCloud size={15} />
                      <span>Turn In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-footer-action">
        <button
          className="link-btn-text"
          onClick={() => navigate('/assignments')}
        >
          <span>Manage All {assignments.length} Assignments & Add New</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
