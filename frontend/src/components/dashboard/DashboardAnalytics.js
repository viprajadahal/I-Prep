import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  BarChart3, Clock, Target, Flame,
  BookOpen, PenTool, Headphones, Mic, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardAnalytics = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:8000/analytics/summary", { headers }).then(r => r.json()),
      fetch("http://localhost:8000/analytics/progress", { headers }).then(r => r.json()),
      fetch("http://localhost:8000/analytics/recent-activity", { headers }).then(r => r.json()),
    ]).then(([summaryData, progressData, activityData]) => {
      setSummary(summaryData);
      setProgress(progressData);
      setRecentActivity(activityData);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load analytics:", err);
      setLoading(false);
    });
  }, []);

  const skillIcons = {
    reading: BookOpen,
    writing: PenTool,
    listening: Headphones,
    speaking: Mic,
  };

  const statCards = summary ? [
    { label: 'Overall Band', value: summary.overall_band, target: user?.target_band, icon: BarChart3, color: 'text-primary-600' },
    { label: 'Total Attempts', value: summary.total_attempts, icon: Flame, color: 'text-orange-500' },
    { label: 'Accuracy', value: `${summary.avg_accuracy}%`, icon: Target, color: 'text-green-500' },
    { label: 'Questions Done', value: summary.total_questions_answered, icon: Clock, color: 'text-purple-500' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your progress and continue your IELTS preparation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            {stat.target && (
              <div className="text-xs text-gray-400 mt-1">Target: Band {stat.target}</div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Accuracy Over Time
            </h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          {progress.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="created_at" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Reading Accuracy %"
                  stroke="#4c6ef5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No attempts yet</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Clock size={18} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity) => {
              const Icon = skillIcons[activity.type] || BookOpen;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <Icon size={18} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-400">{activity.date}</div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {activity.accuracy}%
                  </div>
                </div>
              );
            }) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No activity yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;