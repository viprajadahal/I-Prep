import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';

const ProgressBar = ({ label, completed, total }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{completed}/{total}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        <div
          className="h-2 bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ProgressPanel = ({ prompts, essays }) => {
  const academic = prompts.filter(p => p.module === 'academic');
  const general = prompts.filter(p => p.module === 'general');

  const acTask1 = academic.filter(p => p.task_type === 'Task 1');
  const acTask2 = academic.filter(p => p.task_type === 'Task 2');
  const gtTask1 = general.filter(p => p.task_type === 'Task 1');
  const gtTask2 = general.filter(p => p.task_type === 'Task 2');

  const completedTitles = new Set(essays.map(e => e.title).filter(Boolean));

  const countCompleted = (list) => list.filter(p => completedTitles.has(p.title)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Progress Overview</h3>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={16} className="text-violet-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Academic</span>
        </div>
        <ProgressBar label="Task 1" completed={countCompleted(acTask1)} total={acTask1.length} />
        <ProgressBar label="Task 2" completed={countCompleted(acTask2)} total={acTask2.length} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-indigo-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">General Training</span>
        </div>
        <ProgressBar label="Task 1" completed={countCompleted(gtTask1)} total={gtTask1.length} />
        <ProgressBar label="Task 2" completed={countCompleted(gtTask2)} total={gtTask2.length} />
      </div>
    </motion.div>
  );
};

export default ProgressPanel;
