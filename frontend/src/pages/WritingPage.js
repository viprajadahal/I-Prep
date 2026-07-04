import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import WritingDashboard from '../components/skills/WritingDashboard';

const WritingPage = () => {
  return (
    <DashboardLayout>
      <WritingDashboard />
    </DashboardLayout>
  );
};

export default WritingPage;