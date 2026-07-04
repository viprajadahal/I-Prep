import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  Download,
} from 'lucide-react';
import LandingLayout from '../components/layout/LandingLayout';
import { resources } from '../data/mockData';

const ResourcesPage = () => {
  return (
    <LandingLayout>
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Resources
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Download study materials, guides, and templates to boost your preparation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                {resource.type === 'PDF' ? (
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <FileText size={20} className="text-red-500" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Video size={20} className="text-blue-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {resource.type === 'PDF' ? resource.size : resource.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  {resource.category}
                </span>
              </div>

              <button className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <Download size={14} />
                Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default ResourcesPage;