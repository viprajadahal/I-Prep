import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SpeakingPage from '../components/speaking/SpeakingPage';

const SpeakingDashboardPage = () => {
  return (
    <DashboardLayout>
      <SpeakingPage />
    </DashboardLayout>
  );
};

export default SpeakingDashboardPage;