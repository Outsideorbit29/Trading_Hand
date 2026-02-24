import React, { useState, useCallback } from 'react';
import { Trade, AnalyticsInsight, BotDecisionStep } from '../types';
import { useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';
import { analyzeTradeWithGemini, analyzeBotTradeForVisualization } from '../services/geminiService';
import Card from './shared/Card';
import { MarketIcon, SignalIcon, ActionIcon } from './shared/Icons';

const getIconForStep = (type: BotDecisionStep['type']) => {
  switch (type) {
    case 'market_condition': return <MarketIcon />;
    case 'signal': return <SignalIcon />;
    case 'action': return <ActionIcon />;
    default: return null;
  }
};

const BotDecisionPathVisualizer: React.FC<{ path: BotDecisionStep[] }> = ({ path }) => (
  <div className="mt-4 border-t border-gray-700 pt-4">
    <h4 className="font-semibold text-gray-200 mb-4">Learning Path</h4>
    <div className="relative border-l-2 border-cyan-800/50 ml-4 pl-8 space-y-8">
      {path.map((step, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-[43px] top-1 h-6 w-6 rounded-full bg-gray-800 border-2 border-cyan-500 flex items-center justify-center ring-4 ring-gray-800">
            {getIconForStep(step.type)}
          </div>
          <p className="font-bold text-cyan-400">{step.title}</p>
          <p className="text-sm text-gray-400">{step.description}</p>
          {step.indicator && <p className="text-xs font-mono bg-gray-700 text-yellow-300 inline-block px-2 py-1 rounded mt-2">{step.indicator}</p>}
        </div>
      ))}
    </div>
  </div>
);


const Analytics: React.FC = () => {
  const [insights, setInsights] = useState<Record<string, AnalyticsInsight>>({});
  const [expandedViz, setExpandedViz] = useState<string | null>(null);

  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchTrades = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/trades/history`);
        if (!res.ok) throw new Error('Failed to fetch trades');
        const data = await res.json();
        // Expect data.trades to be an array
        const parsed: Trade[] = (data.trades || []).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
        // Keep newest first
        parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (mounted) setTrades(parsed);
      } catch (err) {
        console.error('Could not load trades for Learning page:', err);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const tradesToAnalyze = trades.filter(t => t.status === 'closed').slice(0, 10);

  const handleAnalyze = useCallback(async (trade: Trade) => {
    setInsights(prev => ({
      ...prev,
      [trade.id]: { tradeId: trade.id, insight: '', loading: true }
    }));
    setExpandedViz(null);

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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setInsights(prev => ({
        ...prev,
        [trade.id]: { ...prev[trade.id], insight: '', loading: false, error: errorMessage }
      }));
    }
  }, []);

  const TradeAnalysisCard: React.FC<{ trade: Trade }> = ({ trade }) => {
    const insight = insights[trade.id];
    const pnlColor = (trade.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400';
    const canShowViz = insight && !insight.loading && trade.source === 'bot' && insight.decisionPath && insight.decisionPath.length > 0;

    return (
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{trade.symbol} 
                    <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${trade.source === 'bot' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
                      {trade.source.toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">{trade.timestamp.toLocaleDateString()}</p>
                </div>
                <p className={`text-xl font-bold ${pnlColor}`}>${trade.pnl?.toFixed(2)}</p>
              </div>
              <div className="text-sm grid grid-cols-2 gap-2 text-gray-300 pt-2">
                <p><strong>Direction:</strong> {trade.direction.toUpperCase()}</p>
                <p><strong>Quantity:</strong> {trade.quantity}</p>
                <p><strong>Entry:</strong> ${trade.entryPrice.toFixed(2)}</p>
                <p><strong>Exit:</strong> ${trade.exitPrice?.toFixed(2)}</p>
              </div>
            </div>
            <div className="md:w-1/2 md:border-l md:pl-6 border-gray-700 flex flex-col justify-center">
              {insight && insight.loading && (
                <div className="flex items-center space-x-2 text-cyan-400 self-center">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </div>
              )}
              {insight && !insight.loading && insight.insight && (
                <div className="space-y-3">
                    <p className="text-sm text-gray-300 italic">"{insight.insight}"</p>
                    {canShowViz && (
                      <button 
                        onClick={() => setExpandedViz(prev => prev === trade.id ? null : trade.id)}
                        className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                         {expandedViz === trade.id ? 'Hide' : 'View'} Learning Path
                      </button>
                    )}
                </div>
              )}
              {insight && !insight.loading && insight.error && (
                <p className="text-sm text-red-400">{insight.error}</p>
              )}
              {!insight && (
                <button
                  onClick={() => handleAnalyze(trade)}
                  className="bg-cyan-500 self-center text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition duration-300"
                >
                  Learn from Trade
                </button>
              )}
            </div>
        </div>
        {expandedViz === trade.id && canShowViz && (
          <BotDecisionPathVisualizer path={insight.decisionPath!} />
        )}
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Learning & Analysis</h1>
      <p className="text-gray-400 max-w-3xl">
        Learn from your past trades and receive clear, actionable analysis. This page provides concise lessons on trade outcomes, helps you identify patterns, and — for bot-executed trades — visualizes the decision path so you can iteratively improve strategies and learn what worked or failed.
      </p>
      <div className="space-y-4">
        {tradesToAnalyze.map(trade => (
          <TradeAnalysisCard key={trade.id} trade={trade} />
        ))}
      </div>
    </div>
  );
};

export default Analytics;