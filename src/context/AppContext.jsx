// src/context/AppContext.jsx
import React, { createContext, useState, useMemo } from 'react';
import {
  initialStudentProfile,
  initialSubjectAttendance,
  initialAssignments,
  weeklyTimetableData,
  initialAnnouncements,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState(initialStudentProfile);
  const [subjects, setSubjects] = useState(initialSubjectAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [timetable, setTimetable] = useState(weeklyTimetableData);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Recent attendance activity logs
  const [attendanceLogs, setAttendanceLogs] = useState([
    {
      id: 'log-1',
      date: 'Today, Oct 13',
      courseCode: 'CS 301',
      courseName: 'Database Management Systems',
      status: 'Present',
    },
    {
      id: 'log-2',
      date: 'Yesterday, Oct 12',
      courseCode: 'MATH 240',
      courseName: 'Linear Algebra',
      status: 'Present',
    },
    {
      id: 'log-3',
      date: 'Oct 11, 2026',
      courseCode: 'HUM 120',
      courseName: 'Technical Communication',
      status: 'Absent',
    },
  ]);

  // --- Attendance Calculations ---
  const attendanceStats = useMemo(() => {
    const totalAttended = subjects.reduce((acc, sub) => acc + sub.attended, 0);
    const totalHeld = subjects.reduce((acc, sub) => acc + sub.total, 0);
    const percentage = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : 0;
    const isSafe = Number(percentage) >= 75;

    return {
      totalAttended,
      totalHeld,
      totalMissed: totalHeld - totalAttended,
      percentage: Number(percentage),
      isSafe,
    };
  }, [subjects]);

  // Quick action: Log attendance (Present or Absent) for a course
  const logAttendance = (courseCode, isPresent) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.code === courseCode) {
          const newAttended = isPresent ? sub.attended + 1 : sub.attended;
          const newTotal = sub.total + 1;
          return {
            ...sub,
            attended: newAttended,
            total: newTotal,
          };
        }
        return sub;
      })
    );

    const targetSub = subjects.find((s) => s.code === courseCode);
    const newLog = {
      id: `log-${Date.now()}`,
      date: 'Just now',
      courseCode: courseCode,
      courseName: targetSub ? targetSub.name : courseCode,
      status: isPresent ? 'Present' : 'Absent',
    };
    setAttendanceLogs((prev) => [newLog, ...prev]);
  };

  // --- Assignment Actions ---
  const addAssignment = (newAssignment) => {
    const formatted = {
      id: `asg-${Date.now()}`,
      daysLeft: 'New',
      ...newAssignment,
    };
    setAssignments((prev) => [formatted, ...prev]);
  };

  const updateAssignmentStatus = (id, newStatus) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === id
          ? {
              ...asg,
              status: newStatus,
              daysLeft: newStatus === 'Submitted' ? 'Submitted just now' : asg.daysLeft,
            }
          : asg
      )
    );
  };

  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((asg) => asg.id !== id));
  };

  // --- Timetable Actions ---
  const addClassSchedule = (day, newClass) => {
    const formatted = {
      id: `tt-${day.toLowerCase()}-${Date.now()}`,
      ...newClass,
    };
    setTimetable((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), formatted],
    }));
  };

  const removeClassSchedule = (day, classId) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((item) => item.id !== classId),
    }));
  };

  // --- Announcements Actions ---
  const addAnnouncement = (newAnn) => {
    const formatted = {
      id: `ann-${Date.now()}`,
      date: 'Just now',
      isRead: false,
      ...newAnn,
    };
    setAnnouncements((prev) => [formatted, ...prev]);
  };

  const toggleAnnouncementRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, isRead: !ann.isRead } : ann))
    );
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
  };

  // Unread count
  const unreadCount = announcements.filter((a) => !a.isRead).length;

  // Active / pending assignments count
  const pendingAssignmentsCount = assignments.filter(
    (a) => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Overdue'
  ).length;

  return (
    <AppContext.Provider
      value={{
        student,
        setStudent,
        subjects,
        attendanceStats,
        attendanceLogs,
        logAttendance,
        assignments,
        addAssignment,
        updateAssignmentStatus,
        deleteAssignment,
        pendingAssignmentsCount,
        timetable,
        addClassSchedule,
        removeClassSchedule,
        announcements,
        addAnnouncement,
        toggleAnnouncementRead,
        deleteAnnouncement,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
export { useApp } from './useApp';

