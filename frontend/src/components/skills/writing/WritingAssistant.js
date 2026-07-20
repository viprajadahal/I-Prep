import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  Timer,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MessageSquare,
  FileText,
  Loader2,
} from 'lucide-react';
import writingService from '../../../services/writingService';

const SubSection = ({ icon: Icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-violet-500" />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WritingAssistant = ({ promptId, promptText }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    if (!open && !data) {
      try {
        setLoading(true);
        const res = await writingService.getAssistant(promptId);
        setData(res.data);
      } catch (err) {
        setError('Failed to load assistant data.');
      } finally {
        setLoading(false);
      }
    }
    setOpen(!open);
  };

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-violet-500" />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Writing Assistant</span>
        {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-violet-500" />
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
              {data && (
                <>
                  <SubSection icon={BookOpen} title="Simplify Question" defaultOpen={true}>
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Original</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{promptText}</p>
                      </div>
                      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-100 dark:border-violet-800/30">
                        <p className="text-xs font-medium text-violet-500 mb-1 uppercase tracking-wide">Simplified</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{data.simplified_question}</p>
                      </div>
                    </div>
                  </SubSection>

                  <SubSection icon={MessageSquare} title="Vocabulary Help">
                    {data.difficult_words.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No difficult words detected.</p>
                    ) : (
                      <div className="space-y-2">
                        {data.difficult_words.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <span className="font-semibold text-violet-600 dark:text-violet-400 shrink-0 min-w-[100px]">{item.word}</span>
                            <span className="text-gray-600 dark:text-gray-400">→ {item.meaning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </SubSection>

                  <SubSection icon={CheckCircle2} title="Examiner Expectations">
                    <div className="space-y-2">
                      {data.examiner_expectations.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SubSection>

                  <SubSection icon={AlertTriangle} title="Common Mistakes">
                    <div className="space-y-2">
                      {data.common_mistakes.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SubSection>

                  <SubSection icon={Lightbulb} title="Quick Tips">
                    <div className="space-y-2">
                      {data.tips.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Lightbulb size={14} className="text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SubSection>

                  <SubSection icon={Target} title="Word Goals">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800/30">
                        <FileText size={20} className="text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.minimum_words}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum Words</div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center border border-amber-100 dark:border-amber-800/30">
                        <Timer size={20} className="text-amber-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.recommended_time}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minutes</div>
                      </div>
                    </div>
                  </SubSection>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WritingAssistant;
