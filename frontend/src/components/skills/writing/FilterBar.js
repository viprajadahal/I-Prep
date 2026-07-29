import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, module }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const categories = module === 'academic'
    ? ['All', 'Graphs', 'Tables', 'Maps', 'Process', 'Essays']
    : ['All', 'Letters', 'Essays'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-4 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search practice types..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filters.task}
            onChange={(e) => handleChange('task', e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">All Tasks</option>
            <option value="Task 1">Task 1</option>
            <option value="Task 2">Task 2</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c.toLowerCase()}>{c}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="difficulty">Difficulty</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
