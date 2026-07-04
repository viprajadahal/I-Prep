import React from 'react';
import Navbar from './Navbar';

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default LandingLayout;