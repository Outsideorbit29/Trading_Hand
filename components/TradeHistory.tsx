
import React, { useState, useMemo, useEffect } from 'react';
import { FilterType, Trade } from '../types';
import { useTradeInsight } from './TradeInsightProvider';
import Card from './shared/Card';
import Toggle from './shared/Toggle';

const API_BASE_URL = 'http://127.0.0.1:5000';

const TradeHistory: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [trades, setTrades] = useState<Trade[]>([]);
  const { openChat } = useTradeInsight();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trades/history`);
        if (!response.ok) throw new Error('Failed to fetch trades');
        const data = await response.json();
        setTrades(data.trades.map((trade: any) => ({
          ...trade,
          timestamp: new Date(trade.timestamp)
        })));
      } catch (error) {
        console.error("Could not fetch trades:", error);
      }
    };
    fetchTrades();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchTrades, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const closedTrades = useMemo(() => trades
    .filter(t => t.status === 'closed')
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [trades]);

  const filteredTrades = useMemo(() => {
    if (filter === 'all') return closedTrades;
    return closedTrades.filter(trade => trade.source === filter);
  }, [filter, closedTrades]);

  const toggleOptions = [
    { value: 'all', label: 'All Trades' },
    { value: 'mt5', label: 'MT5' },
    { value: 'bot', label: 'Bot' },
  ] as { value: FilterType; label: string }[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Trade History</h1>
        {/* FIX: Wrapped setFilter in a lambda to correctly match the onSelect prop's type. */}
        <Toggle options={toggleOptions} selectedValue={filter} onSelect={(value) => setFilter(value)} />
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase">
                <th className="p-4">Date</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Direction</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Entry Price</th>
                <th className="p-4">Exit Price</th>
                <th className="p-4">PnL</th>
                <th className="p-4">Source</th>
                <th className="p-4">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-700/50">
                  <td className="p-4">{trade.timestamp.toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">{trade.symbol}</td>
                  <td className={`p-4 font-bold ${trade.direction === 'buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.direction.toUpperCase()}</td>
                  <td className="p-4">{trade.quantity}</td>
                  <td className="p-4">${trade.entryPrice.toFixed(2)}</td>
                  <td className="p-4">${trade.exitPrice?.toFixed(2) || 'N/A'}</td>
                  <td className={`p-4 font-semibold ${(trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${trade.pnl?.toFixed(2) || 'N/A'}
                  </td>
                   <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${trade.source === 'bot' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {trade.source.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openChat(trade)}
                      className="px-3 py-1 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded"
                    >
                      Ask AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrades.length === 0 && (
            <div className="text-center p-8 text-gray-500">No trades found for this filter.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradeHistory;