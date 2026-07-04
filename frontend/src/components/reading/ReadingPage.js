import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { readingPassages } from '../../data/mockData';

const ReadingPage = () => {
  const passage = readingPassages[0];
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [highlighted, setHighlighted] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const passageRef = useRef(null);

  useEffect(() => {
    if (!submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setHighlighted([...highlighted, selection.toString().trim()]);
    }
  };

  const questionsPerPage = 2;
  const totalPages = Math.ceil(passage.questions.length / questionsPerPage);
  const pageQuestions = passage.questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const progress = (Object.keys(selectedAnswers).length / passage.questions.length) * 100;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 flex items-center justify-center">
            <BookOpen size={20} className="text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reading Practice
          </h1>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-surface-cardDark rounded-xl px-4 py-2 shadow-soft border border-gray-50 dark:border-gray-800">
          <Clock size={16} className="text-gray-400" />
          <span className={`text-sm font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
          {passage.difficulty}
        </span>
        <span className="text-xs text-gray-400">
          {passage.wordCount} words
        </span>
        <div className="flex-1">
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
            <div
              className="h-1.5 bg-gradient-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {Object.keys(selectedAnswers).length}/{passage.questions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {passage.title}
            </h3>
            <button
              onClick={handleHighlight}
              className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
              title="Highlight selected text"
            >
              <Highlighter size={16} className="text-gray-400" />
            </button>
          </div>
          <div
            ref={passageRef}
            className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto pr-2"
          >
            {passage.content}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {pageQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-gray-400">
                  Question {question.id}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[question.id] === optIdx;
                  const isCorrect = submitted && question.correct === optIdx;
                  const isWrong = submitted && isSelected && optIdx !== question.correct;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !submitted && handleSelect(question.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        isCorrect
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-400'
                          : isWrong
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400'
                          : isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 text-primary-700 dark:text-primary-400'
                          : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-200 dark:hover:border-gray-600'
                      } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      {option}
                      {isCorrect && <CheckCircle2 size={14} className="inline ml-2 text-green-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              <ChevronLeft size={16} className="inline mr-1" />
              Previous
            </button>

            {currentPage < totalPages - 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Next
                <ChevronRight size={16} className="inline ml-1" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitted}
                className="gradient-btn text-sm !py-2 flex items-center gap-1.5"
              >
                Submit Answers
                <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {highlighted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Highlighted Text
          </h4>
          <div className="space-y-2">
            {highlighted.map((text, idx) => (
              <div key={idx} className="text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg px-3 py-2">
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReadingPage;