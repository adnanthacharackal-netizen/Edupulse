// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import AssignmentsPage from './pages/AssignmentsPage';
import TimetablePage from './pages/TimetablePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GradesPage from './pages/GradesPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import './App.css';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Responsive Left Sidebar Navigation (Desktop & Mobile Drawer) */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* In-App PWA Install Prompt on Mobile */}
        <PwaInstallPrompt />

        {/* Dynamic Route View */}
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Native Mobile App Bottom Navigation Bar (< 768px) */}
        <BottomNav />
      </div>
    </div>
  );
}
