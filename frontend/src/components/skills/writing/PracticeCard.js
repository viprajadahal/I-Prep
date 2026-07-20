import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { SUBTYPE_META, DIFFICULTY_META } from '../../../constants/writingCategories';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PracticeCard = ({ prompt, time, minWords, onStart, index, isCompleted }) => {
  const meta = SUBTYPE_META[prompt.subtype] || { label: prompt.title, icon: PlayCircle, color: '#7c3aed', description: prompt.prompt_text };
  const diffMeta = DIFFICULTY_META[prompt.difficulty] || DIFFICULTY_META.intermediate;
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${meta.color}15` }}
        >
          <Icon size={22} style={{ color: meta.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {meta.label}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${diffMeta.color}`}>
              {diffMeta.label}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[11px] font-medium">
                <CheckCircle2 size={11} />
                Done
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {meta.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {time} min
            </span>
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {minWords} words
            </span>
          </div>

          {prompt.image_url && (
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
              <img
                src={`${API_BASE_URL}${prompt.image_url}`}
                alt={prompt.title || 'Task diagram'}
                className="w-full h-32 object-cover object-top"
              />
            </div>
          )}

          <button
            onClick={() => onStart(prompt)}
            className="gradient-btn text-sm !py-2 !px-5 flex items-center gap-1.5"
          >
            <PlayCircle size={15} />
            Start Practice
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PracticeCard;
