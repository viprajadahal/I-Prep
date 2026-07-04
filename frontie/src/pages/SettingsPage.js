import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const SettingsPage = () => {
  const [formData, setFormData] = React.useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    targetBand: '7.5',
    country: 'India',
    notifications: true,
  });

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <SettingsIcon size={20} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your profile and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Target Band
                </label>
                <select
                  value={formData.targetBand}
                  onChange={(e) => setFormData({ ...formData, targetBand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
                >
                  {['5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
                >
                  <option>India</option>
                  <option>Pakistan</option>
                  <option>China</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          </div>
          <button className="gradient-btn text-sm mt-6">Save Changes</button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Practice Reminders
              </span>
            </div>
            <button
              onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
              className={`w-10 h-6 rounded-full transition-colors ${
                formData.notifications ? 'bg-gradient-accent' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.notifications ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;