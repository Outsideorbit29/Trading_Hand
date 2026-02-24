
import { Trade } from '../types';

const generateRandomTrade = (index: number, source: 'mt5' | 'bot'): Trade => {
  const symbols = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const direction = Math.random() > 0.5 ? 'buy' : 'sell';
  const entryPrice = parseFloat((Math.random() * 500 + 100).toFixed(2));
  const quantity = Math.floor(Math.random() * 100) + 1;
  const status = Math.random() > 0.2 ? 'closed' : 'open';
  const timestamp = new Date(Date.now() - index * 1000 * 60 * 60 * 24);
  
  let exitPrice: number | undefined;
  let pnl: number | undefined;

  if (status === 'closed') {
    const priceChange = (Math.random() - 0.45) * 20; // -9 to +11
    exitPrice = parseFloat((entryPrice + priceChange).toFixed(2));
    pnl = parseFloat(((exitPrice - entryPrice) * quantity * (direction === 'buy' ? 1 : -1)).toFixed(2));
  }

  return {
    id: `trade-${index}`,
    symbol,
    direction,
    entryPrice,
    exitPrice,
    quantity,
    timestamp,
    status,
    pnl,
    source,
  };
};

export const mockTrades: Trade[] = Array.from({ length: 50 }, (_, i) => 
  generateRandomTrade(i, i % 3 === 0 ? 'bot' : 'mt5')
);
