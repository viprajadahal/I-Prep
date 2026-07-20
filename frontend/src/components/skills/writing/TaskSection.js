import React from 'react';
import { motion } from 'framer-motion';
import PracticeCard from './PracticeCard';

const TaskSection = ({ taskLabel, description, time, minWords, prompts, completedIds, onStart }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {taskLabel}
          </h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
          <span>Est. Time: {time} min</span>
          <span>Min. Words: {minWords}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {prompts.map((prompt, idx) => (
          <PracticeCard
            key={prompt.id}
            prompt={prompt}
            time={time}
            minWords={minWords}
            onStart={onStart}
            index={idx}
            isCompleted={completedIds.has(prompt.id)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TaskSection;
