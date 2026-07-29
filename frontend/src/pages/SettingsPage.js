import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState('');

  const [formData, setFormData] = React.useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    target_band: user?.target_band?.toString() || '7.5',
    notifications: true,
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/auth/me`, {
        full_name: formData.full_name,
        target_band: parseFloat(formData.target_band),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (setUser) setUser(response.data);
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                disabled
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-700 text-gray-400 outline-none cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Target Band
              </label>
              <select
                value={formData.target_band}
                onChange={(e) => setFormData({ ...formData, target_band: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
              >
                {['5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-3">{error}</p>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-green-600 mt-3">
              <CheckCircle size={16} />
              <span className="text-sm">Changes saved successfully</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="gradient-btn text-sm mt-6"
          >
            Save Changes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Practice Reminders</span>
            </div>
            <button
              onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
              className={`w-10 h-6 rounded-full transition-colors ${
                formData.notifications ? 'bg-gradient-accent' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                formData.notifications ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;