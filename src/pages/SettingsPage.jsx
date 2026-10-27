// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { User, Bell, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function SettingsPage() {
  const { student, setStudent } = useApp();

  const [formData, setFormData] = useState({
    name: student.name,
    preferredName: student.preferredName || '',
    email: student.email,
    major: student.major,
    academicAdvisor: student.academicAdvisor,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dueReminders: true,
    attendanceWarnings: true,
  });

  const [successToast, setSuccessToast] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setStudent((prev) => ({
      ...prev,
      name: formData.name,
      preferredName: formData.preferredName,
      email: formData.email,
      major: formData.major,
      academicAdvisor: formData.academicAdvisor,
    }));
    setSuccessToast('Student profile information updated successfully!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="settings-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Account & Hub Settings</h1>
          <p className="page-main-desc">
            Manage your personal profile details, notification alerts, and academic hub preferences.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="feedback-toast">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div className="flex-title-row">
              <User size={19} className="text-blue-600" />
              <h3 className="card-title">Student Profile Details</h3>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="modal-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">Full Official Name</label>
                <input
                  id="prof-name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-pref">Preferred Name / Greeting</label>
                <input
                  id="prof-pref"
                  type="text"
                  className="form-input"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">Institutional Email</label>
                <input
                  id="prof-email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-major">Degree Major</label>
                <input
                  id="prof-major"
                  type="text"
                  className="form-input"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-advisor">Academic Advisor</label>
              <input
                id="prof-advisor"
                type="text"
                className="form-input"
                value={formData.academicAdvisor}
                onChange={(e) => setFormData({ ...formData, academicAdvisor: e.target.value })}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary-action">
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <div className="flex-title-row">
              <Bell size={19} className="text-blue-600" />
              <h3 className="card-title">Notification Preferences</h3>
            </div>
          </div>

          <div className="toggle-list">
            <label className="toggle-item">
              <div>
                <span className="toggle-title">Assignment Due Date Reminders</span>
                <p className="toggle-desc">Receive notifications 24h and 2h before assignment deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.dueReminders}
                onChange={(e) => setNotifications({ ...notifications, dueReminders: e.target.checked })}
              />
            </label>

            <label className="toggle-item">
              <div>
                <span className="toggle-title">Attendance Threshold Warnings</span>
                <p className="toggle-desc">Get urgent alert if any course drops below 75% attendance</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.attendanceWarnings}
                onChange={(e) =>
                  setNotifications({ ...notifications, attendanceWarnings: e.target.checked })
                }
              />
            </label>

            <label className="toggle-item">
              <div>
                <span className="toggle-title">Campus Bulletin Emails</span>
                <p className="toggle-desc">Send email digest for high-priority exam announcements</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
