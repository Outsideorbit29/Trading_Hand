import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trade, AnalyticsInsight, BotDecisionStep } from '../../types';
import { analyzeTradeWithGemini, analyzeBotTradeForVisualization } from '../../services/geminiService';
import Card from '../shared/Card';
import { 
    MarketIcon, SignalIcon, ActionIcon, BrainIcon, 
    ZapIcon, GlobeIcon, ChevronRightIcon, InfoIcon,
    TrendingUpIcon, SpinnerIcon, CheckCircleIcon 
} from '../shared/Icons';

const API_BASE_URL = 'http://127.0.0.1:5000';

// --- Modules Data (Mocked for "everything required") ---
const LEARNING_MODULES = [
    { 
        id: 'mod1', 
        title: 'Foundational Mechanics', 
        desc: 'Understand order flow, liquidity pools, and market cycles.', 
        level: 'Beginner', 
        progress: 100,
        icon: GlobeIcon
    },
    { 
        id: 'mod2', 
        title: 'Price Action Mastery', 
        desc: 'Read charts without indicators. Supply, demand, and volume analysis.', 
        level: 'Intermediate', 
        progress: 65,
        icon: TrendingUpIcon
    },
    { 
        id: 'mod3', 
        title: 'Quantum Risk Matrix', 
        desc: 'Advanced position sizing using Kelly Criterion and Monte Carlo.', 
        level: 'Advanced', 
        progress: 20,
        icon: ZapIcon
    },
    { 
        id: 'mod4', 
        title: 'Algorithmic Logic', 
        desc: 'How to translate strategy into executable bot code.', 
        level: 'Expert', 
        progress: 0,
        icon: BrainIcon
    }
];

const MARKET_SENTIMENT = [
    { pair: 'EURUSD', mood: 'Bullish', strength: 78, color: 'text-green-400' },
    { pair: 'BTCUSD', mood: 'Neutral', strength: 52, color: 'text-yellow-400' },
    { pair: 'GBPUSD', mood: 'Bearish', strength: 84, color: 'text-red-400' }
];

// --- Sub-components ---

const ModuleCard: React.FC<{ mod: typeof LEARNING_MODULES[0] }> = ({ mod }) => (
    <div className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform`}>
                <mod.icon />
            </div>
            <span className="text-xs font-mono text-gray-300 bg-black/40 px-2 py-0.5 rounded-full uppercase">{mod.level}</span>
        </div>
        <h4 className="font-bold text-gray-100 text-base mb-1">{mod.title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">{mod.desc}</p>
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>PROGRESS</span>
                <span>{mod.progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.progress}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="h-full bg-cyan-500"
                />
            </div>
        </div>
    </div>
);

const SentimentPill: React.FC<{ item: typeof MARKET_SENTIMENT[0] }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-300">{item.pair}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase ${item.color}`}>{item.mood}</span>
            <div className="w-12 bg-white/5 h-1 rounded-full">
                <div className={`h-full ${item.color.replace('text', 'bg')} rounded-full`} style={{ width: `${item.strength}%` }}></div>
            </div>
        </div>
    </div>
);

