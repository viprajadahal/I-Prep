import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const SkillBreakdown = () => {
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/analytics/skill-breakdown", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const formatted = data.map(item => ({
          skill: item.skill_type.charAt(0).toUpperCase() + item.skill_type.slice(1),
          score: parseFloat(item.accuracy),
          fullMark: 100
        }));
        setRadarData(formatted);
      })
      .catch(err => console.error("Failed to load skill breakdown:", err));
  }, []);

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
      {radarData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Radar
              name="Accuracy %"
              dataKey="score"
              stroke="#4c6ef5"
              fill="#4c6ef5"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-400 text-sm">No data yet — complete some exercises first</p>
        </div>
      )}
    </motion.div>
  );
};

export default SkillBreakdown;