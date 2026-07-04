import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Oct', overall: 5.5 },
  { month: 'Nov', overall: 6.0 },
  { month: 'Dec', overall: 6.5 },
  { month: 'Jan', overall: 6.5 },
  { month: 'Feb', overall: 7.0 },
  { month: 'Mar', overall: 7.0 },
];

const MonthlyImprovement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Monthly Improvement
        </h3>
        <Calendar size={18} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
          <YAxis domain={[4, 8]} stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="overall" fill="#4c6ef5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MonthlyImprovement;