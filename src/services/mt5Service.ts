import { supabase } from '../lib/supabase';

export interface MT5AccountData {
  id: string;
  account_number: number;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  leverage: number;
  profit: number;
  server: string;
  last_updated: string;
}

export interface MT5Position {
  id: string;
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  price_open: number;
  price_current: number;
  profit: number;
}

export interface MT5Trade {
  id: string;
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  price_open: number;
  price_close?: number;
  profit: number;
  open_time: string;
  close_time?: string;
}

export class MT5Service {
  // Get MT5 account data for current user
  async getAccountData(userId: string): Promise<MT5AccountData[]> {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase credentials');
    }

    try {
      const { data, error } = await supabase
        .from('mt5_account_data')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('❌ Database error fetching MT5 account data:', {
          error,
          userId,
          table: 'mt5_account_data'
        });
        
        if (error.code === '42P01') {
          throw new Error('MT5 account data table does not exist. Please run database migrations');
        } else if (error.code === '42501') {
          throw new Error('Permission denied to access MT5 account data');
        }
        
        throw new Error(`Failed to fetch MT5 account data: ${error.message || 'Unknown database error'}`);
      }

      console.log('✅ MT5 account data fetched successfully:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('❌ Error in getAccountData:', {
        message: error.message,
        userId,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Get open positions
  async getOpenPositions(userId: string): Promise<MT5Position[]> {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase credentials');
    }

    try {
      const { data, error } = await supabase
        .from('mt5_positions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error fetching MT5 positions:', {
          error,
          userId,
          table: 'mt5_positions'
        });
        
        if (error.code === '42P01') {
          throw new Error('MT5 positions table does not exist. Please run database migrations');
        }
        
        throw new Error(`Failed to fetch MT5 positions: ${error.message || 'Unknown database error'}`);
      }

      console.log('✅ MT5 positions fetched successfully:', data?.length || 0, 'positions');
      return data || [];
    } catch (error: any) {
      console.error('❌ Error in getOpenPositions:', {
        message: error.message,
        userId,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Get trade history
  async getTradeHistory(userId: string, limit = 50): Promise<MT5Trade[]> {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase credentials');
    }

    try {
      const { data, error } = await supabase
        .from('mt5_trades')
        .select('*')
        .eq('user_id', userId)
        .order('open_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Database error fetching MT5 trades:', {
          error,
          userId,
          table: 'mt5_trades',
          limit
        });
        
        if (error.code === '42P01') {
          throw new Error('MT5 trades table does not exist. Please run database migrations');
        }
        
        throw new Error(`Failed to fetch MT5 trades: ${error.message || 'Unknown database error'}`);
      }

      console.log('✅ MT5 trade history fetched successfully:', data?.length || 0, 'trades');
      return data || [];
    } catch (error: any) {
      console.error('❌ Error in getTradeHistory:', {
        message: error.message,
        userId,
        limit,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Update MT5 account data (called from webhook)
  async updateAccountData(data: {
    user_id: string;
    broker_id: string;
    account_data: any;
  }) {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase credentials');
    }

    try {
      const { error } = await supabase
        .from('mt5_account_data')
        .upsert({
          user_id: data.user_id,
          broker_id: data.broker_id,
          account_number: data.account_data.account_number,
          balance: data.account_data.balance,
          equity: data.account_data.equity,
          margin: data.account_data.margin,
          free_margin: data.account_data.free_margin,
          leverage: data.account_data.leverage,
          profit: data.account_data.profit,
          server: data.account_data.server,
          last_updated: new Date().toISOString(),
        });

      if (error) {
        console.error('❌ Database error updating MT5 account data:', {
          error,
          userId: data.user_id,
          brokerId: data.broker_id,
          accountNumber: data.account_data.account_number
        });
        
        if (error.code === '42P01') {
          throw new Error('MT5 account data table does not exist. Please run database migrations');
        } else if (error.code === '23505') {
          throw new Error('Duplicate account data entry');
        }
        
        throw new Error(`Failed to update MT5 account data: ${error.message || 'Unknown database error'}`);
      }

      console.log('✅ MT5 account data updated successfully for user:', data.user_id);
    } catch (error: any) {
      console.error('❌ Error in updateAccountData:', {
        message: error.message,
        userId: data.user_id,
        brokerId: data.broker_id,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
}

export const mt5Service = new MT5Service();
