import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  ClipboardList,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/dashboard', badge: null },
    { label: 'Reading', icon: BookOpen, path: '/dashboard/reading', badge: '30' },
    { label: 'Writing', icon: PenTool, path: '/dashboard/writing', badge: '18' },
    { label: 'Listening', icon: Headphones, path: '/dashboard/listening', badge: '24' },
    { label: 'Speaking', icon: Mic, path: '/dashboard/speaking', badge: '20' },
    { label: 'Mock Tests', icon: ClipboardList, path: '/mock-tests', badge: null },
    { label: 'Study Materials', icon: FolderOpen, path: '/resources', badge: null },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings', badge: null },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-surface-cardDark border-r border-gray-100 dark:border-gray-800 transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Navigation
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft
              size={16}
              className={`text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <div className="flex flex-col gap-1 px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon size={18} />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;