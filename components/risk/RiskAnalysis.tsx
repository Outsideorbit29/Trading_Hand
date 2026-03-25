import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie, Sector 
} from 'recharts';
import Card from '../shared/Card';
import { 
    ActivityIcon, BrainIcon, TrendingUpIcon, ShieldIcon, AlertTriangleIcon, 
    BarChart3Icon, CheckCircleIcon, XCircleIcon, InfoIcon 
} from '../shared/Icons';

const API_BASE_URL = 'http://127.0.0.1:5000';

const RiskAnalysis: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeframe, setTimeframe] = useState('all');

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/risk-analysis?timeframe=${timeframe}`);
      if (res.ok) {
          const json = await res.json();
          setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch risk data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#fff" className="font-orbitron font-bold text-sm">
          {payload.asset}
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#06b6d4" className="font-mono text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill="#06b6d4" />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12} fill="#06b6d4" />
      </g>
    );
  };

  if (loading && !data) {
    return (
        <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!data || !data.DashboardData) {
      return (
        <Card className="p-10 flex flex-col items-center justify-center text-center mt-10">
            <AlertTriangleIcon className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Engine Awaiting Data</h2>
            <p className="text-gray-400 font-mono text-xs">Verify MT5 connection or execute trades to generate the Risk Profile.</p>
        </Card>
      );
  }

  const { DashboardData, RiskScore, DecisionEngine, Alerts, Suggestions } = data;
  const metrics = DashboardData.riskMetrics;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Global Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-6 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter font-orbitron">Risk Engine Hub</h1>
          <p className="text-cyan-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 mb-4">Capital Preservation & Discipline Matrix</p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' }
            ].map(tf => (
               <button 
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all ${
                     timeframe === tf.id ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                  }`}
               >
                 {tf.label}
               </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className={`px-4 md:px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl border ${DecisionEngine.status === 'APPROVED' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
             {DecisionEngine.status === 'APPROVED' ? <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-green-400 shrink-0" /> : <XCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-red-400 shrink-0" />}
             <div>
                <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Decision Engine</span>
                <span className={`block font-bold text-lg font-orbitron ${DecisionEngine.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>
                  {DecisionEngine.status}
                </span>
             </div>
          </div>
          <div className="px-6 py-3 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-4 shadow-xl">
             <ShieldIcon className="w-8 h-8 text-cyan-400" />
             <div className="text-right">
                <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">Risk Score</span>
                <span className={`block font-bold text-2xl font-orbitron ${RiskScore >= 80 ? 'text-green-400' : RiskScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {RiskScore} <span className="text-sm text-gray-500">/ 100</span>
                </span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Primary Alerts & Decision Logic */}
      {(Alerts.length > 0 || DecisionEngine.status !== 'APPROVED') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {DecisionEngine.status === 'REJECTED' && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-400 text-sm">Execution Halted</h4>
                        <p className="text-xs text-red-200/70 mt-1">{DecisionEngine.reason}</p>
                    </div>
                </div>
            )}
            {Alerts.map((alert: any, idx: number) => (
                <div key={idx} className={`border p-4 rounded-xl flex items-start gap-3 ${alert.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' : alert.severity === 'HIGH' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <AlertTriangleIcon className={`w-5 h-5 mt-0.5 shrink-0 ${alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`} />
                    <div>
                        <h4 className={`font-bold text-sm ${alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-yellow-400'}`}>{alert.type}</h4>
                        <p className="text-xs text-gray-300 mt-1">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* High-Level Overview Widget Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <Card className="bg-black/40 border-white/5 p-3 md:p-4 text-center">
             <p className="text-[9px] text-gray-500 font-mono uppercase">Live Equity</p>
             <p className="text-lg md:text-xl font-bold text-white font-orbitron">${DashboardData.accountMetrics.liveEquity}</p>
          </Card>
          <Card className="bg-black/40 border-white/5 p-3 md:p-4 text-center">
             <p className="text-[9px] text-gray-500 font-mono uppercase">Win Rate</p>
             <p className={`text-lg md:text-xl font-bold font-orbitron ${metrics.winRate > 50 ? 'text-green-400' : 'text-red-400'}`}>{metrics.winRate}%</p>
          </Card>
          <Card className="bg-black/40 border-white/5 p-4 text-center">
             <p className="text-[9px] text-gray-500 font-mono uppercase">Expectancy</p>
             <p className={`text-xl font-bold font-orbitron ${metrics.expectancy > 0 ? 'text-green-400' : 'text-red-400'}`}>${metrics.expectancy}</p>
          </Card>
          <Card className="bg-black/40 border-white/5 p-4 text-center">
             <p className="text-[9px] text-gray-500 font-mono uppercase">Max Drawdown</p>
             <p className={`text-xl font-bold font-orbitron ${metrics.maxDrawdown < 15 ? 'text-green-400' : 'text-red-400'}`}>{metrics.maxDrawdown}%</p>
          </Card>
          <Card className="bg-black/40 border-white/5 p-4 text-center">
             <p className="text-[9px] text-gray-500 font-mono uppercase">Profit Factor</p>
             <p className="text-xl font-bold text-white font-orbitron">{metrics.profitFactor}</p>
          </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="xl:col-span-2 space-y-6">
              <Card className="bg-black/60 border-cyan-500/20 p-6">
                  <h3 className="text-lg font-bold text-white font-orbitron mb-6 flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-cyan-400" /> Equity Curve & Drawdown Timeline
                  </h3>
                  <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={DashboardData.equityCurveGraph}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                              <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} tickFormatter={(val) => new Date(val).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
                              <YAxis yAxisId="left" stroke="#888" fontSize={10} tickFormatter={(val) => `$${val}`} />
                              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={10} tickFormatter={(val) => `${val}%`} />
                              <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #333', borderRadius: '8px' }}
                                  labelFormatter={(val) => new Date(val).toLocaleString()}
                              />
                              <Line yAxisId="left" type="monotone" dataKey="equity" stroke="#06b6d4" strokeWidth={3} dot={false} name="Equity ($)" />
                              <Line yAxisId="right" type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="5 5" name="Drawdown (%)" />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-white/5 p-6">
                      <h3 className="text-sm font-bold text-white font-orbitron mb-4 flex items-center gap-2">
                          <BarChart3Icon className="w-4 h-4 text-cyan-400" /> RRR Distribution Histogram
                      </h3>
                      <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={DashboardData.rrrHistogram}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                  <XAxis dataKey="range" stroke="#666" fontSize={10} />
                                  <YAxis stroke="#666" fontSize={10} />
                                  <Tooltip cursor={{fill: '#111'}} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
                  
                  <Card className="bg-black/40 border-white/5 p-6 flex flex-col justify-center items-center relative">
                      <h3 className="text-sm font-bold text-white font-orbitron absolute top-6 left-6 flex items-center gap-2">
                          <ActivityIcon className="w-4 h-4 text-cyan-400" /> Capital Allocation
                      </h3>
                      <div className="h-48 w-full mt-8">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={DashboardData.riskDistribution}
                                      cx="50%" cy="50%"
                                      innerRadius={50} outerRadius={70}
                                      dataKey="allocationPercent"
                                      labelLine={false}
                                      label={({ payload, percent }) => `${payload.asset}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                      {DashboardData.riskDistribution.map((entry: any, index: number) => (
                                          <Cell key={`cell-${index}`} fill={['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 6]} />
                                      ))}
                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </Card>
              </div>

              {/* Asset Performance Matrix */}
              <Card className="bg-black/40 border-white/5 p-4 md:p-6 overflow-x-auto">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-4">Asset Profitability & RRR Matrix</h3>
                 
                 <div className="flex flex-col sm:flex-row mb-6 gap-4">
                     {DashboardData.bestAsset && (
                        <div className="flex-1 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                            <span className="text-[10px] text-green-400 font-mono uppercase block mb-1">Top Performer</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold font-orbitron text-white">{DashboardData.bestAsset.asset}</span>
                                <span className="text-lg font-bold text-green-400 mb-0.5">+{DashboardData.bestAsset.pnl}</span>
                            </div>
                        </div>
                     )}
                     {DashboardData.worstAsset && (
                        <div className="flex-1 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                            <span className="text-[10px] text-red-400 font-mono uppercase block mb-1">Worst Performer</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold font-orbitron text-white">{DashboardData.worstAsset.asset}</span>
                                <span className="text-lg font-bold text-red-400 mb-0.5">{DashboardData.worstAsset.pnl}</span>
                            </div>
                        </div>
                     )}
                 </div>

                 {DashboardData.assetPerformance && DashboardData.assetPerformance.length > 0 && (
                     <div className="min-w-[500px]">
                         <table className="w-full text-left border-collapse whitespace-nowrap">
                             <thead>
                                 <tr className="border-y border-white/10 text-[10px] uppercase font-mono text-gray-500 tracking-wider bg-white/5">
                                     <th className="py-3 pl-4">Asset</th>
                                     <th className="py-3">Net PnL</th>
                                     <th className="py-3">Avg RRR</th>
                                     <th className="py-3">Best RRR</th>
                                     <th className="py-3 text-right pr-4">Worst RRR</th>
                                 </tr>
                             </thead>
                             <tbody className="text-xs">
                                 {DashboardData.assetPerformance.map((item: any, idx: number) => (
                                     <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                         <td className="py-3 pl-4 font-bold text-white">{item.asset}</td>
                                         <td className={`py-3 font-semibold ${item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                             {item.pnl >= 0 ? '+' : ''}${item.pnl.toFixed(2)}
                                         </td>
                                         <td className="py-3 font-mono text-gray-300">1 : {item.avgRrr.toFixed(2)}</td>
                                         <td className="py-3 font-mono text-green-400">1 : {item.bestRrr.toFixed(2)}</td>
                                         <td className="py-3 font-mono text-red-400 text-right pr-4">1 : {item.worstRrr.toFixed(2)}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
                 {(!DashboardData.assetPerformance || DashboardData.assetPerformance.length === 0) && (
                     <div className="text-center p-4 text-gray-500 font-mono text-sm">No asset data available.</div>
                 )}
              </Card>

              {/* Trade Log Table */}
              <Card className="bg-black/40 border-white/5 p-4 md:p-6 overflow-x-auto">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-4">Tactical Trade Log</h3>
                 <div className="min-w-[600px]">
                     <table className="w-full text-left border-collapse whitespace-nowrap">
                         <thead>
                             <tr className="border-b border-white/10 text-[10px] uppercase font-mono text-gray-500 tracking-wider">
                                 <th className="pb-3 pl-2">Asset</th>
                                 <th className="pb-3">Entry</th>
                                 <th className="pb-3">SL</th>
                                 <th className="pb-3">TP</th>
                                 <th className="pb-3">RRR</th>
                                 <th className="pb-3">Risk %</th>
                                 <th className="pb-3 text-right pr-2">Outcome</th>
                             </tr>
                         </thead>
                     <tbody className="text-xs">
                         {DashboardData.tradeLog.map((trade: any) => (
                             <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                 <td className="py-3 pl-2 font-bold text-white">{trade.symbol}</td>
                                 <td className="py-3 text-gray-300">{trade.entry}</td>
                                 <td className="py-3 text-gray-300">{trade.sl === 0 ? '-' : trade.sl}</td>
                                 <td className="py-3 text-gray-300">{trade.tp === 0 ? '-' : trade.tp}</td>
                                 <td className="py-3 font-mono text-gray-400">{trade.rrr}</td>
                                 <td className="py-3 font-mono text-gray-400">{trade.riskPercent}%</td>
                                 <td className={`py-3 text-right pr-2 font-bold ${trade.outcome === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                                     {trade.outcome} ({trade.pnl > 0 ? '+' : ''}{trade.pnl})
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 </div>
              </Card>
          </div>

          {/* Right Column Data */}
          <div className="space-y-6">
             <Card className="bg-black/60 border-cyan-500/20 p-6">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-5">System Suggestions</h3>
                 <ul className="space-y-4">
                     {Suggestions.map((sug: string, idx: number) => (
                         <li key={idx} className="flex gap-3 text-sm text-gray-300 items-start">
                             <CheckCircleIcon className="w-5 h-5 text-cyan-500 shrink-0" />
                             <span className="leading-relaxed">{sug}</span>
                         </li>
                     ))}
                 </ul>
             </Card>

             <Card className="bg-black/40 border-white/5 p-6">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-4">Leverage Exposure Gauge</h3>
                 <div className="flex items-center justify-between mb-2">
                     <span className="text-xs text-gray-400 font-mono">Current State</span>
                     <span className={`text-sm font-bold font-orbitron px-2 py-1 bg-white/5 rounded ${DashboardData.leverageExposureGauge.status === 'High' ? 'text-red-400' : 'text-green-400'}`}>
                         {DashboardData.leverageExposureGauge.status}
                     </span>
                 </div>
                 <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-mono">Effective Leverage</span>
                     <span className="text-xl font-bold text-white">{DashboardData.leverageExposureGauge.effectiveLeverage}</span>
                 </div>
                 <div className="w-full bg-white/10 h-2 mt-4 rounded-full overflow-hidden flex">
                    {/* Simulated Gauge Bar */}
                    <div className="h-full bg-green-500 w-1/3"></div>
                    <div className="h-full bg-yellow-500 w-1/3"></div>
                    <div className="h-full bg-red-500 w-1/3"></div>
                 </div>
                 <div className="w-full relative h-2 -translate-y-2">
                     <div className="absolute w-1 h-4 bg-white shadow-[0_0_10px_white]" style={{ left: DashboardData.leverageExposureGauge.status === 'High' ? '85%' : DashboardData.leverageExposureGauge.status === 'Medium' ? '50%' : '15%' }}></div>
                 </div>
             </Card>

             <Card className="bg-black/40 border-white/5 p-6">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-4 flex justify-between">
                     Correlation Heatmap 
                     <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">RISK OVERLAP</span>
                 </h3>
                 <div className="space-y-3">
                     {Object.entries(DashboardData.correlationExposure).map(([pair, val]: [string, any], idx) => (
                         <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded">
                             <span className="text-xs font-mono text-gray-300">{pair.replace('_', ' x ')}</span>
                             <span className={`text-sm font-bold ${val > 0.8 ? 'text-red-400' : val > 0.5 ? 'text-yellow-400' : 'text-green-400'}`}>
                                 {val.toFixed(2)}
                             </span>
                         </div>
                     ))}
                 </div>
             </Card>

             <Card className="bg-black/40 border-white/5 p-6">
                 <h3 className="text-sm font-bold text-white font-orbitron mb-4">Statistical Edge</h3>
                 <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                            <span>Consecutive Losses</span>
                            <span>{metrics.consecutiveLosses} / 5</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${Math.min(100, (metrics.consecutiveLosses/5)*100)}%` }} 
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                                className={`h-full ${metrics.consecutiveLosses >= 5 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                            />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                            <span>100-Trade Prob. Profit</span>
                            <span>{metrics.probProfitable100}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${metrics.probProfitable100}%` }} 
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                                className={`h-full ${metrics.probProfitable100 > 50 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            />
                        </div>
                     </div>
                 </div>
             </Card>
          </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
