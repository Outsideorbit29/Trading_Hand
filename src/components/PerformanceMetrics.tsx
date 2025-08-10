import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Trade {
  id: string;
  profit_loss: number;
  status: 'open' | 'closed';
  entry_price: number;
  quantity: number;
}

interface PerformanceMetricsProps {
  trades: Trade[];
}

export default function PerformanceMetrics({ trades }: PerformanceMetricsProps) {
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const winningTrades = closedTrades.filter(trade => trade.profit_loss > 0);
  const losingTrades = closedTrades.filter(trade => trade.profit_loss < 0);
  
  const totalPL = closedTrades.reduce((sum, trade) => sum + trade.profit_loss, 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
  const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.profit_loss, 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit_loss, 0) / losingTrades.length) : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
  
  const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(trade => trade.profit_loss)) : 0;
  const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(trade => trade.profit_loss)) : 0;
  
  const totalInvested = trades.reduce((sum, trade) => sum + (trade.entry_price * trade.quantity), 0);
  const roi = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  const metrics = [
    { label: 'Total P&L', value: formatCurrency(totalPL), change: totalPL >= 0 ? 'positive' : 'negative' },
    { label: 'Win Rate', value: formatPercentage(winRate), change: winRate >= 50 ? 'positive' : 'negative' },
    { label: 'Profit Factor', value: profitFactor.toFixed(2), change: profitFactor >= 1 ? 'positive' : 'negative' },
    { label: 'ROI', value: formatPercentage(roi), change: roi >= 0 ? 'positive' : 'negative' },
    { label: 'Average Win', value: formatCurrency(avgWin), change: 'positive' },
    { label: 'Average Loss', value: formatCurrency(avgLoss), change: 'negative' },
    { label: 'Largest Win', value: formatCurrency(largestWin), change: 'positive' },
    { label: 'Largest Loss', value: formatCurrency(largestLoss), change: 'negative' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl mb-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Performance Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 bg-gray-700 rounded-lg"
          >
            <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
            <p className={`text-lg font-bold ${
              metric.change === 'positive' ? 'text-green-400' : 
              metric.change === 'negative' ? 'text-red-400' : 
              'text-white'
            }`}>
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}