import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.full_name?.split(' ')[0] || ''}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Continue your IELTS preparation journey
        </p>
      </div>
    </div>
  );
};

export default Topbar;