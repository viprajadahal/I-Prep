import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Headphones,
  PenTool,
  Mic,
  Trophy,
  Clock,
  Target,
  ArrowRight,
  GraduationCap,
  BarChart3,
  BookOpen,
  Star,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';
import SkillCard from './SkillCard';
import { skillCards } from '../../data/mockData';

const ParticleField = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 2,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-accent opacity-20"
          style={{ width: p.size, height: p.size }}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const weeklyData = [5.5, 6, 6.5, 7, 7, 7.5];
  const skillScores = [
    { label: 'Reading', score: 7.0, color: '#4c6ef5' },
    { label: 'Listening', score: 7.5, color: '#7c3aed' },
    { label: 'Writing', score: 6.5, color: '#f59e0b' },
    { label: 'Speaking', score: 7.0, color: '#10b981' },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-hero dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 opacity-60" />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-violet-200/25 dark:bg-violet-600/10 rounded-full blur-[80px]" />

      <ParticleField />

      <div className="section-container relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.jpeg"
                alt="iPrep IELTS"
                className="w-12 h-12 rounded-xl object-cover shadow-soft"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="px-4 py-1.5 rounded-full bg-gradient-accent text-white text-xs font-semibold tracking-wide">
                #1 IELTS Prep Platform
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Master IELTS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-accent">
                with Confidence
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
              Comprehensive practice for all four IELTS modules. Track your progress, get AI-powered feedback, and achieve your target band score.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/practice">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(76, 110, 245, 0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="gradient-btn text-base !py-4 !px-10 flex items-center gap-2 shadow-lg"
                >
                  Start Practice Now
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-xl bg-white/80 dark:bg-surface-cardDark/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-white dark:hover:bg-surface-cardDark transition-all flex items-center gap-2 shadow-soft"
                >
                  <BarChart3 size={18} />
                  View Dashboard
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center shadow-soft">
                  <Trophy size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">7.5+</div>
                  <div className="text-xs text-gray-400">Avg. Score</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center shadow-soft">
                  <GraduationCap size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">50K+</div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center shadow-soft">
                  <Clock size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">200+</div>
                  <div className="text-xs text-gray-400">Lessons</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===== PREMIUM 3D SaaS-STYLE RIGHT SIDE ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[580px] perspective-[1200px]">

              {/* Gradient blob backgrounds */}
              <div className="absolute top-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-20 w-60 h-60 bg-indigo-400/15 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-violet-300/20 rounded-full blur-2xl" />

              {/* ===== MAIN DASHBOARD PANEL (center, largest) ===== */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 4 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ rotateX: 0, scale: 1.02 }}
                className="absolute top-[5%] left-[8%] right-[8%] bottom-[28%] rounded-2xl overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/90 dark:bg-surface-cardDark/90 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] h-full flex flex-col">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/logo.jpeg"
                        alt="iPrep"
                        className="w-7 h-7 rounded-lg object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">iPrep Dashboard</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-gradient-accent text-white text-xs font-semibold">
                      Band 7.5
                    </span>
                  </div>

                  {/* Overall Band Score + Progress Rings */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="relative">
                      <svg width="100" height="100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="6" fill="none" className="dark:stroke-gray-700" />
                        <motion.circle
                          cx="50" cy="50" r="40"
                          stroke="#7c3aed"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 40}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.72) }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                        <motion.circle
                          cx="50" cy="50" r="32"
                          stroke="#4c6ef5"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 32}
                          initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - 0.83) }}
                          transition={{ duration: 2, delay: 0.7 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-2xl font-extrabold text-gray-900 dark:text-white block"
                          >
                            7.0
                          </motion.span>
                          <span className="text-xs text-gray-400">Overall</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {skillScores.map((skill, idx) => {
                        const pct = (skill.score / 9) * 100;
                        const circ = 2 * Math.PI * 18;
                        const off = circ * (1 - pct / 100);
                        return (
                          <motion.div
                            key={skill.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + idx * 0.1 }}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex items-center gap-2"
                          >
                            <svg width="42" height="42" className="transform -rotate-90">
                              <circle cx="21" cy="21" r="18" stroke="#e5e7eb" strokeWidth="3" fill="none" className="dark:stroke-gray-600" />
                              <motion.circle
                                cx="21" cy="21" r="18"
                                stroke={skill.color}
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                initial={{ strokeDashoffset: circ }}
                                animate={{ strokeDashoffset: off }}
                                transition={{ duration: 1, delay: 1 + idx * 0.15 }}
                              />
                            </svg>
                            <div className="relative" style={{ width: 42, height: 42 }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{skill.score}</span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{skill.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weekly Progress Mini Chart */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">Weekly Progress</span>
                      <TrendingUp size={14} className="text-purple-500" />
                    </div>
                    <div className="flex items-end gap-[6px] h-[50px]">
                      {weeklyData.map((value, idx) => (
                        <motion.div
                          key={idx}
                          className="w-[14px] rounded-t-md bg-gradient-to-t from-indigo-400 to-purple-400 opacity-80"
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / 9) * 100}%` }}
                          transition={{ duration: 0.6, delay: 1.2 + idx * 0.08 }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-[6px] mt-1">
                      {['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((w) => (
                        <span key={w} className="w-[14px] text-center text-[9px] text-gray-400">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Writing Score Card (top-left) ===== */}
              <motion.div
                animate={{ y: [-8, 8, -8], rotateZ: [-1, 1, -1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[2%] left-[2%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-gray-800 flex items-center justify-center">
                      <PenTool size={16} className="text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Writing Task 2</div>
                      <div className="text-[10px] text-gray-400">Score: Band 7.0</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-gradient-accent rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Listening Card (top-right) ===== */}
              <motion.div
                animate={{ y: [6, -6, 6], rotateZ: [1, -1, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[8%] right-[2%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-gray-800 flex items-center justify-center">
                      <Headphones size={16} className="text-indigo-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Listening</div>
                      <div className="text-[10px] text-gray-400">8/10 Correct</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Achievement Badge (left-center) ===== */}
              <motion.div
                animate={{ y: [-6, 10, -6], rotateY: [-5, 5, -5] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[40%] left-[0%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                      <Award size={14} className="text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-gray-900 dark:text-white">
                      12-Day Streak
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1,2,3,4,5,6,7].map((d) => (
                      <div key={d} className="w-3 h-3 rounded-full bg-gradient-accent opacity-70" />
                    ))}
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 opacity-50" />
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Speaking Fluency Card (bottom-left) ===== */}
              <motion.div
                animate={{ y: [5, -8, 5], rotateZ: [1, -2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[6%] left-[4%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-gray-800 flex items-center justify-center">
                      <Mic size={16} className="text-violet-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Speaking</div>
                      <div className="text-[10px] text-gray-400">Fluency: 85%</div>
                    </div>
                  </div>
                  {/* Mini waveform */}
                  <div className="flex items-center gap-[2px] h-6 mt-1.5">
                    {[12, 20, 8, 24, 14, 28, 10, 22, 16, 26, 8, 18].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] rounded-full bg-gradient-accent"
                        animate={{ height: [h * 0.6, h, h * 0.6] }}
                        transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Star Rating + Score Badge (bottom-right) ===== */}
              <motion.div
                animate={{ y: [-4, 8, -4], rotateZ: [-1, 1, -1] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[4%] right-[4%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-gray-800 flex items-center justify-center">
                      <Target size={16} className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">Band 7.5</div>
                      <div className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                        <TrendingUp size={10} />
                        On Track
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1,2,3,4].map((s) => (
                      <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <Star size={10} className="text-gray-300" />
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Reading Card (right-center) ===== */}
              <motion.div
                animate={{ y: [-10, 6, -10], rotateZ: [-2, 1, -2] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[42%] right-[0%] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white/85 dark:bg-surface-cardDark/85 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
                      <BookOpen size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900 dark:text-white">Reading</div>
                      <div className="text-[9px] text-gray-400">12/30 Done</div>
                    </div>
                  </div>
                  <div className="mt-1.5 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </motion.div>

              {/* ===== FLOATING: Accuracy Mini-Widget (center-left floating) ===== */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-[22%] left-[1%] z-10"
              >
                <div className="bg-white/80 dark:bg-surface-cardDark/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white">73% Accuracy</span>
                    <CheckCircle2 size={10} className="text-green-400" />
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== Skill Cards Section ===== */}
      <div className="section-container pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            IELTS Skills
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Practice all four modules with structured lessons and real-time feedback
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCards.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;