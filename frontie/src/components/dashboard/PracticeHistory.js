import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { History } from 'lucide-react';

const practiceHistoryData = [
  { date: 'Jan 8', practice: 2 },
  { date: 'Jan 9', practice: 3 },
  { date: 'Jan 10', practice: 1 },
  { date: 'Jan 11', practice: 4 },
  { date: 'Jan 12', practice: 2 },
  { date: 'Jan 13', practice: 3 },
  { date: 'Jan 14', practice: 5 },
  { date: 'Jan 15', practice: 2 },
];

const PracticeHistory = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-surface-cardDark rounded-2xl p-6 shadow-soft border border-gray-50 dark:border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Practice History
        </h3>
        <History size={18} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={practiceHistoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="practice"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PracticeHistory;