const BotDecisionPathVisualizer: React.FC<{ path: BotDecisionStep[] }> = ({ path }) => {
    const getIconForStep = (type: BotDecisionStep['type']) => {
        switch (type) {
            case 'market_condition': return <MarketIcon />;
            case 'signal': return <SignalIcon />;
            case 'action': return <ActionIcon />;
            default: return null;
        }
    };

    return (
        <div className="mt-6 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
                <ZapIcon className="w-24 h-24 text-cyan-500" />
            </div>
            <h4 className="text-xs font-orbitron text-cyan-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                <SignalIcon className="w-3 h-3"/> Recursive Decision Intelligence
            </h4>
            <div className="relative border-l border-cyan-500/30 ml-3 pl-6 space-y-6">
                {path.map((step, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
                        key={index} 
                        className="relative"
                    >
                        <div className="absolute -left-[33px] top-0 h-4 w-4 rounded-full bg-black border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            <div className="scale-50">{getIconForStep(step.type)}</div>
                        </div>
                        <p className="text-xs font-bold text-cyan-200 uppercase tracking-tight">{step.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 italic">"{step.description}"</p>
                        {step.indicator && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-2 py-0.5 rounded text-[9px] font-mono text-yellow-400">
                                <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
                                {step.indicator}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- Main Page ---

const Analytics: React.FC = () => {
    const [insights, setInsights] = useState<Record<string, AnalyticsInsight>>({});
    const [trades, setTrades] = useState<Trade[]>([]);
    const [expandedTrade, setExpandedTrade] = useState<string | null>(null);
    const [loadingTrades, setLoadingTrades] = useState(true);

    const fetchTrades = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/trades/history`);
            if (res.ok) {
                const data = await res.json();
                const parsed = (data.trades || []).map((t: any) => ({
                    ...t,
                    timestamp: new Date(t.timestamp)
                }));
                parsed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                setTrades(parsed);
            }
        } catch (err) {
            console.error('Learning data fetch error:', err);
        } finally {
            setLoadingTrades(false);
        }
    };

    useEffect(() => {
        fetchTrades();
        const interval = setInterval(fetchTrades, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleAnalyze = useCallback(async (trade: Trade) => {
        setInsights(prev => ({
            ...prev,
            [trade.id]: { tradeId: trade.id, insight: '', loading: true }
        }));

        try {
            if (trade.source === 'bot') {
                const { insight, decisionPath } = await analyzeBotTradeForVisualization(trade);
                setInsights(prev => ({
                    ...prev,
                    [trade.id]: { ...prev[trade.id], insight, decisionPath, loading: false }
                }));
            } else {
                const result = await analyzeTradeWithGemini(trade);
                setInsights(prev => ({
                    ...prev,
                    [trade.id]: { ...prev[trade.id], insight: result, loading: false }
                }));
            }
        } catch (error) {
            setInsights(prev => ({
                ...prev,
                [trade.id]: { ...prev[trade.id], insight: '', loading: false, error: 'AI analysis timeout. Retry.' }
            }));
        }
    }, []);

    const closedTrades = useMemo(() => trades.filter(t => t.status === 'closed').slice(0, 10), [trades]);
    
    // AI Coach Insights based on closed trades
    const coachStats = useMemo(() => {
        if (closedTrades.length === 0) return { rec: "Start trading to receive personalized AI coaching.", score: "0", status: "Neutral" };
        
        const wins = closedTrades.filter(t => (t.pnl || 0) > 0).length;
        const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
        const winRate = (wins / closedTrades.length) * 100;
        
        let rec = "Your current trend-following logic is optimal.";
        let status = "Optimal";
        
        if (winRate < 40) {
            rec = "Focus on avoiding over-leveraged JPY trades and verify R-Multiple before entry.";
            status = "Caution";
        } else if (totalPnl < 0) {
            rec = "Your win rate is good, but your losses are larger than wins. Tighten your stop-losses.";
            status = "Improvement Required";
        }

        return { 
            rec,
            score: winRate.toFixed(0),
            status
        };
    }, [closedTrades]);

    return (
        <div className="space-y-10 pb-20">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-1"
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter font-orbitron">Learning Neural</h1>
                    <p className="text-cyan-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em]">Advanced Market Analysis & Training Hub</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
                    className="flex items-center gap-4"
                >
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl px-6 py-3 flex items-center gap-4 backdrop-blur-md">
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 block font-mono uppercase">Mastery Index</span>
                            <span className="text-2xl font-bold text-white font-orbitron">{coachStats.score}%</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
                            <CheckCircleIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Learning Dashboard */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 🤖 AI Trading Coach Insight */}
                    <Card className="bg-gradient-to-br from-cyan-900/30 to-black border-cyan-500/30 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BrainIcon className="w-48 h-48" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-cyan-500/20 rounded-xl">
                                <BrainIcon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white font-orbitron">Neural Coach Feedback</h3>
                                <p className="text-[10px] text-gray-500 font-mono">PERSONALIZED STRATEGY OPTIMIZATION</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                                <p className="text-gray-300 text-sm leading-relaxed italic">
                                    "Based on your last 10 sessions, your {coachStats.score === '0' ? 'initial setup phase is critical' : 'trend validation has improved by 12%'}. {coachStats.rec}"
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-[9px] text-gray-500 block font-mono uppercase">Top Mistake</span>
                                    <span className="text-xs font-bold text-red-400">Exit Slippage</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-[9px] text-gray-500 block font-mono uppercase">Top Strength</span>
                                    <span className="text-xs font-bold text-green-400">Setup Discipline</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 md:col-span-1 col-span-2">
                                    <span className="text-[9px] text-gray-500 block font-mono uppercase">Recovery Plan</span>
                                    <span className="text-xs font-bold text-cyan-400">RSI Divergence Mod.</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 📋 Enhanced Trade Journal */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ActionIcon className="w-5 h-5 text-cyan-500" /> Tactical Lessons
                            </h2>
                            <span className="text-[10px] text-gray-500 font-mono uppercase">LATEST {closedTrades.length} ENTRIES</span>
                        </div>
                        
                        {loadingTrades ? (
                            <div className="flex items-center justify-center p-20">
                                <SpinnerIcon className="w-10 h-10 text-cyan-500" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {closedTrades.map(trade => {
                                    const insight = insights[trade.id];
                                    const isExpanded = expandedTrade === trade.id;
                                    const isWin = (trade.pnl ?? 0) > 0;

                                    return (
                                        <Card key={trade.id} className={`transition-all duration-300 ${isExpanded ? 'ring-2 ring-cyan-500/40 bg-white/5' : 'hover:border-white/20'}`}>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${isWin ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                                                {trade.symbol.slice(0, 2)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white">{trade.symbol}</h4>
                                                                <p className="text-[10px] text-gray-500 font-mono uppercase">{trade.source} • {trade.timestamp.toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-xl font-bold font-orbitron ${isWin ? 'text-green-400' : 'text-red-500'}`}>
                                                                {isWin ? '+' : ''}${trade.pnl?.toFixed(2)}
                                                            </p>
                                                            <p className="text-[9px] text-gray-500 font-mono uppercase">{trade.direction} @ {trade.entryPrice}</p>
                                                        </div>
                                                    </div>

                                                    {!insight && (
                                                        <button
                                                            onClick={() => handleAnalyze(trade)}
                                                            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95"
                                                        >
                                                            <BrainIcon className="w-4 h-4" /> Analyze Lesson
                                                        </button>
                                                    )}

                                                    {insight && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -5 }} 
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                            className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-4"
                                                        >
                                                            {insight.loading ? (
                                                                <div className="flex items-center gap-3 h-10">
                                                                    <SpinnerIcon className="w-4 h-4 text-cyan-500" />
                                                                    <span className="text-[10px] text-cyan-500 font-mono uppercase animate-pulse">Running Neural Inference...</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-start gap-4">
                                                                        <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                                                                            <InfoIcon className="w-4 h-4 text-purple-400" />
                                                                        </div>
                                                                        <p className="text-sm text-gray-300 italic leading-relaxed">"{insight.insight}"</p>
                                                                    </div>
                                                                    {trade.source === 'bot' && insight.decisionPath && (
                                                                        <button 
                                                                            onClick={() => setExpandedTrade(isExpanded ? null : trade.id)}
                                                                            className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-tighter hover:gap-2 transition-all"
                                                                        >
                                                                            {isExpanded ? 'Collapse' : 'Visualize'} Logic Path <ChevronRightIcon className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <AnimatePresence>
                                                {isExpanded && trade.source === 'bot' && insight?.decisionPath && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <BotDecisionPathVisualizer path={insight.decisionPath} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Modules & Sentiment */}
                <div className="space-y-8">
                    {/* Mastery Modules */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-orbitron text-gray-300 uppercase tracking-widest">Training Modules</h2>
                            <ZapIcon className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {LEARNING_MODULES.map(mod => <ModuleCard key={mod.id} mod={mod} />)}
                        </div>
                    </div>

                    {/* Market Mood Engine */}
                    <Card className="p-5 border-l-4 border-cyan-500">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <GlobeIcon className="w-4 h-4 text-cyan-500" /> MARKET MOOD ENGINE
                        </h3>
                        <div className="space-y-3">
                            {MARKET_SENTIMENT.map((item, idx) => <SentimentPill key={idx} item={item} />)}
                        </div>
                    </Card>

                    {/* Daily Challenge Card */}
                    <Card className="bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
                            </div>
                            <h4 className="font-bold text-yellow-400 text-sm">Today's Protocol</h4>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 font-mono leading-relaxed">Identify 3 setups on H1 timeframe with confirmed RSI divergence before entry.</p>
                        <button className="w-full py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-xl text-[10px] font-bold uppercase hover:bg-yellow-500 hover:text-white transition-all">
                            Complete Checklist
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Analytics;