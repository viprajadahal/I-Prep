import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Clock,
  Target,
  Flame,
  ArrowRight,
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { dashboardStats } from '../../data/mockData';

const DashboardAnalytics = () => {
  const { progressHistory, recentActivity, recommendedLessons, overallBand, targetBand, practiceStreak, accuracy, studyHours, completedLessons, totalLessons } = dashboardStats;

  const statCards = [
    { label: 'Overall Band', value: overallBand, target: targetBand, icon: BarChart3, color: 'text-primary-600' },
    { label: 'Practice Streak', value: `${practiceStreak} days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-green-500' },
    { label: 'Study Hours', value: `${studyHours}h`, icon: Clock, color: 'text-purple-500' },
  ];

  const skillIcons = {
    reading: BookOpen,
    writing: PenTool,
    listening: Headphones,
    speaking: Mic,
  };

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
              <div className="text-xs text-gray-400 mt-1">
                Target: {stat.target}
              </div>
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
              Progress History
            </h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
              <YAxis domain={[4, 8]} stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend fontSize={12} />
              <Line type="monotone" dataKey="reading" stroke="#4c6ef5" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="listening" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="writing" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="speaking" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
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
            {recentActivity.map((activity) => {
              const Icon = skillIcons[activity.type];
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
                    Band {activity.score}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recommended Lessons
          </h3>
          <ArrowRight size={18} className="text-gray-400" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendedLessons.map((lesson) => {
            const Icon = skillIcons[lesson.skill];
            return (
              <div
                key={lesson.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-gray-500" />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {lesson.difficulty}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lesson.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 capitalize">
                  {lesson.skill}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Lesson Completion
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedLessons} of {totalLessons} lessons completed
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {Math.round((completedLessons / totalLessons) * 100)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-3 bg-gradient-accent rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardAnalytics;