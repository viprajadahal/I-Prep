import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Globe,
  Target,
  Calendar,
  Trophy,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Camera,
  Crown,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const ProfilePage = () => {
  const { user } = useAuth();

  const skillStats = [
    { label: 'Reading', icon: BookOpen, score: 7.0, lessons: 12 },
    { label: 'Writing', icon: PenTool, score: 6.5, lessons: 6 },
    { label: 'Listening', icon: Headphones, score: 7.0, lessons: 8 },
    { label: 'Speaking', icon: Mic, score: 6.5, lessons: 5 },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <User size={20} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          View your profile and preparation statistics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mb-4 relative">
              <User size={36} className="text-white" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                <Camera size={12} className="text-gray-500" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.name || 'Alex Johnson'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {user?.email || 'alex@example.com'}
            </p>

            {user?.isPremium && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-accent text-white text-xs font-medium mb-4">
                <Crown size={12} />
                Premium Member
              </span>
            )}

            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user?.email || 'alex@example.com'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Globe size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user?.country || 'India'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Target size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Target Band: {user?.targetBand || 7.5}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Joined: January 2024
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Skill Performance
              </h3>
              <Trophy size={18} className="text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillStats.map((skill, index) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                      <skill.icon size={16} className="text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {skill.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {skill.lessons} lessons completed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Current Band</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {skill.score}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-gradient-accent rounded-full"
                      style={{ width: `${(skill.score / 9) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Overall Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">6.5</div>
                <div className="text-xs text-gray-400 mt-1">Current Band</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">7.5</div>
                <div className="text-xs text-gray-400 mt-1">Target Band</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">31</div>
                <div className="text-xs text-gray-400 mt-1">Lessons Done</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">48h</div>
                <div className="text-xs text-gray-400 mt-1">Study Hours</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;