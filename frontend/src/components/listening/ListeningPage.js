import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { listeningPassages } from '../../data/mockData';

const ListeningPage = () => {
  const passage = listeningPassages[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (!submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev <= 0 ? 0 : prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const questionsPerPage = 2;
  const totalPages = Math.ceil(passage.questions.length / questionsPerPage);
  const pageQuestions = passage.questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const answerProgress = (Object.keys(selectedAnswers).length / passage.questions.length) * 100;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
            <Headphones size={20} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Listening Practice
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {passage.title}
          </h3>
          <span className="text-sm text-gray-400">{passage.duration}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-white shadow-soft"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => { setProgress(0); setIsPlaying(false); }}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
          >
            <RotateCcw size={16} className="text-gray-400" />
          </button>
          <div className="flex-1">
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <motion.div
                className="h-2 bg-gradient-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {Math.floor(progress)}%
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} />
            Transcript
          </button>
        </div>
      </motion.div>

      {showTranscript && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800 mb-6"
        >
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Transcript
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
            {passage.transcript}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1">
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div
                  className="h-1.5 bg-gradient-accent rounded-full transition-all"
                  style={{ width: `${answerProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {Object.keys(selectedAnswers).length}/{passage.questions.length}
            </span>
          </div>

          {pageQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800"
            >
              <div className="text-xs font-medium text-gray-400 mb-3">
                Question {question.id}
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
                          : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-200'
                      }`}
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
              className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40"
            >
              <ChevronLeft size={16} className="inline mr-1" />
              Previous
            </button>
            {currentPage < totalPages - 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Next <ChevronRight size={16} className="inline ml-1" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubmitted(true)}
                disabled={submitted}
                className="gradient-btn text-sm !py-2 flex items-center gap-1.5"
              >
                Submit <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-surface-cardDark rounded-2xl p-5 shadow-soft border border-gray-50 dark:border-gray-800">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Notes
            </h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes while listening..."
              className="w-full h-48 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;