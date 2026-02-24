import React, { createContext, useContext, useState } from 'react';
import { Trade } from '../types';

type InsightContextValue = {
  openChat: (trade: Trade) => void;
};

const TradeInsightContext = createContext<InsightContextValue | null>(null);

export const useTradeInsight = () => {
  const ctx = useContext(TradeInsightContext);
  if (!ctx) throw new Error('useTradeInsight must be used within TradeInsightProvider');
  return ctx;
};

export const TradeInsightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);

  const openChat = (trade: Trade) => {
    setCurrentTrade(trade);
    // Dispatch a custom event so ChatBot can listen as well
    window.dispatchEvent(new CustomEvent('trade-insight-open', { detail: trade }));
  };

  return (
    <TradeInsightContext.Provider value={{ openChat }}>
      {children}
    </TradeInsightContext.Provider>
  );
};

export default TradeInsightContext;
