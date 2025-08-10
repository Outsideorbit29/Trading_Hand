import React from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import RecentTrades from '../components/RecentTrades';
import ProfitLossChart from '../components/ProfitLossChart';

export default function Dashboard() {
  const { stats, trades, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your portfolio overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total P&L"
          value={formatCurrency(stats.totalProfitLoss)}
          icon={CurrencyDollarIcon}
          change={stats.totalProfitLoss >= 0 ? 'positive' : 'negative'}
          delay={0.1}
        />
        <StatsCard
          title="Win Rate"
          value={formatPercentage(stats.winRate)}
          icon={stats.winRate >= 50 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
          change={stats.winRate >= 50 ? 'positive' : 'negative'}
          delay={0.2}
        />
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          icon={ChartBarIcon}
          change="neutral"
          delay={0.3}
        />
        <StatsCard
          title="Open Trades"
          value={stats.openTrades.toString()}
          icon={ClockIcon}
          change="neutral"
          delay={0.4}
        />
      </div>

      {/* Charts and Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Profit & Loss Trend</h2>
          <ProfitLossChart trades={trades} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Trades</h2>
          <RecentTrades trades={recentTrades} />
        </motion.div>
      </div>

      {/* Portfolio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalInvested)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Current P&L</p>
            <p className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(stats.totalProfitLoss)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalInvested + stats.totalProfitLoss)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}