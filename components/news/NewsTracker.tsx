import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLiveNews, NewsArticle } from '../../services/newsService';
import Card from '../shared/Card';
import { 
    GlobeIcon, ZapIcon, InfoIcon, Globe2Icon, 
    Share2Icon, ExternalLinkIcon, RefreshCwIcon,
    AlertTriangleIcon, NewspaperIcon, RadioIcon,
    TrendingUpIcon, ActivityIcon
} from '../shared/Icons';

const NewsTracker: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        let mounted = true;
        
        const loadNews = async () => {
            setLoading(true);
            const data = await fetchLiveNews();
            if (mounted) {
                setNews(data);
                setLoading(false);
            }
        };

        loadNews();
        const interval = setInterval(loadNews, 300000); // 5 minutes refresh
        return () => { mounted = false; clearInterval(interval); };
    }, []);

    const filteredNews = news.filter(n => filter === 'all' || n.category.includes(filter) || n.sentiment?.toLowerCase() === filter.toLowerCase());

    return (
        <div className="space-y-10 pb-20">
            {/* Live Ticker Header */}
            <div className="bg-cyan-500/10 border-y border-cyan-500/20 py-3 relative overflow-hidden backdrop-blur-md">
                <div className="absolute left-0 top-0 h-full bg-cyan-500/40 w-40 z-10 flex items-center justify-center border-r border-cyan-500/40">
                    <span className="text-xs font-orbitron text-white uppercase tracking-widest flex items-center gap-2">
                        <RadioIcon className="w-4 h-4 animate-pulse text-red-500" /> LIVE BROADCAST
                    </span>
                </div>
                <div className="flex animate-marquee whitespace-nowrap gap-10 pl-40">
                    {news.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <span className="text-sm font-mono text-cyan-400">[{new Date(item.pubDate).toLocaleTimeString()}]</span>
                            <span className="text-sm font-bold text-gray-200 uppercase tracking-tight">{item.title}</span>
                            <span className="w-2 h-2 rounded-full bg-cyan-700 mx-2"></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main News Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* News Grid */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter flex items-center gap-3">
                                <NewspaperIcon className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 shrink-0" /> System Intelligence Feed
                            </h1>
                            <p className="text-gray-400 font-mono text-xs md:text-sm uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-2">
                                <ActivityIcon className="w-4 h-4" /> Real-time Tracking Enabled • {news.length} Sources Active
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'Bullish', 'Bearish', 'High Impact'].map(f => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f === 'High Impact' ? 'High' : f)}
                                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border rounded-xl transition-all ${
                                        filter === (f === 'High Impact' ? 'High' : f) ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                            {[1,2,4,6].map(i => (
                                <div key={i} className="h-64 bg-white/5 rounded-3xl border border-white/10"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {filteredNews.map((article, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        key={idx}
                                        className="group relative h-full flex flex-col"
                                    >
                                        <Card className="h-full flex flex-col border-white/5 hover:border-cyan-500/40 bg-black/40 backdrop-blur-xl group transition-all duration-500 hover:-translate-y-2">
                                            {/* Article Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/20`}>
                                                        {article.source_id.toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-400">{new Date(article.pubDate).toLocaleTimeString()}</span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                    article.impact === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                                                    article.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 
                                                    'bg-green-500/20 text-green-500 border border-green-500/20'
                                                }`}>
                                                    <ZapIcon className="w-3 h-3" /> {article.impact} IMPACT
                                                </div>
                                            </div>

                                            {/* Article Content */}
                                            <h3 className="text-lg font-bold text-gray-100 leading-snug mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 font-rajdhani">
                                                {article.description}
                                            </p>

                                            {/* Footer Info */}
                                            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        article.sentiment === 'Bullish' ? 'bg-green-500/10 text-green-400' :
                                                        article.sentiment === 'Bearish' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-gray-500/10 text-gray-400'
                                                    }`}>
                                                        {article.sentiment === 'Bullish' ? <TrendingUpIcon className="w-4 h-4" /> : <ActivityIcon className="w-4 h-4" />}
                                                    </div>
                                                    <span className={`text-xs font-bold uppercase ${
                                                        article.sentiment === 'Bullish' ? 'text-green-400' :
                                                        article.sentiment === 'Bearish' ? 'text-red-500' :
                                                        'text-gray-300'
                                                    }`}>{article.sentiment} Bias</span>
                                                </div>
                                                <a 
                                                    href={article.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all transform active:scale-90"
                                                >
                                                    <ExternalLinkIcon className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Sentiment & Global Mood Sidebar */}
                <div className="space-y-8">
                    {/* Global Sentiment Meter */}
                    <Card className="p-6 bg-gradient-to-br from-cyan-900/30 to-black border-cyan-500/30">
                        <h4 className="text-sm font-orbitron text-cyan-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                            <RadioIcon className="w-5 h-5" /> Global Market Mood
                        </h4>
                        <div className="space-y-6">
                            <div className="text-center">
                                <span className="text-4xl font-bold text-white font-orbitron">BULLISH</span>
                                <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">SENTIMENT INDEX: 72/100</p>
                            </div>
                            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full opacity-30"></div>
                                <motion.div 
                                    initial={{ left: '0%' }}
                                    animate={{ left: '72%' }}
                                    transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.5 }}
                                    className="absolute top-0 w-2 h-full bg-white shadow-[0_0_15px_#fff] z-10"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-gray-400 uppercase">
                                <div className="p-2 bg-white/5 rounded border border-white/5">Fear Index: <span className="text-red-400">Low</span></div>
                                <div className="p-2 bg-white/5 rounded border border-white/5">Vol Index: <span className="text-cyan-400">Mid</span></div>
                            </div>
                        </div>
                    </Card>

                    {/* Sources Map */}
                    <Card className="p-6 border-white/10 bg-white/[0.04]">
                        <h4 className="text-xs font-orbitron text-gray-300 mb-4 uppercase tracking-tighter">Verified Intelligence Network</h4>
                        <div className="space-y-4">
                            {['Reuters', 'Bloomberg', 'Coindesk', 'Financial Times', 'Wall Street Journal'].map(s => (
                                <div key={s} className="flex items-center justify-between text-xs font-bold text-gray-200">
                                    <span className="flex items-center gap-2"><GlobeIcon className="w-4 h-4 text-cyan-600" /> {s}</span>
                                    <span className="text-green-400 font-mono opacity-80 uppercase">ENCRYPTED</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold uppercase hover:bg-cyan-500 hover:text-white transition-all tracking-widest">
                            Configure Sources
                        </button>
                    </Card>

                    {/* Impact Alert Checklist */}
                    <Card className="border-l-4 border-red-500/50 bg-red-500/10 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangleIcon className="w-6 h-6 text-red-500" />
                            <h4 className="font-bold text-red-400 text-base">Critical Watchlist</h4>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-5 h-5 rounded border border-red-500/40 bg-black flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-sm bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
                                <span className="text-xs text-gray-200 font-bold uppercase tracking-wide">FOMC Meeting Minutes</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-5 h-5 rounded border border-red-500/40 bg-black flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div></div>
                                <span className="text-xs text-gray-200 font-bold uppercase tracking-wide">US Non-Farm Payrolls</span>
                            </label>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NewsTracker;
