import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  BarChart3,
  Brain,
  Globe,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Feedback',
    description: 'Get instant, detailed feedback on your writing and speaking with advanced AI analysis.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your improvement with detailed charts, band score projections, and skill breakdowns.',
  },
  {
    icon: BookOpen,
    title: 'Real IELTS Passages',
    description: 'Practice with authentic-style reading passages that mirror actual IELTS test difficulty.',
  },
  {
    icon: Headphones,
    title: 'Audio Practice',
    description: 'Train your listening skills with diverse audio passages and real exam-style questions.',
  },
  {
    icon: PenTool,
    title: 'Writing Templates',
    description: 'Master Task 1 and Task 2 with structured templates and model essay comparisons.',
  },
  {
    icon: Mic,
    title: 'Speaking Assessment',
    description: 'Record responses, analyze fluency, and improve pronunciation with AI scoring.',
  },
  {
    icon: Globe,
    title: 'Multi-Device Access',
    description: 'Practice anywhere, anytime. Your progress syncs seamlessly across all your devices.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'No waiting for scores. Get your results and feedback immediately after each practice session.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-surface-cardDark">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Why Choose iPrep IELTS?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Built by IELTS experts and powered by AI, our platform delivers the most effective preparation experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center mb-4">
                <feature.icon size={20} className="text-white dark:text-gray-900" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;