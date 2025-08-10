import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: 'positive' | 'negative' | 'neutral';
  delay?: number;
}

export default function StatsCard({ title, value, icon: Icon, change, delay = 0 }: StatsCardProps) {
  const getChangeColor = () => {
    switch (change) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getIconBgColor = () => {
    switch (change) {
      case 'positive':
        return 'bg-green-600 bg-opacity-20';
      case 'negative':
        return 'bg-red-600 bg-opacity-20';
      default:
        return 'bg-blue-600 bg-opacity-20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${getChangeColor()}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${getIconBgColor()}`}>
          <Icon className={`h-6 w-6 ${getChangeColor()}`} />
        </div>
      </div>
    </motion.div>
  );
}