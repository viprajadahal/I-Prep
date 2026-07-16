import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-white dark:bg-surface-cardDark">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-surface-light dark:bg-surface-dark rounded-3xl p-12 lg:p-16 overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 dark:bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-3xl" />

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your IELTS Journey Today
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Get access to 200+ lessons, AI-powered feedback, detailed analytics, and mock tests. Join 50,000+ students preparing smarter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-btn text-base !py-3.5 !px-8 flex items-center gap-2"
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/practice">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-base"
                >
                  Try Free Practice
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;