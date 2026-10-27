// src/components/layout/Header.jsx
import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  CheckCheck,
  ShieldCheck,
  GraduationCap,
  LogOut,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header({ onOpenMobileMenu }) {
  const { unreadCount, announcements, toggleAnnouncementRead } = useApp();
  const { profile, isStaff, switchRole, user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [todayFormatted] = useState(() =>
    new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date())
  );

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/assignments?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleRole = () => {
    switchRole(isStaff ? 'student' : 'staff');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search courses, assignments, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Role Switcher Pill for Testing Permissions */}
        <div className="role-switcher-container">
          <button
            className={`role-badge-btn ${isStaff ? 'role-badge-staff' : 'role-badge-student'}`}
            onClick={toggleRole}
            title="Click to toggle between Student and Authorized Staff permissions"
          >
            {isStaff ? <ShieldCheck size={14} /> : <GraduationCap size={14} />}
            <span>Role: {isStaff ? 'Authorized Staff' : 'Student'}</span>
            <RotateCcw size={12} className="role-switch-icon" />
          </button>
        </div>

        <div className="date-chip">
          <Sparkles size={14} className="text-blue-600" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Popover */}
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <span className="popover-title">Recent Notifications</span>
                <span className="popover-badge">{unreadCount} New</span>
              </div>
              <ul className="notification-list">
                {announcements.slice(0, 4).map((notif) => (
                  <li
                    key={notif.id}
                    className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                    onClick={() => {
                      toggleAnnouncementRead(notif.id);
                      navigate('/announcements');
                      setShowNotifications(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="notif-bullet" />
                    <div className="notif-content">
                      <p className="notif-text">{notif.title}</p>
                      <span className="notif-time">{notif.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="popover-footer">
                <button
                  className="mark-read-btn"
                  onClick={() => {
                    navigate('/announcements');
                    setShowNotifications(false);
                  }}
                >
                  <CheckCheck size={14} /> View All in Announcements
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Student Mini Profile or Login Button */}
        {user ? (
          <div className="header-profile-group">
            <div
              className="header-profile-pill"
              onClick={() => navigate('/settings')}
              style={{ cursor: 'pointer' }}
              title="Account Settings"
            >
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={profile?.full_name}
                className="header-avatar"
              />
              <div className="header-profile-info">
                <span className="header-student-name">{profile?.full_name}</span>
                <span className="header-student-role">
                  {isStaff ? 'Staff / Faculty' : profile?.major || 'Student'}
                </span>
              </div>
            </div>
            <button
              className="btn-header-auth"
              onClick={signOut}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            className="btn-header-signin"
            onClick={() => navigate('/auth')}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
