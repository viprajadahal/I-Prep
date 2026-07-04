import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardAnalytics from '../components/dashboard/DashboardAnalytics';
import Topbar from '../components/dashboard/Topbar';
import SkillBreakdown from '../components/dashboard/SkillBreakdown';
import MonthlyImprovement from '../components/dashboard/MonthlyImprovement';
import PracticeHistory from '../components/dashboard/PracticeHistory';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Topbar />
      <DashboardAnalytics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SkillBreakdown />
        <MonthlyImprovement />
        <PracticeHistory />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;