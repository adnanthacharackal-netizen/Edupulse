// src/pages/AssignmentsPage.jsx
import React, { useState } from 'react';
import {
  PlusCircle,
  Calendar,
  Clock,
  CheckCircle2,
  UploadCloud,
  Trash2,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/useApp';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

const statusOptions = ['All', 'Pending', 'In Progress', 'Submitted', 'Overdue'];

export default function AssignmentsPage() {
  const { assignments, addAssignment, updateAssignmentStatus, deleteAssignment } = useApp();

  // Filters & Search
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseCode: 'CS 301',
    courseName: 'Database Systems',
    dueDate: '',
    dueTime: '11:59 PM',
    priority: 'Medium',
    points: 100,
    submissionType: 'File Upload (PDF/ZIP)',
    notes: '',
  });

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState({});

  // Summary counts
  const totalCount = assignments.length;
  const pendingCount = assignments.filter(
    (a) => a.status === 'Pending' || a.status === 'In Progress'
  ).length;
  const submittedCount = assignments.filter((a) => a.status === 'Submitted').length;
  const overdueCount = assignments.filter((a) => a.status === 'Overdue').length;

  // Filter logic
  const filteredAssignments = assignments.filter((item) => {
    // Status Filter
    if (selectedStatus !== 'All' && item.status !== selectedStatus) {
      return false;
    }
    // Priority Filter
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCourse = item.courseCode.toLowerCase().includes(q) || item.courseName.toLowerCase().includes(q);
      if (!matchTitle && !matchCourse) return false;
    }
    return true;
  });

  // Status Action Handlers
  const handleStatusChange = (id, newStatus, title) => {
    updateAssignmentStatus(id, newStatus);
    setToastMsg(`Assignment "${title}" marked as ${newStatus}!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      deleteAssignment(id);
      setToastMsg(`Removed assignment "${title}".`);
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  // Form submit handler with validation
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Assignment title is required.';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long.';
    }

    if (!formData.courseCode.trim()) {
      errors.courseCode = 'Course code is required.';
    }

    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required.';
    }

    if (isNaN(formData.points) || Number(formData.points) <= 0) {
      errors.points = 'Points must be a positive number greater than 0.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Format display date
    const displayDate = `${formData.dueDate} • ${formData.dueTime}`;

    addAssignment({
      title: formData.title.trim(),
      courseCode: formData.courseCode.trim(),
      courseName: formData.courseName.trim(),
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      displayDate: displayDate,
      daysLeft: 'Due Soon',
      priority: formData.priority,
      status: 'Pending',
      points: Number(formData.points),
      submissionType: formData.submissionType,
      notes: formData.notes.trim(),
    });

    setToastMsg(`New assignment "${formData.title}" added successfully!`);
    setIsAddModalOpen(false);
    setFormErrors({});
    setFormData({
      title: '',
      courseCode: 'CS 301',
      courseName: 'Database Systems',
      dueDate: '',
      dueTime: '11:59 PM',
      priority: 'Medium',
      points: 100,
      submissionType: 'File Upload (PDF/ZIP)',
      notes: '',
    });
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="assignments-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Coursework & Assignments</h1>
          <p className="page-main-desc">
            Track submissions, manage upcoming deadlines, and upload your academic projects.
          </p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle size={17} />
          <span>Add New Assignment</span>
        </button>
      </div>

      {/* Success Notification */}
      {toastMsg && (
        <div className="feedback-toast">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Overview Stat Counters */}
      <div className="asg-summary-grid">
        <div className="asg-summary-card">
          <span className="asg-summary-label">Total Assigned</span>
          <span className="asg-summary-val">{totalCount}</span>
        </div>
        <div className="asg-summary-card">
          <span className="asg-summary-label">Pending / In Progress</span>
          <span className="asg-summary-val text-blue-600">{pendingCount}</span>
        </div>
        <div className="asg-summary-card">
          <span className="asg-summary-label">Completed & Submitted</span>
          <span className="asg-summary-val text-emerald-600">{submittedCount}</span>
        </div>
        <div className="asg-summary-card">
          <span className="asg-summary-label">Past Due / Overdue</span>
          <span className="asg-summary-val text-rose-600">{overdueCount}</span>
        </div>
      </div>

      {/* Search & Filters Card */}
      <div className="dashboard-card filters-control-card">
        <div className="asg-controls-row">
          {/* Search box */}
          <div className="asg-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, subject or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input"
            />
          </div>

          {/* Priority dropdown */}
          <div className="asg-dropdown-filter">
            <Filter size={15} className="text-slate-500" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="form-select filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs-row">
          <span className="status-tabs-label">Filter by Status:</span>
          <div className="status-tabs-list">
            {statusOptions.map((st) => (
              <button
                key={st}
                className={`status-tab-btn ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st}
                <span className="tab-count-bubble">
                  {st === 'All'
                    ? assignments.length
                    : assignments.filter((a) => a.status === st).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List / Empty State */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments match your criteria"
          description={`We couldn't find any assignments with status "${selectedStatus}"${
            selectedPriority !== 'All' ? ` and priority "${selectedPriority}"` : ''
          }.`}
          actionLabel="Reset All Filters"
          onAction={() => {
            setSelectedStatus('All');
            setSelectedPriority('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="assignments-cards-grid">
          {filteredAssignments.map((item) => {
            const isSubmitted = item.status === 'Submitted';
            const isOverdue = item.status === 'Overdue';

            return (
              <div
                key={item.id}
                className={`assignment-page-card priority-border-${item.priority.toLowerCase()} ${
                  isSubmitted ? 'asg-card-submitted' : ''
                } ${isOverdue ? 'asg-card-overdue' : ''}`}
              >
                <div className="asg-card-top-row">
                  <div className="asg-code-name">
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

                <h3 className="asg-card-title">{item.title}</h3>
                {item.notes && <p className="asg-card-notes">{item.notes}</p>}

                <div className="asg-card-meta">
                  <div className="asg-info-item">
                    <Calendar size={14} className="asg-info-icon" />
                    <span>Due: {item.displayDate || item.dueDate}</span>
                  </div>
                  <div className="asg-info-item">
                    <Clock
                      size={14}
                      className={isOverdue ? 'text-rose-600' : 'text-amber-600'}
                    />
                    <span className={isOverdue ? 'text-rose-600 font-bold' : 'asg-days-left'}>
                      {item.daysLeft}
                    </span>
                  </div>
                </div>

                <div className="asg-card-footer-row">
                  <div className="asg-points-info">
                    <span className="asg-points">{item.points} pts</span>
                    <span className="asg-type-tag">{item.submissionType}</span>
                  </div>

                  {/* Actions: Turn in, Reopen, Delete */}
                  <div className="asg-card-actions">
                    {isSubmitted ? (
                      <button
                        className="btn-action-ghost"
                        onClick={() => handleStatusChange(item.id, 'In Progress', item.title)}
                        title="Reopen assignment"
                      >
                        <RotateCcw size={14} />
                        <span>Reopen</span>
                      </button>
                    ) : (
                      <button
                        className="btn-action-primary"
                        onClick={() => handleStatusChange(item.id, 'Submitted', item.title)}
                        title="Submit assignment"
                      >
                        <UploadCloud size={14} />
                        <span>Turn In</span>
                      </button>
                    )}

                    <button
                      className="btn-action-delete"
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete assignment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add New Assignment */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Assignment"
        subtitle="Create a new coursework task or submission deadline"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="asg-title">
              Assignment Title <span className="required-star">*</span>
            </label>
            <input
              id="asg-title"
              type="text"
              placeholder="e.g. Distributed Consensus Essay"
              className={`form-input ${formErrors.title ? 'form-input-error' : ''}`}
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
            />
            {formErrors.title && <p className="form-error-msg">{formErrors.title}</p>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="asg-code">
                Course Code <span className="required-star">*</span>
              </label>
              <select
                id="asg-code"
                className="form-select"
                value={formData.courseCode}
                onChange={(e) => {
                  const map = {
                    'CS 301': 'Database Systems',
                    'CS 310': 'Data Structures & Algorithms',
                    'MATH 240': 'Linear Algebra',
                    'CS 335': 'Web Applications Engineering',
                    'HUM 120': 'Technical Communication',
                  };
                  setFormData({
                    ...formData,
                    courseCode: e.target.value,
                    courseName: map[e.target.value] || 'General Subject',
                  });
                }}
              >
                <option value="CS 301">CS 301 - Database Systems</option>
                <option value="CS 310">CS 310 - Algorithms</option>
                <option value="MATH 240">MATH 240 - Linear Algebra</option>
                <option value="CS 335">CS 335 - Web Applications</option>
                <option value="HUM 120">HUM 120 - Communication</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="asg-priority">
                Priority Level
              </label>
              <select
                id="asg-priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="asg-due-date">
                Due Date <span className="required-star">*</span>
              </label>
              <input
                id="asg-due-date"
                type="date"
                className={`form-input ${formErrors.dueDate ? 'form-input-error' : ''}`}
                value={formData.dueDate}
                onChange={(e) => {
                  setFormData({ ...formData, dueDate: e.target.value });
                  if (formErrors.dueDate) setFormErrors({ ...formErrors, dueDate: null });
                }}
              />
              {formErrors.dueDate && <p className="form-error-msg">{formErrors.dueDate}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="asg-points">
                Points (Max Score) <span className="required-star">*</span>
              </label>
              <input
                id="asg-points"
                type="number"
                min="1"
                max="500"
                className={`form-input ${formErrors.points ? 'form-input-error' : ''}`}
                value={formData.points}
                onChange={(e) => {
                  setFormData({ ...formData, points: e.target.value });
                  if (formErrors.points) setFormErrors({ ...formErrors, points: null });
                }}
              />
              {formErrors.points && <p className="form-error-msg">{formErrors.points}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="asg-type">
              Submission Format
            </label>
            <select
              id="asg-type"
              className="form-select"
              value={formData.submissionType}
              onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
            >
              <option value="File Upload (PDF/ZIP)">File Upload (PDF/ZIP)</option>
              <option value="GitHub Repo URL">GitHub Repo URL</option>
              <option value="Online Portal Quiz">Online Portal Quiz</option>
              <option value="Live Demo / Presentation">Live Demo / Presentation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="asg-notes">
              Instructions & Notes
            </label>
            <textarea
              id="asg-notes"
              rows="3"
              placeholder="Add professor guidelines, rubric hints, or team instructions..."
              className="form-input form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-save">
              Create Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
