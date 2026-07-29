import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

import HomePage from '../pages/HomePage';
import PracticePage from '../pages/PracticePage';
import MockTestsPage from '../pages/MockTestsPage';
import DashboardPage from '../pages/DashboardPage';
import WritingPage from '../pages/WritingPage';
import ReadingPage from '../pages/ReadingPage';
import ListeningPage from '../pages/ListeningPage';
import SpeakingPage from '../pages/SpeakingPage';
import ResourcesPage from '../pages/ResourcesPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';

// Admin Pages
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminResourcesPage from '../pages/admin/AdminResourcesPage';
import AdminMockTestsPage from '../pages/admin/AdminMockTestsPage';
import AdminQuestionBankPage from '../pages/admin/AdminQuestionBankPage';
import AdminResultsPage from '../pages/admin/AdminResultsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/mock-tests" element={<MockTestsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

       <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
       <Route path="/dashboard/writing" element={<ProtectedRoute><WritingPage /></ProtectedRoute>} />
       <Route path="/dashboard/reading" element={<ProtectedRoute><ReadingPage /></ProtectedRoute>} />
       <Route path="/dashboard/listening" element={<ProtectedRoute><ListeningPage /></ProtectedRoute>} />
       <Route path="/dashboard/speaking" element={<ProtectedRoute><SpeakingPage /></ProtectedRoute>} />
       <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
       <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="resources" element={<AdminResourcesPage />} />
        <Route path="mock-tests" element={<AdminMockTestsPage />} />
        <Route path="question-bank" element={<AdminQuestionBankPage />} />
        <Route path="results" element={<AdminResultsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;