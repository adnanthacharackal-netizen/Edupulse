// src/pages/DashboardPage.jsx
import React from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatCards from '../components/dashboard/StatCards';
import UpcomingAssignments from '../components/dashboard/UpcomingAssignments';
import TimetableSchedule from '../components/dashboard/TimetableSchedule';
import StudentProfileCard from '../components/dashboard/StudentProfileCard';
import AttendanceBreakdown from '../components/dashboard/AttendanceBreakdown';
import RecentAnnouncements from '../components/dashboard/RecentAnnouncements';

export default function DashboardPage() {
  return (
    <div className="dashboard-page-container">
      {/* 1. Welcome Greeting Banner */}
      <WelcomeBanner />

      {/* 2. Overview Stat Cards */}
      <StatCards />

      {/* 3. Core 2-Column Responsive Layout */}
      <div className="dashboard-main-grid">
        {/* Left Primary Column: Actions, Assignments & Schedule */}
        <div className="dashboard-primary-col">
          <UpcomingAssignments />
          <TimetableSchedule />
        </div>

        {/* Right Secondary Column: Profile, Attendance & Notices */}
        <div className="dashboard-secondary-col">
          <StudentProfileCard />
          <AttendanceBreakdown />
          <RecentAnnouncements />
        </div>
      </div>
    </div>
  );
}
