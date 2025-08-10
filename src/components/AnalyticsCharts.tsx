import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  profit_loss: number;
  market_type: 'forex' | 'crypto';
  status: 'open' | 'closed';
}

interface AnalyticsChartsProps {
  trades: Trade[];
}

export default function AnalyticsCharts({ trades }: AnalyticsChartsProps) {
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  
  // Win/Loss Distribution
  const winningTrades = closedTrades.filter(trade => trade.profit_loss > 0).length;
  const losingTrades = closedTrades.filter(trade => trade.profit_loss < 0).length;
  
  const winLossData = {
    labels: ['Winning Trades', 'Losing Trades'],
    datasets: [
      {
        data: [winningTrades, losingTrades],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 2,
      },
    ],
  };

  // Market Type Distribution
  const forexTrades = trades.filter(trade => trade.market_type === 'forex').length;
  const cryptoTrades = trades.filter(trade => trade.market_type === 'crypto').length;
  
  const marketTypeData = {
    labels: ['Forex', 'Crypto'],
    datasets: [
      {
        data: [forexTrades, cryptoTrades],
        backgroundColor: ['#3B82F6', '#8B5CF6'],
        borderColor: ['#2563EB', '#7C3AED'],
        borderWidth: 2,
      },
    ],
  };

  // Monthly P&L
  const monthlyPL = closedTrades.reduce((acc, trade) => {
    const month = new Date(trade.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + trade.profit_loss;
    return acc;
  }, {} as Record<string, number>);

  const monthlyPLData = {
    labels: Object.keys(monthlyPL),
    datasets: [
      {
        label: 'Monthly P&L',
        data: Object.values(monthlyPL),
        backgroundColor: Object.values(monthlyPL).map(value => 
          value >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: Object.values(monthlyPL).map(value => 
          value >= 0 ? '#10B981' : '#EF4444'
        ),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
          callback: function(value: any) {
            return '$' + Number(value).toFixed(0);
          },
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Distribution</h3>
        <div className="h-64">
          <Pie data={winLossData} options={pieOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Market Distribution</h3>
        <div className="h-64">
          <Pie data={marketTypeData} options={pieOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl lg:col-span-2 xl:col-span-1"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Monthly P&L</h3>
        <div className="h-64">
          <Bar data={monthlyPLData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
}