import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  ClipboardList,
  BarChart3,
  FolderOpen,
  Sun,
  Moon,
  User,
  Crown,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navLinks = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Practice', icon: BookOpen, path: '/practice' },
    { label: 'Mock Tests', icon: ClipboardList, path: '/mock-tests' },
    { label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { label: 'Resources', icon: FolderOpen, path: '/resources' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass-card border-b border-gray-100 dark:border-gray-800"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.jpeg"
              alt="iPrep IELTS Logo"
              className="w-9 h-9 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-9 h-9 rounded-lg bg-gradient-accent items-center justify-center hidden"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-sm">iP</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              iPrep IELTS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-gray-300" /> : <Moon size={18} className="text-gray-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.isPremium && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-accent text-white text-xs font-medium">
                    <Crown size={12} />
                    Premium
                  </span>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="gradient-btn text-sm !py-2 !px-4"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;