// src/components/dashboard/StatCards.jsx
import React from 'react';
import { CalendarCheck, FileText, Clock, Bell, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function StatCards() {
  const { attendanceStats, pendingAssignmentsCount, unreadCount, timetable } = useApp();
  const navigate = useNavigate();

  // Tuesday classes count for today's default
  const todayClassesCount = (timetable.Tuesday || []).length;

  const dynamicStats = [
    {
      id: 'attendance',
      route: '/attendance',
      title: 'Overall Attendance',
      value: `${attendanceStats.percentage}%`,
      subtext: attendanceStats.isSafe ? 'Above 75% required threshold' : 'Below 75% threshold! Action needed',
      badgeText: attendanceStats.isSafe ? 'Safe Standing' : 'At Risk',
      badgeType: attendanceStats.isSafe ? 'positive' : 'warning',
      icon: CalendarCheck,
      color: 'blue',
      progress: Math.min(attendanceStats.percentage, 100),
    },
    {
      id: 'assignments',
      route: '/assignments',
      title: 'Active Assignments',
      value: `${pendingAssignmentsCount} Pending`,
      subtext: 'Deadlines in the next few days',
      badgeText: pendingAssignmentsCount === 0 ? 'All Completed' : 'Action Required',
      badgeType: pendingAssignmentsCount === 0 ? 'positive' : 'neutral',
      icon: FileText,
      color: 'indigo',
      progress: Math.max(10, Math.min(100, pendingAssignmentsCount * 25)),
    },
    {
      id: 'timetable',
      route: '/timetable',
      title: "Today's Schedule",
      value: `${todayClassesCount} Classes`,
      subtext: 'Lectures and practical sessions',
      badgeText: 'Tuesday',
      badgeType: 'primary',
      icon: Clock,
      color: 'sky',
      progress: 50,
    },
    {
      id: 'announcements',
      route: '/announcements',
      title: 'Campus Updates',
      value: `${unreadCount} Unread`,
      subtext: 'Circulars & examination alerts',
      badgeText: unreadCount > 0 ? 'New Notices' : 'All Read',
      badgeType: unreadCount > 0 ? 'warning' : 'positive',
      icon: Bell,
      color: 'amber',
      progress: Math.min(100, unreadCount * 33),
    },
  ];

  return (
    <div className="stat-cards-grid">
      {dynamicStats.map((stat) => {
        const IconComponent = stat.icon;

        return (
          <div
            key={stat.id}
            className={`stat-card stat-card-${stat.color}`}
            onClick={() => navigate(stat.route)}
            role="button"
            tabIndex={0}
            title={`View ${stat.title}`}
          >
            <div className="stat-card-top">
              <div className={`stat-icon-wrapper icon-${stat.color}`}>
                <IconComponent size={22} />
              </div>
              <span className={`stat-badge badge-${stat.badgeType}`}>
                {stat.badgeText}
              </span>
            </div>

            <div className="stat-card-body">
              <p className="stat-label">{stat.title}</p>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-subtext">{stat.subtext}</p>
            </div>

            <div className="stat-card-footer">
              <div className="stat-progress-track">
                <div
                  className={`stat-progress-fill fill-${stat.color}`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <div className="stat-link">
                <span>Open {stat.title}</span>
                <ArrowRight size={14} className="stat-arrow" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
