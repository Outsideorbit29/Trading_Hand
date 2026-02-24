import React, { useEffect, useState } from 'react';
import { Trade } from '../types';
import { analyzeTradeWithGemini, analyzeBotTradeForVisualization, analyzeTradeWithQuestion } from '../services/geminiService';

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
        title="Ask AI"
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
          <div className="w-full max-w-md bg-gray-800 rounded-t-lg shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">AI</div>
                <div>
                  <h4 className="font-bold">Trade Insight</h4>
                  <p className="text-xs text-gray-400">Ask the AI about a selected trade</p>
                </div>
              </div>
              <div>
                <button onClick={handleClose} className="text-gray-300 hover:text-white">Close</button>
              </div>
            </div>

            <div className="p-4 h-80 overflow-y-auto">
              {trade ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">Selected: <strong>{trade.symbol}</strong> — {trade.direction.toUpperCase()} — {trade.status.toUpperCase()}</div>
                  <div className="space-y-2">
                    {messages.map((m, i) => (
                      <div key={i} className={m.role === 'assistant' ? 'bg-gray-700 p-3 rounded' : 'bg-gray-900 p-3 rounded self-end'}>
                        <p className="text-sm">{m.text}</p>
                      </div>
                    ))}
                    {loading && <p className="text-sm text-gray-400">Analyzing...</p>}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Open a trade in Trade History and click "Ask AI" to get insight.</div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-3">
              <input value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} className="flex-1 bg-gray-900 px-3 py-2 rounded text-sm text-white" placeholder="Ask a question about the trade (optional)" />
              <button onClick={sendQuestion} className="px-4 py-2 bg-cyan-500 rounded text-white" disabled={loading || !userQuestion.trim()}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
