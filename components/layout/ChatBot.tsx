import React, { useEffect, useState } from 'react';
import { Trade } from '../../types';
import { analyzeTradeWithGemini, analyzeBotTradeForVisualization, analyzeTradeWithQuestion } from '../../services/geminiService';

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user'|'assistant', text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');

  useEffect(() => {
    const handler = (e: any) => {
      const t: Trade = e.detail;
      setTrade(t);
      setMessages([]);
      setOpen(true);
      // Push an initial user message describing the trade
      setMessages([{ role: 'user', text: `Please analyze this trade: ${t.symbol} ${t.direction.toUpperCase()} entry ${t.entryPrice} qty ${t.quantity} status ${t.status}` }]);
      fetchInsight(t);
    };

    window.addEventListener('trade-insight-open', handler as EventListener);
    return () => window.removeEventListener('trade-insight-open', handler as EventListener);
  }, []);

    const fetchInsight = async (t: Trade) => {
    setLoading(true);
    try {
      if (t.source === 'bot') {
        const result = await analyzeBotTradeForVisualization(t as any);
        setMessages(prev => [...prev, { role: 'assistant', text: result.insight }]);
      } else {
        const result = await analyzeTradeWithGemini(t as any);
        setMessages(prev => [...prev, { role: 'assistant', text: result }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: err?.message || 'Analysis failed' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async () => {
    if (!trade || !userQuestion.trim()) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);
    try {
      const answer = await analyzeTradeWithQuestion(trade, userQuestion.trim());
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
      setUserQuestion('');
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: err?.message || 'Failed to get answer' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTrade(null);
    setMessages([]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        title="Ask AI Intelligence"
        className="fixed bottom-10 right-10 z-[60] bg-cyan-500 hover:bg-cyan-400 text-black rounded-full w-16 h-16 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:scale-110 active:scale-95 animate-float group"
      >
        <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-20"></div>
        <svg className="w-8 h-8 relative group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 7l0 6" stroke="black" />
          <path d="M9 10l6 0" stroke="black" />
        </svg>
      </button>

      {/* Modal / Sidebar */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
          <div className="w-full max-w-md glass-panel border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto animate-slide-up flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-500 text-black rounded-lg flex items-center justify-center font-black font-orbitron rotate-3">AI</div>
                <div>
                  <h4 className="font-bold font-orbitron text-sm text-cyan-400 tracking-wider">CORE INTELLIGENCE</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Neural Link Enabled</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center hover:bg-cyan-500/10 text-cyan-500 transition-all border border-cyan-500/10">✕</button>
            </div>

            <div className="p-6 h-[450px] overflow-y-auto font-rajdhani">
              {trade ? (
                <div className="space-y-4">
                  <div className="glass-panel border-cyan-500/20 p-3 bg-cyan-500/5 text-xs text-cyan-300 font-orbitron flex justify-between items-center">
                    <span>UNIT: {trade.symbol}</span>
                    <span className="animate-pulse">ACTIVE ANALYSIS</span>
                  </div>
                  
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`p-4 rounded-none border ${m.role === 'assistant' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-100' : 'bg-gray-900/50 border-gray-700 text-gray-300 ml-8'}`}>
                        <div className="text-[10px] uppercase font-orbitron mb-2 opacity-50">{m.role === 'assistant' ? 'Neural Response' : 'User Query'}</div>
                        <p className="text-sm leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-3 text-cyan-400/50 italic text-sm">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                        Processing Neural Threads...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                  <div className="w-16 h-16 border-2 border-dashed border-cyan-500/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <p className="font-orbitron text-xs tracking-widest text-cyan-500 italic">STANDBY: Awaiting Data Input</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-cyan-500/10 flex items-center gap-3 bg-black/20">
              <input 
                value={userQuestion} 
                onChange={(e) => setUserQuestion(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
                className="flex-1 bg-gray-900/80 border border-cyan-500/10 focus:border-cyan-500/50 outline-none px-4 py-3 text-sm text-white font-rajdhani transition-all" 
                placeholder="INPUT COMMAND OR QUERY" 
              />
              <button 
                onClick={sendQuestion} 
                className="w-12 h-12 flex items-center justify-center bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                disabled={loading || !userQuestion.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
