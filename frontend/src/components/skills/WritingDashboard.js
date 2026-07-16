import React from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  Clock,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import { writingLessons } from '../../data/mockData';

const WritingDashboard = () => {
  const completedCount = writingLessons.filter((l) => l.completed).length;
  const avgScore = writingLessons.filter((l) => l.completed && l.score > 0)
    .reduce((sum, l) => sum + l.score, 0) / completedCount || 0;
  const task1Count = writingLessons.filter((l) => l.type === 'task1').length;
  const task2Count = writingLessons.filter((l) => l.type === 'task2').length;

  const difficultyColors = {
    Beginner: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    Intermediate: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    Advanced: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-gray-800 flex items-center justify-center">
            <PenTool size={20} className="text-violet-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Writing Practice
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Master IELTS Task 1 and Task 2 with structured lessons and AI feedback
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Writing Progress
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {completedCount}/{writingLessons.length}
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-3">
            <div
              className="h-2 bg-gradient-accent rounded-full"
              style={{ width: `${(completedCount / writingLessons.length) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Average Score
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {avgScore > 0 ? `${avgScore}%` : 'N/A'}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Based on {completedCount} completed lessons
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Task Breakdown
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {task1Count}
              </span>
              <span className="text-xs text-gray-400 ml-1">Task 1</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {task2Count}
              </span>
              <span className="text-xs text-gray-400 ml-1">Task 2</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        {writingLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {lesson.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
                    {lesson.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {lesson.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {lesson.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {lesson.duration}
                  </span>
                  {lesson.completed && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 size={12} />
                      Score: {lesson.score}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {lesson.completed ? (
                  <button className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Review
                  </button>
                ) : (
                  <button className="gradient-btn text-sm !py-2 flex items-center gap-1.5">
                    <PlayCircle size={16} />
                    Start
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WritingDashboard;