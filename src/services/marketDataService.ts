// Mock market data service - In production, this would connect to a real API
// For demo purposes, we'll simulate live market data

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

interface SymbolInfo {
  symbol: string;
  name: string;
  market: 'forex' | 'crypto' | 'stocks';
  baseCurrency: string;
  quoteCurrency: string;
}

const FOREX_SYMBOLS: SymbolInfo[] = [
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', market: 'forex', baseCurrency: 'EUR', quoteCurrency: 'USD' },
  { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', market: 'forex', baseCurrency: 'GBP', quoteCurrency: 'USD' },
  { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', market: 'forex', baseCurrency: 'USD', quoteCurrency: 'JPY' },
  { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', market: 'forex', baseCurrency: 'AUD', quoteCurrency: 'USD' },
  { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', market: 'forex', baseCurrency: 'USD', quoteCurrency: 'CAD' },
  { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', market: 'forex', baseCurrency: 'USD', quoteCurrency: 'CHF' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', market: 'forex', baseCurrency: 'NZD', quoteCurrency: 'USD' },
  { symbol: 'EURGBP', name: 'Euro vs British Pound', market: 'forex', baseCurrency: 'EUR', quoteCurrency: 'GBP' },
  { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', market: 'forex', baseCurrency: 'EUR', quoteCurrency: 'JPY' },
  { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', market: 'forex', baseCurrency: 'GBP', quoteCurrency: 'JPY' },
];

const CRYPTO_SYMBOLS: SymbolInfo[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin vs USDT', market: 'crypto', baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  { symbol: 'ETHUSDT', name: 'Ethereum vs USDT', market: 'crypto', baseCurrency: 'ETH', quoteCurrency: 'USDT' },
  { symbol: 'ADAUSDT', name: 'Cardano vs USDT', market: 'crypto', baseCurrency: 'ADA', quoteCurrency: 'USDT' },
  { symbol: 'DOTUSDT', name: 'Polkadot vs USDT', market: 'crypto', baseCurrency: 'DOT', quoteCurrency: 'USDT' },
  { symbol: 'LINKUSDT', name: 'Chainlink vs USDT', market: 'crypto', baseCurrency: 'LINK', quoteCurrency: 'USDT' },
  { symbol: 'BNBUSDT', name: 'Binance Coin vs USDT', market: 'crypto', baseCurrency: 'BNB', quoteCurrency: 'USDT' },
];

const STOCK_SYMBOLS: SymbolInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'stocks', baseCurrency: 'AAPL', quoteCurrency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'stocks', baseCurrency: 'GOOGL', quoteCurrency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', market: 'stocks', baseCurrency: 'MSFT', quoteCurrency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'stocks', baseCurrency: 'AMZN', quoteCurrency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'stocks', baseCurrency: 'TSLA', quoteCurrency: 'USD' },
];

export const ALL_SYMBOLS = [...FOREX_SYMBOLS, ...CRYPTO_SYMBOLS, ...STOCK_SYMBOLS];

class MarketDataService {
  private prices: Map<string, MarketData> = new Map();
  private listeners: Map<string, ((data: MarketData) => void)[]> = new Map();

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
    // Simulate price updates every 5 seconds
    setInterval(() => this.updatePrices(), 5000);
  }

  private initializeMockData() {
    ALL_SYMBOLS.forEach(symbol => {
      const basePrice = this.getBasePrice(symbol.symbol);
      this.prices.set(symbol.symbol, {
        symbol: symbol.symbol,
        price: basePrice,
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 1,
        timestamp: Date.now(),
      });
    });
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 150.50,
      'AUDUSD': 0.6550,
      'USDCAD': 1.3450,
      'USDCHF': 0.8850,
      'NZDUSD': 0.6150,
      'EURGBP': 0.8570,
      'EURJPY': 163.20,
      'GBPJPY': 190.50,
      'BTCUSDT': 45000,
      'ETHUSDT': 2500,
      'ADAUSDT': 0.45,
      'DOTUSDT': 7.50,
      'LINKUSDT': 14.50,
      'BNBUSDT': 300,
      'AAPL': 185,
      'GOOGL': 140,
      'MSFT': 380,
      'AMZN': 155,
      'TSLA': 200,
    };
    return basePrices[symbol] || 1.0;
  }

  private updatePrices() {
    this.prices.forEach((data, symbol) => {
      const change = (Math.random() - 0.5) * 0.002;
      const newPrice = data.price + change;
      const newData = {
        ...data,
        price: newPrice,
        change: change,
        changePercent: (change / data.price) * 100,
        timestamp: Date.now(),
      };
      this.prices.set(symbol, newData);
      this.notifyListeners(symbol, newData);
    });
  }

  public getPrice(symbol: string): MarketData | undefined {
    return this.prices.get(symbol);
  }

  public getAllPrices(): MarketData[] {
    return Array.from(this.prices.values());
  }

  public getSymbolsByMarket(market: 'forex' | 'crypto' | 'stocks'): SymbolInfo[] {
    switch (market) {
      case 'forex':
        return FOREX_SYMBOLS;
      case 'crypto':
        return CRYPTO_SYMBOLS;
      case 'stocks':
        return STOCK_SYMBOLS;
      default:
        return [];
    }
  }

  public subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, []);
    }
    this.listeners.get(symbol)?.push(callback);
  }

  public unsubscribe(symbol: string, callback: (data: MarketData) => void) {
    const callbacks = this.listeners.get(symbol);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(symbol: string, data: MarketData) {
    const callbacks = this.listeners.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const marketDataService = new MarketDataService();
