import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Search, Sun, Moon, Crown } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Continue your IELTS preparation journey
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-48"
          />
        </div>

        <button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
          <Bell size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-accent text-white text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-500" />}
        </button>

        {user?.isPremium && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-accent text-white text-xs font-medium">
            <Crown size={12} />
            Premium
          </span>
        )}
      </div>
    </div>
  );
};

export default Topbar;