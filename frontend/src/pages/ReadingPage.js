import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ReadingPage from '../components/reading/ReadingPage';

const ReadingDashboardPage = () => {
  return (
    <DashboardLayout>
      <ReadingPage />
    </DashboardLayout>
  );
};

export default ReadingDashboardPage;