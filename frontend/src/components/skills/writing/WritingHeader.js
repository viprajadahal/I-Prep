import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

const WritingHeader = ({ module, onModuleChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-gray-800 flex items-center justify-center">
            <BookOpen size={20} className="text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Writing Practice
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Master IELTS Writing with structured practice and AI feedback
            </p>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 self-start">
          {[
            { key: 'academic', label: 'Academic', icon: GraduationCap },
            { key: 'general', label: 'General Training', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onModuleChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                module === tab.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WritingHeader;
