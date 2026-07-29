import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Star } from 'lucide-react';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
};

const RecentPractice = ({ essays, results, onContinue }) => {
  if (!essays || essays.length === 0) return null;

  const recent = essays.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Continue Practice</h2>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>

      <div className="space-y-3">
        {recent.map((essay, idx) => {
          const result = results.find(r => r.essay_id === essay.id);
          const score = result ? (Math.round(result.overall_score / 10 * 2) / 2) : null;

          return (
            <motion.div
              key={essay.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-surface-cardDark rounded-xl p-4 shadow-soft border border-gray-50 dark:border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-gray-800 flex items-center justify-center">
                  <Clock size={16} className="text-violet-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {essay.title || 'Untitled Essay'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimeAgo(essay.created_at)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {score !== null && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{score.toFixed(1)}</span>
                  </div>
                )}
                <button
                  onClick={() => onContinue(essay)}
                  className="flex items-center gap-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium"
                >
                  Continue
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentPractice;
