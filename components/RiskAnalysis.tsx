
import React, { useState, useEffect, useMemo } from 'react';
import { RiskAnalysisData, Trade } from '../types';
import Card from './shared/Card';
import { SpinnerIcon, ShieldIcon, TrendingUpIcon, BarChart3Icon } from './shared/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const API_BASE_URL = 'http://127.0.0.1:5000';

const RiskAnalysis: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskAnalysisData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [riskRes, tradesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/risk-analysis`),
        fetch(`${API_BASE_URL}/trades/history`)
      ]);
      
      if (riskRes.ok && tradesRes.ok) {
        const risk = await riskRes.json();
        const trds = await tradesRes.json();
        setRiskData(risk);
        setTrades(trds.trades.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })));
      }
    } catch (error) {
      console.error("Error fetching risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const drawdownData = useMemo(() => {
    let cumulative = 0;
    let peak = 0;
    return trades.slice().sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()).map((t, i) => {
      cumulative += t.pnl || 0;
      if (cumulative > peak) peak = cumulative;
      const drawdown = peak - cumulative;
      return {
        name: `T${i+1}`,
        equity: cumulative,
        drawdown: -drawdown
      };
    });
  }, [trades]);

  const pnlDistribution = useMemo(() => {
    if (!trades.length) return [];
    const wins = trades.filter(t => (t.pnl || 0) > 0).length;
    const losses = trades.filter(t => (t.pnl || 0) < 0).length;
    return [
      { name: 'Wins', value: wins, color: '#10B981' },
      { name: 'Losses', value: losses, color: '#EF4444' }
    ];
  }, [trades]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <SpinnerIcon className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-400 animate-pulse font-mono">CALCULATING RISK PARAMETERS...</p>
        </div>
      </div>
    );
  }

  const StatBox = ({ title, value, sub, color = "text-white" }: { title: string, value: string | number, sub?: string, color?: string }) => (
    <Card className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldIcon />
      </div>
      <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </Card>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <ShieldIcon />
          </div>
          <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Risk & Performance Analysis</h1>
              <p className="text-gray-400 font-mono text-sm">SYSTEM STABILITY AND PROFITABILITY PROJECTION</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox 
            title="Account Survival Prob." 
            value={`${riskData?.prob_profitable_100}%`} 
            sub="Likelihood of profit after 100 trades"
            color="text-cyan-400"
        />
        <StatBox 
            title="Max System Drawdown" 
            value={`$${riskData?.max_drawdown}`} 
            sub="Largest peak-to-trough decline"
            color="text-red-400" 
        />
        <StatBox 
            title="Profit Factor" 
            value={riskData?.profit_factor || 0} 
            sub="Gross Profit / Gross Loss"
            color="text-green-400"
        />
        <StatBox 
            title="Expected Value" 
            value={`$${riskData?.expected_value}`} 
            sub="Average outcome per trade"
            color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                    <TrendingUpIcon /> Equity & Drawdown Evolution
                </h2>
                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">LIVE SYNC</span>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={drawdownData}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDD" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                        <XAxis dataKey="name" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="equity" stroke="#06B6D4" fillOpacity={1} fill="url(#colorEquity)" strokeWidth={2} />
                        <Area type="monotone" dataKey="drawdown" stroke="#EF4444" fillOpacity={1} fill="url(#colorDD)" strokeWidth={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card>
            <h2 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                <BarChart3Icon /> Win/Loss Distribution
            </h2>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                        <Pie
                            data={pnlDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pnlDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-8 mt-4 w-full px-4">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase font-mono">Win Rate</p>
                        <p className="text-xl font-bold text-green-400">{riskData?.win_rate}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase font-mono">Sharpe</p>
                        <p className="text-xl font-bold text-cyan-400">{riskData?.sharpe_ratio}</p>
                    </div>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center space-x-4 border-l-4 border-yellow-500">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                  <span className="text-yellow-500 font-bold">!</span>
              </div>
              <div>
                  <h4 className="text-sm font-bold text-gray-300">Max Consecutive Losses</h4>
                  <p className="text-2xl font-bold text-white">{riskData?.consecutive_losses}</p>
              </div>
          </Card>
          <Card className="flex items-center space-x-4 border-l-4 border-blue-500">
              <div className="p-3 bg-blue-500/10 rounded-full">
                  <span className="text-blue-500 font-bold">$</span>
              </div>
              <div>
                  <h4 className="text-sm font-bold text-gray-300">Average Win</h4>
                  <p className="text-2xl font-bold text-white">${riskData?.avg_win}</p>
              </div>
          </Card>
          <Card className="flex items-center space-x-4 border-l-4 border-red-500">
              <div className="p-3 bg-red-500/10 rounded-full">
                  <span className="text-red-500 font-bold">$</span>
              </div>
              <div>
                  <h4 className="text-sm font-bold text-gray-300">Average Loss</h4>
                  <p className="text-2xl font-bold text-white">${riskData?.avg_loss}</p>
              </div>
          </Card>
      </div>

      <Card className="bg-gradient-to-r from-cyan-900/20 to-transparent border-cyan-500/30">
        <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
            <ShieldIcon /> Risk AI Insight
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
            {riskData && riskData.prob_profitable_100 > 70 
                ? "Your current strategy shows strong statistical edges. The high survival probability suggests your risk management is offsetting market volatility effectively."
                : riskData && riskData.win_rate < 40
                ? "The win rate is lower than optimal. Consider tightening your stop-losses or verifying market entry conditions. Your current drawdown level is noteworthy."
                : "The system is performing within normal variance parameters. Maintain current risk-per-trade to ensure long-term account growth."}
        </p>
      </Card>
    </div>
  );
};

export default RiskAnalysis;
