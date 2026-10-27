// src/components/layout/BottomNav.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  PieChart,
  Megaphone,
} from 'lucide-react';
import { useApp } from '../../context/useApp';

const mobileTabs = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/timetable', label: 'Schedule', icon: CalendarDays },
  { path: '/assignments', label: 'Tasks', icon: FileCheck2 },
  { path: '/attendance', label: 'Attendance', icon: PieChart },
  { path: '/announcements', label: 'Notices', icon: Megaphone },
];

export default function BottomNav() {
  const { pendingAssignmentsCount, unreadCount } = useApp();
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation Bar">
      <div className="bottom-nav-inner">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === '/'
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(tab.path);

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="bottom-nav-icon-box">
                <Icon size={20} className="bottom-nav-icon" />

                {tab.path === '/assignments' && pendingAssignmentsCount > 0 && (
                  <span className="bottom-nav-badge badge-warning">
                    {pendingAssignmentsCount}
                  </span>
                )}

                {tab.path === '/announcements' && unreadCount > 0 && (
                  <span className="bottom-nav-badge badge-primary">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="bottom-nav-label">{tab.label}</span>
              {isActive && <span className="bottom-nav-active-dot" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
