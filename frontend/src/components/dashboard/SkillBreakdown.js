import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { dashboardStats } from '../../data/mockData';

const SkillBreakdown = () => {
  const { progressHistory } = dashboardStats;
  const latestWeek = progressHistory[progressHistory.length - 1];

  const radarData = [
    { skill: 'Reading', score: latestWeek.reading, fullMark: 9 },
    { skill: 'Listening', score: latestWeek.listening, fullMark: 9 },
    { skill: 'Writing', score: latestWeek.writing, fullMark: 9 },
    { skill: 'Speaking', score: latestWeek.speaking, fullMark: 9 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Skill Breakdown
        </h3>
        <TrendingUp size={18} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <PolarRadiusAxis angle={90} domain={[0, 9]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <Radar
            name="Current Score"
            dataKey="score"
            stroke="#4c6ef5"
            fill="#4c6ef5"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillBreakdown;