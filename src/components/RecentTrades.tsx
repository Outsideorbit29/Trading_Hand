import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils/formatters';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entry_price: number;
  profit_loss: number;
  status: 'open' | 'closed';
  market_type: 'forex' | 'crypto';
  created_at: string;
}

interface RecentTradesProps {
  trades: Trade[];
}

export default function RecentTrades({ trades }: RecentTradesProps) {
  if (trades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No recent trades found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trades.map((trade, index) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              trade.status === 'open' ? 'bg-yellow-400' : 
              trade.profit_loss >= 0 ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <div>
              <p className="text-white font-medium">{trade.symbol}</p>
              <p className="text-sm text-gray-400">
                {trade.side.toUpperCase()} • {trade.market_type.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${
              trade.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(trade.profit_loss)}
            </p>
            <p className="text-sm text-gray-400">
              {formatDate(trade.created_at)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}