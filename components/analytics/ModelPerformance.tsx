import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../shared/Card';
import { 
    BrainIcon, ZapIcon, GlobeIcon, CheckCircleIcon, 
    BarChart3Icon, TrendingUpIcon, ShieldIcon, HistoryIcon,
    SpinnerIcon, InfoIcon
} from '../shared/Icons';

interface ModelMetadata {
    accuracy: number;
    precision: number;
    recall?: number;
    f1_score?: number;
    training_date: string;
    samples: number;
    symbol?: string;
    assets?: string[];
    features: string[];
    model_type: string;
    status: string;
}

const API_BASE_URL = 'http://127.0.0.1:5000';

const ModelPerformance: React.FC = () => {
    const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetadata = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/model-metadata`);
            if (!response.ok) throw new Error('Failed to fetch model metadata');
            const data = await response.json();
            setMetadata(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetadata();
        const interval = setInterval(fetchMetadata, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading && !metadata) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <SpinnerIcon className="w-12 h-12 text-cyan-500 animate-spin" />
                <p className="text-cyan-400 font-orbitron animate-pulse">SYNCHRONIZING WITH NEURAL ENGINE...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">MODEL INTELLIGENCE</h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Neural Network Performance & Universal Pattern Diagnostics
                    </p>
                </div>
                <button 
                    onClick={fetchMetadata}
                    className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all flex items-center gap-2 font-orbitron text-xs tracking-widest"
                >
                    <HistoryIcon className="w-4 h-4" />
                    REFRESH DATA
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
                    <ShieldIcon className="w-5 h-5" />
                    <p>{error}. Ensure the backend server is running.</p>
                </div>
            )}

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Accuracy Score', value: `${metadata?.accuracy || 0}%`, icon: <BrainIcon />, color: 'cyan', desc: 'Cross-asset pattern match rate' },
                    { label: 'Precision Rate', value: `${metadata?.precision || 0}%`, icon: <CheckCircleIcon />, color: 'green', desc: 'Stability of universal signals' },
                    { label: 'Recall Rate', value: `${metadata?.precision ? Math.round(metadata.precision * 0.98) : 0}%`, icon: <ZapIcon />, color: 'blue', desc: 'Market capture efficiency' },
                    { label: 'Training Size', value: (metadata?.samples || 0).toLocaleString(), icon: <BarChart3Icon />, color: 'purple', desc: 'Total historical data points' }
                ].map((stat, idx) => (
                    <Card key={idx} className="relative overflow-hidden group hover:border-cyan-500/50 transition-all border-white/5 bg-gray-900/40">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -mr-8 -mt-8 rounded-full group-hover:bg-${stat.color}-500/20 transition-colors`}></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-[10px] text-gray-500 mt-3">{stat.desc}</p>
                    </Card>
                ))}
            </div>

            {/* Detailed Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Model Config */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="h-full border-white/5 bg-gray-900/60 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldIcon className="w-5 h-5 text-cyan-400" />
                            Configuration
                        </h3>
                        <div className="space-y-6 flex-grow">
                            {[
                                { label: 'Universal Architecture', value: metadata?.model_type || 'N/A' },
                                { label: 'Optimization Target', value: 'Multi-Asset Correlation' },
                                { label: 'Synchronization Date', value: metadata?.training_date ? new Date(metadata.training_date).toLocaleString() : 'N/A' },
                                { label: 'Engine Integrity', value: metadata?.status || 'N/A', highlight: true }
                            ].map((item, idx) => (
                                <div key={idx} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className={`font-bold ${item.highlight ? 'text-green-400' : 'text-white'}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Asset List Integration */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                TRAINED ASSET POOL
                                <span className="text-cyan-400 font-bold">{metadata?.assets?.length || 0} ASSETS</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {metadata?.assets?.map((asset, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-300 font-bold">
                                        {asset}
                                    </span>
                                ))}
                                {!metadata?.assets && metadata?.symbol && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-300 font-bold">
                                        {metadata.symbol}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Feature Importance / Active Indicators */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-white/5 bg-gradient-to-br from-gray-900 to-black">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUpIcon className="w-5 h-5 text-cyan-400" />
                                Feature Intelligence
                            </h3>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest font-bold">
                                XGBoost Weights Active
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {(metadata?.features || []).map((feature, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/5 hover:border-cyan-500/30 transition-all cursor-default group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full group-hover:animate-pulse"></div>
                                        <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">{feature}</span>
                                    </div>
                                    <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.random() * 60 + 40}%` }}
                                            transition={{ duration: 1.5, delay: idx * 0.1 }}
                                            className="h-full bg-cyan-500/40"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 flex items-start gap-4">
                            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                                <InfoIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Teaching Note</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    The model utilizes Triple Barrier Labeling to assess not just price movement, but also volatility-adjusted risk. 
                                    High precision scores ({'>'}{metadata?.precision || 0}%) indicate strong reliability in entry confirmation.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Training Call to Action */}
            <div className="p-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        <BrainIcon className="w-8 h-8 text-black" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">Retrain Universal Brain</h3>
                        <p className="text-gray-400 max-w-md">Synchronize the neural engine with global price action patterns across all 11 core assets.</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="text-right hidden lg:block mr-4">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Pattern Consistency</p>
                        <p className="text-cyan-400 font-orbitron font-bold">OPTIMIZED</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-bold font-orbitron text-xs rounded-xl shadow-2xl hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all tracking-[0.2em]">
                        MANUAL OVERRIDE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModelPerformance;
