import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import AnalyticsCharts from '../components/AnalyticsCharts';
import PerformanceMetrics from '../components/PerformanceMetrics';

export default function Analytics() {
  const { trades, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Deep dive into your trading performance</p>
      </motion.div>

      <PerformanceMetrics trades={trades} />
      <AnalyticsCharts trades={trades} />
    </div>
  );
}