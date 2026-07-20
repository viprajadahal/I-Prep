import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import WritingDashboard from '../components/skills/WritingDashboard';
import WritingWorkspace from '../components/skills/writing/WritingWorkspace';

const WritingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const prompt = location.state?.prompt;

  if (id && prompt) {
    return (
      <DashboardLayout>
        <WritingWorkspace prompt={prompt} onBack={() => navigate('/dashboard/writing')} />
      </DashboardLayout>
    );
  }

  if (id && !prompt) {
    return (
      <DashboardLayout>
        <WritingDashboard />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <WritingDashboard />
    </DashboardLayout>
  );
};

export default WritingPage;
