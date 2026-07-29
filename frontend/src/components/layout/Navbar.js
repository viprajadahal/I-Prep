import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, ClipboardList, BarChart3, FolderOpen,
  Sun, Moon, User, Menu, X, Settings, LogOut, ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const navLinks = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Practice', icon: BookOpen, path: '/practice' },
    { label: 'Mock Tests', icon: ClipboardList, path: '/mock-tests' },
    { label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { label: 'Resources', icon: FolderOpen, path: '/resources' },
  ];

  // close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-accent flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {(user?.full_name || user?.name || 'Student').split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-surface-cardDark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {/* user info header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.full_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <p className="text-xs text-purple-500 mt-0.5">Target: Band {user?.target_band}</p>
                      </div>

                      {/* links */}
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <BarChart3 size={15} className="text-gray-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Settings size={15} className="text-gray-400" />
                          Settings
                        </Link>
                      </div>

                      {/* logout */}
                      <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;