import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { mt5Service } from '../services/mt5Service';
import { mt5BrokerService } from '../services/mt5BrokerService';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number;
  status: 'open' | 'closed';
  market_type: 'forex' | 'crypto';
  created_at: string;
  closed_at: string | null;
}

interface MT5Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number;
  status: 'open' | 'closed';
  market_type: 'forex' | 'crypto';
  created_at: string;
  closed_at: string | null;
  source: 'mt5';
}

interface Broker {
  id: string;
  name: string;
  is_active: boolean;
  connected?: boolean; // Make optional for UI compatibility
  created_at: string;
}

interface PortfolioStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalProfitLoss: number;
  winRate: number;
  totalInvested: number;
}

interface PortfolioContextType {
  trades: Trade[];
  mt5Trades: MT5Trade[];
  allTrades: (Trade | MT5Trade)[];
  brokers: Broker[];
  stats: PortfolioStats;
  loading: boolean;
  connectedBroker: Broker | null;
  brokerConnectionStatus: 'connected' | 'disconnected' | 'connecting';
  refreshData: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
  connectBroker: (brokerId: string) => Promise<void>;
  disconnectBroker: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [mt5Trades, setMt5Trades] = useState<MT5Trade[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [connectedBroker, setConnectedBroker] = useState<Broker | null>(null);
  const [brokerConnectionStatus, setBrokerConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [stats, setStats] = useState<PortfolioStats>({
    totalTrades: 0,
    openTrades: 0,
    closedTrades: 0,
    totalProfitLoss: 0,
    winRate: 0,
    totalInvested: 0,
  });
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Combine manual trades and MT5 trades
  const allTrades = [...trades, ...mt5Trades];
  
  const connectBroker = async (brokerId: string) => {
    setBrokerConnectionStatus('connecting');
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const broker = brokers.find(b => b.id === brokerId) || null;
      setConnectedBroker(broker);
      setBrokerConnectionStatus('connected');
    } catch (error) {
      console.error('Error connecting to broker:', error);
      setBrokerConnectionStatus('disconnected');
      setConnectedBroker(null);
    }
  };

  const disconnectBroker = async () => {
    setBrokerConnectionStatus('disconnected');
    setConnectedBroker(null);
  };

  // Sample data for guest users
  const sampleTrades: Trade[] = [
    {
      id: 'sample-1',
      symbol: 'EURUSD',
      side: 'buy',
      quantity: 1.5,
      entry_price: 1.1234,
      exit_price: 1.1289,
      profit_loss: 82.5,
      status: 'closed',
      market_type: 'forex',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      closed_at: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'sample-2',
      symbol: 'BTCUSDT',
      side: 'buy',
      quantity: 0.1,
      entry_price: 45000,
      exit_price: null,
      profit_loss: 0,
      status: 'open',
      market_type: 'crypto',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      closed_at: null,
    },
    {
      id: 'sample-3',
      symbol: 'GBPUSD',
      side: 'sell',
      quantity: 2.0,
      entry_price: 1.2567,
      exit_price: 1.2534,
      profit_loss: 66.0,
      status: 'closed',
      market_type: 'forex',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      closed_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const sampleBrokers: Broker[] = [
    {
      id: 'sample-broker-1',
      name: 'MetaTrader 5',
      is_active: true,
      created_at: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: 'sample-broker-2',
      name: 'Zerodha Kite',
      is_active: true,
      created_at: new Date(Date.now() - 1209600000).toISOString(),
    },
  ];

  const fetchMT5Trades = async () => {
    if (!user || isGuest) return;

    try {
      // Check if MT5 service is available
      const isAvailable = await mt5BrokerService.checkServiceAvailability();
      if (!isAvailable) {
        console.log('MT5 service not available, skipping MT5 trades fetch');
        return;
      }

      // Get MT5 trades from database
      const mt5TradeHistory = await mt5Service.getTradeHistory(user.id);
      
      // Convert MT5 trades to our trade format
      const convertedTrades: MT5Trade[] = mt5TradeHistory.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        side: trade.type === 0 ? 'buy' : 'sell',
        quantity: trade.volume,
        entry_price: trade.price_open,
        exit_price: trade.price_close || null,
        profit_loss: trade.profit,
        status: trade.price_close ? 'closed' : 'open',
        market_type: 'forex' as const,
        created_at: trade.open_time || new Date().toISOString(),
        closed_at: trade.close_time || null,
        source: 'mt5' as const,
      }));

      setMt5Trades(convertedTrades);
    } catch (error) {
      console.error('Error fetching MT5 trades:', error);
      // Don't throw error, just log it
    }
  };

  const fetchTrades = async () => {
    if (!user || isGuest || !supabase) return;

    console.debug('Fetching trades for user:', user.id);
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trades:', error);
      return;
    }

