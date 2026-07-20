import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowDown } from 'lucide-react';

const steps = [
  { key: 'beginner', label: 'Beginner', description: 'Build foundational writing skills' },
  { key: 'intermediate', label: 'Intermediate', description: 'Develop structured responses' },
  { key: 'advanced', label: 'Advanced', description: 'Master complex topics' },
];

const LearningPath = ({ essays, history }) => {
  const avgScore = history.length > 0
    ? history.reduce((s, h) => s + h.score, 0) / history.length
    : 0;

  const getCompletedLevel = () => {
    if (avgScore >= 70) return 3;
    if (avgScore >= 50) return 2;
    if (essays.length > 0) return 1;
    return 0;
  };

  const completedLevel = getCompletedLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Learning Journey</h3>

      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < completedLevel;
          const isCurrent = idx === completedLevel;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-green-500" />
                    </div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center ring-2 ring-violet-400"
                    >
                      <Circle size={16} className="text-violet-500" />
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Circle size={16} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className={`text-sm font-semibold ${
                    isCompleted ? 'text-green-600 dark:text-green-400'
                      : isCurrent ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-start ml-[15px] py-1">
                  <ArrowDown size={14} className="text-gray-200 dark:text-gray-700" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LearningPath;
