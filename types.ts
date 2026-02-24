export type TradeSource = 'mt5' | 'bot';
export type FilterType = 'all' | TradeSource;
export type TradeStatus = 'open' | 'closed';
export type TradeDirection = 'buy' | 'sell';

export interface Trade {
  id: string;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  timestamp: Date;
  status: TradeStatus;
  pnl?: number;
  source: TradeSource;
}

export interface BotDecisionStep {
  title: string;
  description: string;
  indicator?: string;
  type: 'market_condition' | 'signal' | 'action';
}

export interface AnalyticsInsight {
  tradeId: string;
  insight: string;
  loading: boolean;
  error?: string;
  decisionPath?: BotDecisionStep[];
}