    console.debug('Fetched trades:', data);
    setTrades(data || []);
  };

  const fetchBrokers = async () => {
    if (!user || isGuest || !supabase) return;

    console.debug('Fetching brokers for user:', user.id);
    const { data, error } = await supabase
      .from('brokers')
      .select('id, name, is_active, created_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    console.debug('Fetched brokers:', data);
    setBrokers(data || []);
  };

  const calculateStats = (trades: Trade[]) => {
    const allTradesForStats = [...trades, ...mt5Trades];
    const totalTrades = allTradesForStats.length;
    const openTrades = allTradesForStats.filter(t => t.status === 'open').length;
    const closedTrades = allTradesForStats.filter(t => t.status === 'closed').length;
    const totalProfitLoss = allTradesForStats.reduce((sum, trade) => sum + trade.profit_loss, 0);
    const winningTrades = allTradesForStats.filter(t => t.profit_loss > 0).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;
    const totalInvested = allTradesForStats.reduce((sum, trade) => sum + (trade.entry_price * trade.quantity), 0);

    setStats({
      totalTrades,
      openTrades,
      closedTrades,
      totalProfitLoss,
      winRate,
      totalInvested,
    });
  };

  const refreshData = async () => {
    setLoading(true);
    if (isGuest) {
      setTrades(sampleTrades);
      setBrokers(sampleBrokers);
      setMt5Trades([]);
    } else {
      await Promise.all([fetchTrades(), fetchBrokers(), fetchMT5Trades()]);
    }
    setLoading(false);
  };

  const addTrade = async (trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    if (isGuest) {
      const newTrade = {
        ...trade,
        id: `sample-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setTrades(prev => [newTrade, ...prev]);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const { error } = await supabase
      .from('trades')
      .insert({
        ...trade,
        user_id: user.id,
      });

    if (error) {
      console.error('Error adding trade:', error);
      throw error;
    }

    await fetchTrades();
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    if (isGuest) {
      setTrades(prev => prev.map(trade => 
        trade.id === id ? { ...trade, ...updates } : trade
      ));
      return;
    }

    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const { error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating trade:', error);
      throw error;
    }

    await fetchTrades();
  };

  useEffect(() => {
    if (user && supabase) {
      refreshData();

      // Setup Supabase real-time subscription for trades
      const subscription = supabase
        .channel('public:trades')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'trades', filter: `user_id=eq.${user.id}` },
          (payload) => {
          const newTrade = payload.new as Trade;
          const oldTrade = payload.old as Trade;
          console.debug('Realtime trade event:', payload.eventType, newTrade, oldTrade);
          switch (payload.eventType) {
            case 'INSERT':
              setTrades((prev) => [newTrade, ...prev]);
              break;
            case 'UPDATE':
              setTrades((prev) =>
                prev.map((trade) => (trade.id === newTrade.id ? newTrade : trade))
              );
              break;
            case 'DELETE':
              setTrades((prev) => prev.filter((trade) => trade.id !== oldTrade.id));
              break;
          }
          }
        )
        .subscribe();

      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    calculateStats(trades);
  }, [trades, mt5Trades]);

  // Real-time subscription for trades
  useEffect(() => {
    if (!user || isGuest || !supabase) return;

    // Subscribe to real-time changes in trades table
    const channel = supabase
      .channel('realtime-trades')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          handleRealtimeTradeUpdate(payload);
        }
      )
      .subscribe();

    setSubscription(channel);

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, isGuest]);

  const handleRealtimeTradeUpdate = (payload: any) => {
          const { eventType, new: newTrade, old: oldTrade } = payload;

          console.debug('Realtime trade update:', eventType, newTrade, oldTrade);

          switch (eventType) {
            case 'INSERT':
              setTrades(prevTrades => {
                // Avoid duplicate insertion
                if (prevTrades.some(t => t.id === newTrade.id)) {
                  return prevTrades;
                }
                return [newTrade, ...prevTrades];
              });
              break;
              
            case 'UPDATE':
              setTrades(prevTrades => 
                prevTrades.map(trade => 
                  trade.id === newTrade.id ? newTrade : trade
                )
              );
              break;
              
            case 'DELETE':
              setTrades(prevTrades => 
                prevTrades.filter(trade => trade.id !== oldTrade.id)
              );
              break;
          }
  };

  // Real-time subscription for brokers
  useEffect(() => {
    if (!user || isGuest || !supabase) return;

    const channel = supabase
      .channel('realtime-brokers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brokers',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          handleRealtimeBrokerUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, isGuest]);

  const handleRealtimeBrokerUpdate = (payload: any) => {
          const { eventType, new: newBroker, old: oldBroker } = payload;

          console.debug('Realtime broker update:', eventType, newBroker, oldBroker);

          switch (eventType) {
            case 'INSERT':
              setBrokers(prevBrokers => {
                if (prevBrokers.some(b => b.id === newBroker.id)) {
                  return prevBrokers;
                }
                return [newBroker, ...prevBrokers];
              });
              break;
              
            case 'UPDATE':
              setBrokers(prevBrokers => 
                prevBrokers.map(broker => 
                  broker.id === newBroker.id ? newBroker : broker
                )
              );
              break;
              
            case 'DELETE':
              setBrokers(prevBrokers => 
                prevBrokers.filter(broker => broker.id !== oldBroker.id)
              );
              break;
          }
  };

  const value = {
    trades,
    mt5Trades,
    allTrades,
    brokers,
    stats,
    loading,
    connectedBroker,
    brokerConnectionStatus,
    refreshData,
    addTrade,
    updateTrade,
    connectBroker,
    disconnectBroker,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}