import React from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Navbar />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 pt-6 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="section-container pb-12">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;