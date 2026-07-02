import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;