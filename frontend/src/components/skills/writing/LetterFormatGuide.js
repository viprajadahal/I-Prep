import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const GREETINGS = {
  Formal: [
    'Dear Sir/Madam,',
    'Dear Mr. Smith,',
    'Dear Mrs. Johnson,',
    'Dear Dr. Williams,',
  ],
  'Semi-formal': [
    'Dear John,',
    'Dear Ms. Davis,',
    'Dear Professor Lee,',
    'Dear Ms. Garcia,',
  ],
  Informal: [
    'Dear Sarah,',
    'Hi Mike,',
    'Hello Tom,',
    "Hey Anna,",
  ],
};

const OPENINGS = {
  Formal: [
    'I am writing to inform you that...',
    'I am writing to request information about...',
    'I am writing regarding the matter of...',
    'I wish to bring to your attention...',
  ],
  'Semi-formal': [
    "I hope you're doing well.",
    "I wanted to let you know that...",
    "I'm writing to ask about...",
    "I wanted to share some news about...",
  ],
  Informal: [
    "How's everything going?",
    "I'm writing to tell you some exciting news!",
    "I wanted to share something with you.",
    "Guess what happened recently!",
  ],
};

const BODY_TIPS = {
  Formal: [
    'Use passive voice for objectivity',
    'Avoid contractions (use "do not" not "don\'t")',
    'Stick to facts and evidence',
    'Use linking words: furthermore, moreover, in addition',
  ],
  'Semi-formal': [
    'Balance politeness with clarity',
    'Use some linking words: however, although, therefore',
    'Express opinions with phrases like: I believe, In my opinion',
    'Use both facts and personal experience',
  ],
  Informal: [
    'Use contractions (I\'m, don\'t, can\'t)',
    'Use informal connectors: by the way, also, anyway',
    'Share personal feelings and reactions',
    'Use exclamation marks sparingly for emphasis',
  ],
};

const CLOSINGS = {
  Formal: [
    'Yours faithfully,',
    'Yours sincerely,',
  ],
  'Semi-formal': [
    'Best regards,',
    'Kind regards,',
    'Warm regards,',
  ],
  Informal: [
    'Take care!',
    'Best wishes,',
    'Talk soon!',
    'Cheers!',
  ],
};

const LetterFormatGuide = ({ letterType = 'Formal' }) => {
  const [open, setOpen] = useState(false);
  const greetingExamples = GREETINGS[letterType] || GREETINGS.Formal;
  const openingExamples = OPENINGS[letterType] || OPENINGS.Formal;
  const bodyTips = BODY_TIPS[letterType] || BODY_TIPS.Formal;
  const closingExamples = CLOSINGS[letterType] || CLOSINGS.Formal;

  return (
    <div className="bg-white dark:bg-surface-cardDark rounded-2xl border border-gray-50 dark:border-gray-800 shadow-soft overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <BookOpen size={18} className="text-blue-500" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Letter Format Guide — {letterType}
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
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
            <div className="px-5 pb-5 space-y-5 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  These are examples to help you learn the format. In the exam, you must write everything yourself from scratch. The editor below is intentionally blank — you must type the greeting, body, and closing yourself.
                </p>
              </div>

              <Section title="Greetings" items={greetingExamples} />
              <Section title="Opening Lines" items={openingExamples} />
              <Section title="Body Paragraph Tips" items={bodyTips} />
              <Section title="Closings" items={closingExamples} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({ title, items }) => (
  <div>
    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
      {title}
    </h4>
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <p
          key={i}
          className="text-sm text-gray-700 dark:text-gray-300 pl-3 border-l-2 border-violet-200 dark:border-violet-800"
        >
          {item}
        </p>
      ))}
    </div>
  </div>
);

export default LetterFormatGuide;
