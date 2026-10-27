// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  PieChart,
  Megaphone,
  GraduationCap,
  Settings,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/timetable', label: 'Class Timetable', icon: CalendarDays },
  { path: '/assignments', label: 'Assignments', icon: FileCheck2 },
  { path: '/attendance', label: 'Attendance', icon: PieChart },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/grades', label: 'Grades & GPA', icon: GraduationCap },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { pendingAssignmentsCount, unreadCount } = useApp();
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand / Logo Section */}
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-logo-container" onClick={handleLinkClick}>
            <div className="brand-icon">
              <BookOpen size={22} color="#ffffff" />
            </div>
            <div className="brand-text">
              <span className="brand-title">EduPulse</span>
              <span className="brand-subtitle">Student Hub</span>
            </div>
          </NavLink>
          {/* Mobile close button */}
          <button
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <p className="nav-section-title">MAIN MENU</p>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/' || location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>

                    {item.path === '/assignments' && pendingAssignmentsCount > 0 && (
                      <span className="nav-pill badge-warning">{pendingAssignmentsCount}</span>
                    )}

                    {item.path === '/announcements' && unreadCount > 0 && (
                      <span className="nav-pill badge-primary">{unreadCount}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Semester Status Widget at bottom of sidebar */}
        <div className="sidebar-footer">
          <div className="semester-badge-card">
            <div className="semester-badge-header">
              <Sparkles size={16} className="text-blue-500" />
              <span>Current Session</span>
            </div>
            <p className="semester-term">Fall Semester 2026</p>
            <div className="semester-progress-bar">
              <div className="semester-progress-fill" style={{ width: '65%' }}></div>
            </div>
            <div className="semester-meta">
              <span>Week 9 of 14</span>
              <span>65% Passed</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
