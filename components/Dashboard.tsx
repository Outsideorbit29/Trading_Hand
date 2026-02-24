
import React, { useState, useMemo, useEffect } from 'react';
import { FilterType, Trade } from '../types';
import Card from './shared/Card';
import Toggle from './shared/Toggle';
import { SpinnerIcon } from './shared/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const API_BASE_URL = 'http://127.0.0.1:5000';

const Dashboard: React.FC<DashboardProps> = ({ showToast }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [botStatus, setBotStatus] = useState<'stopped' | 'running' | 'loading'>('stopped');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  // Manual trade UI removed

  // Fetch trades from backend
  const fetchTrades = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trades`);
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

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (!response.ok) throw new Error('Status endpoint not available.');
        const data = await response.json();
        setBotStatus(data.status);
        await fetchTrades();
        setLoading(false);
      } catch (error) {
        console.error("Could not connect to backend server:", error);
        showToast('Error: Could not connect to the bot server. Please ensure `server.py` is running.', 'error');
        setBotStatus('stopped');
        setLoading(false);
      }
    };
    checkStatus();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchTrades, 5000);
    return () => clearInterval(interval);
  }, [showToast]);

  const filteredTrades = useMemo(() => {
    if (filter === 'all') return trades;
    return trades.filter(trade => trade.source === filter);
  }, [filter, trades]);

  const closedTrades = useMemo(() => filteredTrades.filter(t => t.status === 'closed' && t.pnl !== undefined), [filteredTrades]);
  
  const openTrades = useMemo(() => filteredTrades.filter(t => t.status === 'open'), [filteredTrades]);

  const stats = useMemo(() => {
    const allClosedTrades = trades.filter(t => t.status === 'closed');
    const totalPnl = allClosedTrades.reduce((acc, trade) => {
      const pnl = (trade as any).pnl !== undefined ? (trade as any).pnl : (trade as any).profit || 0;
      return acc + pnl;
    }, 0);
    const winningTrades = allClosedTrades.filter(trade => {
      const pnl = (trade as any).pnl !== undefined ? (trade as any).pnl : (trade as any).profit || 0;
      return pnl > 0;
    }).length;
    const winRate = allClosedTrades.length > 0 ? (winningTrades / allClosedTrades.length) * 100 : 0;
    const openPositions = trades.filter(t => t.status === 'open').length;
    
    return {
      totalPnl: totalPnl.toFixed(2),
      winRate: winRate.toFixed(2),
      totalTrades: allClosedTrades.length,
      openPositions: openPositions
    };
  }, [trades]);
  
  const handleToggleBot = async () => {
    const isStarting = botStatus === 'stopped';
    const endpoint = isStarting ? 'start' : 'stop';
    const previousStatus = botStatus;

    setBotStatus('loading');

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, { method: 'POST' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Failed to ${endpoint} bot.`);
        }
        
        setBotStatus(isStarting ? 'running' : 'stopped');
        showToast(data.message, 'success');

    } catch (error) {
        console.error(`Error toggling bot:`, error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            errorMessage = 'Could not connect to the backend. Please ensure `server.py` is running in the `backend` directory.';
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        showToast(`Error: ${errorMessage}`, 'error');
        setBotStatus(previousStatus as 'running' | 'stopped');
    }
  };

  // Manual trade API removed

  const chartData = useMemo(() => {
    let cumulativePnl = 0;
    const closedTradesForChart = trades
      .filter(t => t.status === 'closed')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return closedTradesForChart.map((trade, index) => {
      const pnl = (trade as any).pnl !== undefined ? (trade as any).pnl : (trade as any).profit || 0;
      cumulativePnl += pnl;
      return {
        name: `Trade ${index + 1}`,
        pnl: pnl,
        cumulativePnl: cumulativePnl,
      };
    });
  }, [trades]);

  const toggleOptions = [
    { value: 'all', label: 'All Trades' },
    { value: 'bot', label: 'Bot' },
  ] as { value: FilterType; label: string }[];
  
  const StatCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <Card className="flex-1">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </Card>
  );

  const botButtonBg = botStatus === 'running' ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-500 hover:bg-cyan-600';
  const botButtonIsLoading = botStatus === 'loading';
  const loadingText = botStatus === 'running' ? 'Stopping...' : 'Starting...';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <SpinnerIcon className="w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <Toggle options={toggleOptions} selectedValue={filter} onSelect={(value) => setFilter(value)} />
            
            <button
              onClick={handleToggleBot}
              disabled={botButtonIsLoading}
              className={`flex items-center justify-center font-bold py-2 px-4 rounded-lg text-white transition duration-300 w-32 ${botButtonIsLoading ? 'bg-gray-500 cursor-wait' : botButtonBg}`}
            >
              {botButtonIsLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <span>{botStatus === 'running' ? 'Stop Bot' : 'Start Bot'}</span>
              )}
            </button>
        </div>
      </div>
      
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total PnL" value={`$${stats.totalPnl}`} color={parseFloat(stats.totalPnl) >= 0 ? 'text-green-400' : 'text-red-400'} />
        <StatCard title="Win Rate" value={`${stats.winRate}%`} color="text-cyan-400" />
        <StatCard title="Closed Trades" value={stats.totalTrades} color="text-purple-400"/>
        <StatCard title="Open Positions" value={stats.openPositions} color="text-yellow-400"/>
      </div>

      {chartData.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-white">Performance Over Time</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4A5568'
                  }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="cumulativePnl" name="Cumulative PnL" stroke="#38BDF8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-white">MT5 Account Trades ({trades.length})</h2>
        {trades.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No trades found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Entry Price</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">P&L</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Source</th>
                </tr>
              </thead>
              <tbody>
                  {trades.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(trade => (
                    <tr key={trade.id} className={`border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 ${trade.status === 'closed' ? 'opacity-75' : ''}`}>
                      <td className="p-3 font-medium">{trade.symbol}</td>
                      <td className={`p-3 font-semibold ${trade.direction === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.direction.toUpperCase()}
                      </td>
                      <td className="p-3">{trade.quantity}</td>
                      <td className="p-3">${trade.entryPrice.toFixed(2)}</td>
                      <td className="p-3">
                        {(trade as any).currentPrice ? `$${(trade as any).currentPrice.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className={`p-3 font-semibold ${
                        (trade as any).profit
                          ? (trade as any).profit >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                          : 'text-gray-400'
                      }`}>
                        {(trade as any).profit !== undefined
                          ? `$${(trade as any).profit.toFixed(2)}`
                          : (trade as any).pnl !== undefined
                          ? `$${(trade as any).pnl.toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.status === 'open'
                            ? 'bg-green-900/30 text-green-300'
                            : 'bg-gray-700/50 text-gray-300'
                        }`}>
                          {trade.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        {new Date(trade.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 capitalize">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.source === 'bot'
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-purple-900 text-purple-200'
                        }`}>
                          {trade.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;