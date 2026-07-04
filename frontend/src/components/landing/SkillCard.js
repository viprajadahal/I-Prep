import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, BookOpen, PenTool, Mic } from 'lucide-react';

const iconMap = {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SkillCard = ({ skill, index }) => {
  const IconComponent = iconMap[skill.icon];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-xl ${skill.bgColor} dark:bg-gray-800 flex items-center justify-center mb-4`}>
        {IconComponent && <IconComponent size={24} className="text-gray-700 dark:text-gray-200" />}
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {skill.title}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
        {skill.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {skill.completed}/{skill.lessons} lessons
        </span>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {Math.round((skill.completed / skill.lessons) * 100)}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(skill.completed / skill.lessons) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          className="h-1.5 bg-gradient-accent rounded-full"
        />
      </div>

      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        View Tests
        <motion.span
          className="inline-block"
          whileHover={{ x: 3 }}
        >
          →
        </motion.span>
      </button>
    </motion.div>
  );
};

export default SkillCard;