
import React, { useState, useMemo, useEffect } from 'react';
import { FilterType, Trade } from '../../types';
import Card from '../shared/Card';
import Toggle from '../shared/Toggle';
import { motion } from 'framer-motion';
import { SpinnerIcon } from '../shared/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const API_BASE_URL = 'http://127.0.0.1:5000';

const Dashboard: React.FC<DashboardProps> = ({ showToast }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [timeframe, setTimeframe] = useState('all');
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
      } catch (error) {
        console.error("Could not connect to backend server for status:", error);
      }
    };

    const initialFetch = async () => {
      await checkStatus();
      await fetchTrades();
      setLoading(false);
    };
    initialFetch();

    // Poll for both updates every 5 seconds
    const interval = setInterval(() => {
      checkStatus();
      fetchTrades();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTrades = useMemo(() => {
    let result = trades;
    
    if (filter !== 'all') {
      result = result.filter(trade => trade.source === filter);
    }
    
    if (timeframe !== 'all') {
      const now = new Date();
      let startTime = new Date(2020, 0, 1).getTime();
      
      if (timeframe === 'today') {
        now.setHours(0, 0, 0, 0);
        startTime = now.getTime();
      } else if (timeframe === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);
        startTime = startOfWeek.getTime();
      } else if (timeframe === 'month') {
        now.setDate(1);
        now.setHours(0, 0, 0, 0);
        startTime = now.getTime();
      }
      
      result = result.filter(trade => new Date(trade.timestamp).getTime() >= startTime);
    }
    
    return result;
  }, [filter, timeframe, trades]);

  const closedTrades = useMemo(() => filteredTrades.filter(t => t.status === 'closed' && t.pnl !== undefined), [filteredTrades]);
  
  const openTrades = useMemo(() => filteredTrades.filter(t => t.status === 'open'), [filteredTrades]);

  const stats = useMemo(() => {
    const allClosedTrades = filteredTrades.filter(t => t.status === 'closed');
    const totalPnl = allClosedTrades.reduce((acc, trade) => {
      const pnl = (trade as any).pnl !== undefined ? (trade as any).pnl : (trade as any).profit || 0;
      return acc + pnl;
    }, 0);
    const winningTrades = allClosedTrades.filter(trade => {
      const pnl = (trade as any).pnl !== undefined ? (trade as any).pnl : (trade as any).profit || 0;
      return pnl > 0;
    }).length;
    const winRate = allClosedTrades.length > 0 ? (winningTrades / allClosedTrades.length) * 100 : 0;
    const openPositions = filteredTrades.filter(t => t.status === 'open').length;
    
    return {
      totalPnl: totalPnl.toFixed(2),
      winRate: winRate.toFixed(2),
      totalTrades: allClosedTrades.length,
      openPositions: openPositions
    };
  }, [filteredTrades]);
  
  const handleToggleBot = async () => {
    const isStarting = botStatus === 'stopped';
    const endpoint = isStarting ? 'start' : 'stop';
    const previousStatus = botStatus;

    setBotStatus('loading');

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, { method: 'POST' });
        const data = await response.json();

        if (!response.ok) {
            // Re-sync UI manually if we have a desync error
            if (data.message === 'Bot is already running') {
                setBotStatus('running');
                showToast('Bot synced to active state.', 'success');
                return;
            } else if (data.message === 'Bot is already stopped') {
                setBotStatus('stopped');
                showToast('Bot synced to stopped state.', 'success');
                return;
            }
            throw new Error(data.message || `Failed to ${endpoint} bot.`);
        }
        
        setBotStatus(isStarting ? 'running' : 'stopped');
        showToast(data.message, 'success');

    } catch (error) {
        console.error(`Error toggling bot:`, error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            errorMessage = 'Could not connect to the backend. Please ensure the server is running.';
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
    const closedTradesForChart = filteredTrades
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
  }, [filteredTrades]);

  const toggleOptions = [
    { value: 'all', label: 'All Trades' },
    { value: 'bot', label: 'Bot' },
  ] as { value: FilterType; label: string }[];
  
  const StatCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Card className="h-full p-6 md:p-8 border-white/5 hover:border-cyan-500/30 transition-colors">
        <h3 className="text-gray-300 text-[10px] md:text-sm font-orbitron uppercase tracking-widest mb-4 opacity-70">{title}</h3>
        <p className={`text-3xl md:text-4xl font-bold ${color} tracking-tight`}>{value}</p>
      </Card>
    </motion.div>
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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">System Dashboard</h1>
            <p className="text-cyan-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2 opacity-80">Real-time Terminal Data</p>
        </div>
        <div className="flex flex-col xl:flex-row w-full md:w-auto items-stretch xl:items-center gap-4 md:gap-6">
            <div className="flex flex-wrap bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                {['today', 'week', 'month', 'all'].map(tf => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`flex-1 min-w-[70px] px-3 md:px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                            timeframe === tf ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tf === 'all' ? 'All Time' : tf === 'today' ? 'Today' : tf}
                    </button>
                ))}
            </div>
            
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
      
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard title="Total Net Profit" value={`$${stats.totalPnl}`} color={parseFloat(stats.totalPnl) >= 0 ? 'text-green-400 font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'text-red-400'} />
        <StatCard title="Success Rate" value={`${stats.winRate}%`} color="text-cyan-400" />
        <StatCard title="Total Iterations" value={stats.totalTrades} color="text-purple-400"/>
        <StatCard title="Active Systems" value={stats.openPositions} color="text-yellow-400"/>
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
        <h2 className="text-xl font-semibold mb-4 text-white">MT5 Account Trades ({filteredTrades.length})</h2>
        {filteredTrades.length === 0 ? (
           <div className="text-center p-4 text-gray-500 font-mono text-sm">No trades found in the selected timeframe.</div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
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
                  {filteredTrades.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(trade => (
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