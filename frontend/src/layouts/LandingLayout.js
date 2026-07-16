import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/landing/Footer';

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;