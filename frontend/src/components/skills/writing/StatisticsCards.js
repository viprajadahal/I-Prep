import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, BarChart3 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtitle, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    {subtitle && (
      <div className="text-xs text-gray-400">{subtitle}</div>
    )}
  </motion.div>
);

const StatisticsCards = ({ prompts, essays, history, results }) => {
  const completedCount = essays.length;
  const totalPrompts = prompts.length;
  const progressPct = totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;

  const toBand = (score) => (Math.round((score / 10) * 2) / 2).toFixed(1);

  const avgScore = history.length > 0
    ? toBand(history.reduce((s, h) => s + h.score, 0) / history.length)
    : 'N/A';

  const getAverageByTask = (taskType) => {
    if (!results || results.length === 0) return 'N/A';
    const taskScores = results.filter(r => {
      const essay = essays.find(e => e.id === r.essay_id);
      return essay && essays.some(e => e.id === r.essay_id && e.title &&
        prompts.some(p => p.task_type === taskType && p.title === e.title));
    }).map(r => r.overall_score);
    if (taskScores.length === 0) return 'N/A';
    return toBand(taskScores.reduce((a, b) => a + b, 0) / taskScores.length);
  };

  const task1Prompts = prompts.filter(p => p.task_type === 'Task 1');
  const task2Prompts = prompts.filter(p => p.task_type === 'Task 2');
  const task1Avg = getAverageByTask('Task 1');
  const task2Avg = getAverageByTask('Task 2');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={BookOpen}
        label="Writing Progress"
        value={`${completedCount} / ${totalPrompts}`}
        subtitle={`${progressPct}% completed`}
        color="#7c3aed"
        delay={0.1}
      />
      <StatCard
        icon={Target}
        label="Average Band"
        value={avgScore}
        subtitle={`Based on ${history.length} submissions`}
        color="#4c6ef5"
        delay={0.15}
      />
      <StatCard
        icon={BarChart3}
        label="Task 1 Average"
        value={task1Avg}
        subtitle={`${task1Prompts.length} prompts available`}
        color="#10b981"
        delay={0.2}
      />
      <StatCard
        icon={TrendingUp}
        label="Task 2 Average"
        value={task2Avg}
        subtitle={`${task2Prompts.length} prompts available`}
        color="#f59e0b"
        delay={0.25}
      />
    </div>
  );
};

export default StatisticsCards;
