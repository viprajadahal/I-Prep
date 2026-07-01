import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';
import LandingLayout from '../components/layout/LandingLayout';
import { mockTests } from '../data/mockData';

const MockTestsPage = () => {
  return (
    <LandingLayout>
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mock Tests
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Simulate the real IELTS exam experience with timed full tests
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={20} className="text-gray-600 dark:text-gray-300" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {test.title}
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  Duration: {test.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  Sections: {test.sections}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
                  {test.difficulty}
                </span>
              </div>

              {test.completed ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Band {test.score}
                  </span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-btn text-sm !py-2.5 w-full flex items-center justify-center gap-2"
                >
                  <PlayCircle size={16} />
                  Start Test
                  <ArrowRight size={16} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default MockTestsPage;