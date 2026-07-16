import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { speakingTopics } from '../../data/mockData';

const SpeakingPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedPart, setSelectedPart] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [waveformData, setWaveformData] = useState([]);
  const timerRef = useRef(null);
  const topic = speakingTopics[selectedPart];

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        setWaveformData((prev) => [
          ...prev.slice(-40),
          Math.random() * 30 + 10,
        ]);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setWaveformData([]);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const pronunciationScore = 78;
  const fluencyScore = 72;
  const coherenceScore = 80;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-gray-800 flex items-center justify-center">
            <Mic size={20} className="text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Speaking Practice
          </h1>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {speakingTopics.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setSelectedPart(idx)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPart === idx
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-surface-cardDark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-200'
            }`}
          >
            Part {t.part}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {topic.title}
            </h3>
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {topic.duration}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {topic.cue}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <span className="text-sm text-gray-400 block mb-1">
                {isRecording ? formatTime(recordingTime) : '0:00'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-soft ${
                  isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-gradient-accent text-white'
                }`}
              >
                {isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Mic size={28} />
                  </motion.div>
                ) : (
                  <Mic size={28} />
                )}
              </motion.button>
              <span className="text-xs text-gray-400 mt-2 block">
                {isRecording ? 'Recording...' : 'Tap to speak'}
              </span>
            </div>
          </div>

          {isRecording && waveformData.length > 0 && (
            <div className="flex items-center justify-center gap-[2px] h-16 mb-4">
              {waveformData.map((height, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  className="w-1 bg-gradient-accent rounded-full opacity-70"
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setShowTips(!showTips)}
            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Lightbulb size={16} />
            Tips & Strategies
          </button>

          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-2"
            >
              {topic.tips.map((tip, idx) => (
                <div key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Fluency Analysis
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Pronunciation</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{pronunciationScore}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pronunciationScore}%` }}
                    transition={{ duration: 1 }}
                    className="h-2 bg-gradient-accent rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Fluency</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{fluencyScore}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fluencyScore}%` }}
                    transition={{ duration: 1 }}
                    className="h-2 bg-gradient-accent rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Coherence</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{coherenceScore}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${coherenceScore}%` }}
                    transition={{ duration: 1 }}
                    className="h-2 bg-gradient-accent rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
          >
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Pronunciation Score
            </h4>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-full border-4 border-gradient-accent"
                  style={{
                    borderImage: 'linear-gradient(135deg, #4c6ef5, #7c3aed) 1',
                  }}
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pronunciationScore}
                  </div>
                  <div className="text-xs text-gray-400">out of 100</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="gradient-btn w-full !py-3 flex items-center justify-center gap-2"
          >
            Get Detailed Feedback
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;